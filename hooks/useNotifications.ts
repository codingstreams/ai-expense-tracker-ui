import { useContext } from "react";
import { NotificationContext } from "@/context/NotificationContext";

/**
 * Hook to access the SSE notification store.
 * Must be used within a NotificationProvider.
 *
 * @example
 * const { trackJob, getJobStatus, dismissJob, activeJobs } = useNotifications();
 *
 * // Start tracking an AI parsing job
 * trackJob(jobId, {
 *   onStatusChange: (status) => console.log("Status:", status),
 *   onComplete: () => refreshTransactions(),
 *   onError: () => showErrorToast(),
 * });
 */
export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }

  return context;
}
