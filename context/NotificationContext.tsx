'use client'

import { createContext, ReactNode, useCallback, useRef, useState } from "react"

// --- Types ---

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface JobState {
  jobId: string;
  status: JobStatus;
  timestamp?: string;
}

interface JobCallbacks {
  onStatusChange?: (status: JobStatus) => void;
  onComplete?: () => void;
  onError?: () => void;
}

interface NotificationContextType {
  /** Map of active job IDs to their current state */
  activeJobs: Map<string, JobState>;
  /** Start tracking a job's SSE stream */
  trackJob: (jobId: string, callbacks?: JobCallbacks) => void;
  /** Get the status of a specific job */
  getJobStatus: (jobId: string) => JobStatus | undefined;
  /** Remove a job from the active list (after UI acknowledges) */
  dismissJob: (jobId: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// --- SSE Stream Parser ---

function createSseStreamReader(
  jobId: string,
  onEvent: (data: JobState) => void,
  onStreamEnd: () => void,
  onStreamError: (error: Error) => void,
): AbortController {
  const controller = new AbortController();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem("accessToken");

  (async () => {
    try {
      const response = await fetch(`${baseUrl}/api/notifications/status/${jobId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`SSE connection failed with status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("SSE response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith("data:")) {
            const dataStr = cleanLine.substring(5).trim();
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.status) {
                onEvent({
                  jobId: parsed.jobId || jobId,
                  status: parsed.status as JobStatus,
                  timestamp: parsed.timestamp,
                });
              }
            } catch {
              console.warn("[SSE] Failed to parse event data:", dataStr);
            }
          }
        }
      }

      onStreamEnd();
    } catch (error) {
      if (controller.signal.aborted) return; // Intentional abort
      onStreamError(error instanceof Error ? error : new Error(String(error)));
    }
  })();

  return controller;
}

// --- Provider ---

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [activeJobs, setActiveJobs] = useState<Map<string, JobState>>(new Map());
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const trackJob = useCallback((jobId: string, callbacks?: JobCallbacks) => {
    // Set initial state
    setActiveJobs(prev => {
      const next = new Map(prev);
      next.set(jobId, { jobId, status: 'PENDING' });
      return next;
    });

    const controller = createSseStreamReader(
      jobId,
      // onEvent
      (jobState) => {
        setActiveJobs(prev => {
          const next = new Map(prev);
          next.set(jobId, jobState);
          return next;
        });

        callbacks?.onStatusChange?.(jobState.status);

        if (jobState.status === 'COMPLETED') {
          callbacks?.onComplete?.();
        } else if (jobState.status === 'FAILED') {
          callbacks?.onError?.();
        }
      },
      // onStreamEnd
      () => {
        abortControllersRef.current.delete(jobId);
      },
      // onStreamError
      (error) => {
        console.error(`[SSE] Stream error for job ${jobId}:`, error);
        setActiveJobs(prev => {
          const next = new Map(prev);
          next.set(jobId, { jobId, status: 'FAILED' });
          return next;
        });
        callbacks?.onError?.();
        abortControllersRef.current.delete(jobId);
      },
    );

    abortControllersRef.current.set(jobId, controller);
  }, []);

  const getJobStatus = useCallback((jobId: string): JobStatus | undefined => {
    return activeJobs.get(jobId)?.status;
  }, [activeJobs]);

  const dismissJob = useCallback((jobId: string) => {
    // Abort the stream if still active
    const controller = abortControllersRef.current.get(jobId);
    if (controller) {
      controller.abort();
      abortControllersRef.current.delete(jobId);
    }

    setActiveJobs(prev => {
      const next = new Map(prev);
      next.delete(jobId);
      return next;
    });
  }, []);

  return (
    <NotificationContext.Provider value={{
      activeJobs,
      trackJob,
      getJobStatus,
      dismissJob,
    }}>
      {children}
    </NotificationContext.Provider>
  )
}
