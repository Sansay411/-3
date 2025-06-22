class FileSyncService {
  private syncInterval: NodeJS.Timeout | null = null
  private listeners: Map<string, Function[]> = new Map()
  private lastSync = 0

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const savedData = localStorage.getItem("anticor-sync-data")
      if (savedData) {
        const data = JSON.parse(savedData)
        this.lastSync = data.lastSync || 0
      }
    } catch (error) {
      console.warn("Failed to load sync data from storage:", error)
    }
  }

  private saveToStorage(data: any) {
    try {
      const syncData = {
        ...data,
        lastSync: Date.now(),
      }
      localStorage.setItem("anticor-sync-data", JSON.stringify(syncData))
      this.lastSync = Date.now()
    } catch (error) {
      console.warn("Failed to save sync data to storage:", error)
    }
  }

  async initialize(userId: string, userRole: string) {
    try {
      await this.loadSyncData()
      this.startSync()
      console.log("File sync service initialized for user:", userId)
    } catch (error) {
      console.warn("File sync service initialization failed:", error)
    }
  }

  private async loadSyncData() {
    try {
      const response = await fetch("/api/file-sync/load")
      if (response.ok) {
        const data = await response.json()

        if (data.events) {
          this.notify("events-loaded", data.events)
        }
        if (data.reports) {
          this.notify("reports-loaded", data.reports)
        }
        if (data.notifications) {
          this.notify("notifications-loaded", data.notifications)
        }

        this.saveToStorage(data)
      }
    } catch (error) {
      console.warn("Failed to load sync data:", error)
    }
  }

  async syncEvents(events: any[]) {
    try {
      const response = await fetch("/api/file-sync/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events,
          timestamp: Date.now(),
          action: "sync",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        this.saveToStorage({ events: data.events })
        return data.events
      }
    } catch (error) {
      console.warn("Events sync failed:", error)
    }
    return events
  }

  async syncReports(reports: any[]) {
    try {
      const response = await fetch("/api/file-sync/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reports,
          timestamp: Date.now(),
          action: "sync",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        this.saveToStorage({ reports: data.reports })
        return data.reports
      }
    } catch (error) {
      console.warn("Reports sync failed:", error)
    }
    return reports
  }

  async addEvent(event: any) {
    try {
      const response = await fetch("/api/file-sync/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          timestamp: Date.now(),
          action: "add",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        this.notify("event-added", data.event)
        return data.event
      }
    } catch (error) {
      console.warn("Add event failed:", error)
    }
    return null
  }

  async addReport(report: any) {
    try {
      const response = await fetch("/api/file-sync/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          report,
          timestamp: Date.now(),
          action: "add",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        this.notify("report-added", data.report)
        return data.report
      }
    } catch (error) {
      console.warn("Add report failed:", error)
    }
    return null
  }

  async updateEvent(eventId: number, updates: any) {
    try {
      const response = await fetch("/api/file-sync/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          updates,
          timestamp: Date.now(),
          action: "update",
        }),
      })

      if (response.ok) {
        const data = await response.json()
        this.notify("event-updated", { id: eventId, updates })
        return data.event
      }
    } catch (error) {
      console.warn("Update event failed:", error)
    }
    return null
  }

  async checkForUpdates() {
    try {
      const response = await fetch(`/api/file-sync/updates?since=${this.lastSync}`)
      if (response.ok) {
        const updates = await response.json()

        if (updates.hasUpdates) {
          if (updates.events && updates.events.length > 0) {
            this.notify("events-updated", updates.events)
          }

          if (updates.reports && updates.reports.length > 0) {
            this.notify("reports-updated", updates.reports)
          }

          if (updates.notifications && updates.notifications.length > 0) {
            this.notify("notifications-received", updates.notifications)
          }

          this.lastSync = updates.timestamp
          this.saveToStorage(updates)
        }
      }
    } catch (error) {
      console.warn("Check updates failed:", error)
    }
  }

  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  unsubscribe(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  private notify(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  private startSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    this.syncInterval = setInterval(async () => {
      await this.checkForUpdates()
    }, 3000)
  }

  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  cleanup() {
    this.stopSync()
    this.listeners.clear()
  }
}

export const fileSyncService = new FileSyncService()
