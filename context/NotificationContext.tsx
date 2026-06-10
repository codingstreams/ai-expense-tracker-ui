'use client'

import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { apiFetch } from "@/api/api-client"

// --- Types ---

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface JobState {
  jobId: string;
  status: JobStatus;
  timestamp?: string;
  error?: string;
}

interface JobCallbacks {
  onStatusChange?: (status: JobStatus) => void;
  onComplete?: () => void;
  onError?: (error?: string) => void;
}

interface NotificationContextType {
  /** Map of active job IDs to their current state */
  activeJobs: Map<string, JobState>;
  /** Start tracking a job's status updates */
  trackJob: (jobId: string, callbacks?: JobCallbacks) => void;
  /** Get the status of a specific job */
  getJobStatus: (jobId: string) => JobStatus | undefined;
  /** Remove a job from the active list */
  dismissJob: (jobId: string) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { accessToken } = useAuth()
  const [activeJobs, setActiveJobs] = useState<Map<string, JobState>>(new Map())
  const callbacksRef = useRef<Map<string, JobCallbacks>>(new Map())
  const [sessionId] = useState(() => typeof window !== "undefined" ? crypto.randomUUID() : "")

  // Sync active tasks on mount or token changes
  useEffect(() => {
    if (!accessToken) return

    const fetchActiveTasks = async () => {
      try {
        const tasks: { jobId: string; status: JobStatus }[] = await apiFetch("/api/ai-input/active")
        if (!tasks || !Array.isArray(tasks)) return
        setActiveJobs(prev => {
          const next = new Map(prev)
          for (const task of tasks) {
            if (!next.has(task.jobId)) {
              next.set(task.jobId, { jobId: task.jobId, status: task.status })
            }
          }
          return next
        })
      } catch (error) {
        console.error("Failed to fetch active tasks:", error)
      }
    }

    fetchActiveTasks()
  }, [accessToken])

  // Single persistent SSE connection
  useEffect(() => {
    if (!accessToken || !sessionId) return

    let isAborted = false
    const controller = new AbortController()
    const baseUrl = process.env.NEXT_PUBLIC_API_URL

    const connectSse = async () => {
      try {
        console.log(`[SSE] Connecting with Session ID: ${sessionId}`)
        const response = await fetch(`${baseUrl}/api/notifications/subscribe?sessionId=${sessionId}`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`SSE subscription failed with status ${response.status}`)
        }

        if (!response.body) {
          throw new Error("SSE response body is null")
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ""
        let currentEventName = ""

        while (!isAborted) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            const cleanLine = line.trim()
            if (cleanLine.startsWith("event:")) {
              currentEventName = cleanLine.substring(6).trim()
            } else if (cleanLine.startsWith("data:")) {
              const dataStr = cleanLine.substring(5).trim()
              try {
                const parsed = JSON.parse(dataStr)
                handleIncomingEvent(currentEventName, parsed)
              } catch (e) {
                console.warn("[SSE] Failed to parse event data payload:", dataStr)
              }
              currentEventName = ""
            }
          }
        }
      } catch (error) {
        if (controller.signal.aborted || isAborted) return
        console.error("[SSE] Connection error, retrying in 3 seconds...", error)
        setTimeout(() => {
          if (!isAborted && accessToken) {
            connectSse()
          }
        }, 3000)
      }
    }

    const handleIncomingEvent = (eventName: string, data: any) => {
      console.log(`[SSE] Received event: ${eventName}`, data)
      const jobId = data.jobId

      if (!jobId) return

      let mappedStatus: JobStatus | null = null
      if (eventName === "AI_TASK_PROCESSING") {
        mappedStatus = "PROCESSING"
      } else if (eventName === "AI_TASK_COMPLETED") {
        mappedStatus = "COMPLETED"
      } else if (eventName === "AI_TASK_FAILED") {
        mappedStatus = "FAILED"
      }

      if (mappedStatus) {
        const finalStatus = mappedStatus
        setActiveJobs(prev => {
          const next = new Map(prev)
          next.set(jobId, { jobId, status: finalStatus, error: data.error })
          return next
        })

        const callbacks = callbacksRef.current.get(jobId)
        if (callbacks) {
          callbacks.onStatusChange?.(finalStatus)
          if (finalStatus === "COMPLETED") {
            callbacks.onComplete?.()
            callbacksRef.current.delete(jobId)
          } else if (finalStatus === "FAILED") {
            callbacks.onError?.(data.error)
            callbacksRef.current.delete(jobId)
          }
        }
      }
    }

    connectSse()

    return () => {
      isAborted = true
      controller.abort()
    }
  }, [accessToken, sessionId])

  const trackJob = useCallback((jobId: string, callbacks?: JobCallbacks) => {
    setActiveJobs(prev => {
      const next = new Map(prev)
      next.set(jobId, { jobId, status: 'PENDING' })
      return next
    })
    if (callbacks) {
      callbacksRef.current.set(jobId, callbacks)
    }
  }, [])

  const getJobStatus = useCallback((jobId: string): JobStatus | undefined => {
    return activeJobs.get(jobId)?.status
  }, [activeJobs])

  const dismissJob = useCallback((jobId: string) => {
    callbacksRef.current.delete(jobId)
    setActiveJobs(prev => {
      const next = new Map(prev)
      next.delete(jobId)
      return next
    })
  }, [])

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

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider")
  }
  return context
}
