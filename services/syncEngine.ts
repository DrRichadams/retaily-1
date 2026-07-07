// services/syncEngine.ts
import { getUnsyncedCount, getUnsyncedTransactions, markAsSynced } from "./db";

let isSyncing = false;

export async function triggerBackgroundSync(
  onCountUpdate?: (count: number) => void,
): Promise<boolean> {
  if (isSyncing) return false;
  isSyncing = true;

  try {
    const unsyncedTickets = await getUnsyncedTransactions();

    if (unsyncedTickets.length === 0) {
      isSyncing = false;
      if (onCountUpdate) onCountUpdate(0);
      return true;
    }

    for (const ticket of unsyncedTickets) {
      // Simulation of your Supabase Edge Function / central REST API endpoint payload upload
      const response = await fetch(
        "https://api.retaily.os/v1/sync-transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ticket),
        },
      );

      if (response.ok) {
        await markAsSynced(ticket.id);
        if (onCountUpdate) {
          const currentCount = await getUnsyncedCount();
          onCountUpdate(currentCount);
        }
      } else {
        // Stop the loop early if your backend throws an endpoint error or server fault
        throw new Error(
          "Network drop detected during queue upload processing.",
        );
      }
    }

    isSyncing = false;
    return true;
  } catch (error) {
    console.log(
      "Sync Core Status Alert: Host unreachable. Transactions safely cached inside SQLite.",
    );
    isSyncing = false;
    // Call count update anyway to ensure local interface states are perfectly preserved
    if (onCountUpdate) {
      const currentCount = await getUnsyncedCount();
      onCountUpdate(currentCount);
    }
    return false;
  }
}
