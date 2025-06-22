// Сервис синхронизации данных между устройствами
class SyncService {
  private baseUrl: string
  private syncInterval: NodeJS.Timeout | null = null
  private listeners: Map<string, Function[]> = new Map()

  constructor() {
    // Используем локальный сервер для синхронизации
    this.baseUrl = process.env.NEXT_PUBLIC_SYNC_URL || "http://localhost:3001"
  }

  // Инициализация синхронизации
  async initialize(userId: string, userRole: string) {
    try {
      // Регистрируем пользователя в системе синхронизации
      await this.registerUser(userId, userRole)

      // Запускаем периодическую синхронизацию
      this.startSync()

      console.log("Sync service initialized for user:", userId)
    } catch (error) {
      console.warn("Sync service not available, using local storage only")
      // Fallback к локальному хранилищу если сервер недоступен
    }
  }

  // Регистрация пользователя
  private async registerUser(userId: string, userRole: string) {
    try {
      await fetch(`${this.baseUrl}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userRole, timestamp: Date.now() }),
      })
    } catch (error) {
      console.warn("Failed to register user:", error)
    }
  }

  // Синхронизация событий
  async syncEvents(events: any[]) {
    try {
      const response = await fetch(`${this.baseUrl}/api/events/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events, timestamp: Date.now() }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.events
      }
    } catch (error) {
      console.warn("Events sync failed:", error)
    }
    return events
  }

  // Синхронизация сигналов
  async syncReports(reports: any[]) {
    try {
      const response = await fetch(`${this.baseUrl}/api/reports/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reports, timestamp: Date.now() }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.reports
      }
    } catch (error) {
      console.warn("Reports sync failed:", error)
    }
    return reports
  }

  // Отправка уведомления всем пользователям
  async broadcastNotification(notification: any) {
    try {
      await fetch(`${this.baseUrl}/api/notifications/broadcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      })
    } catch (error) {
      console.warn("Broadcast failed:", error)
    }
  }

  // Получение обновлений с сервера
  async getUpdates(lastSync: number) {
    try {
      const response = await fetch(`${this.baseUrl}/api/updates?since=${lastSync}`)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      console.warn("Failed to get updates:", error)
    }
    return null
  }

  // Подписка на события
  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  // Отписка от событий
  unsubscribe(event: string, callback: Function) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Уведомление слушателей
  private notify(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach((callback) => callback(data))
    }
  }

  // Запуск периодической синхронизации
  private startSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    this.syncInterval = setInterval(async () => {
      try {
        const lastSync = Number.parseInt(localStorage.getItem("lastSync") || "0")
        const updates = await this.getUpdates(lastSync)

        if (updates) {
          // Уведомляем о новых событиях
          if (updates.events) {
            this.notify("events-updated", updates.events)
          }

          // Уведомляем о новых сигналах
          if (updates.reports) {
            this.notify("reports-updated", updates.reports)
          }

          // Уведомляем о новых уведомлениях
          if (updates.notifications) {
            this.notify("notifications-received", updates.notifications)
          }

          localStorage.setItem("lastSync", Date.now().toString())
        }
      } catch (error) {
        console.warn("Sync failed:", error)
      }
    }, 5000) // Синхронизация каждые 5 секунд
  }

  // Остановка синхронизации
  stopSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // Очистка ресурсов
  cleanup() {
    this.stopSync()
    this.listeners.clear()
  }
}

export const syncService = new SyncService()
