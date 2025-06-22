import { type NextRequest, NextResponse } from "next/server"

// Глобальное хранилище данных (в реальном приложении это была бы база данных)
const globalData = {
  events: [
    {
      id: 1,
      title: "Лекция: Антикоррупционное законодательство РК",
      date: "2024-01-25",
      time: "18:00",
      location: "Алматы, КазНУ им. аль-Фараби",
      participants: 45,
      maxParticipants: 100,
      points: 25,
      type: "lecture",
      status: "upcoming",
      description: "Изучение основ антикоррупционного законодательства Республики Казахстан",
      organizer: "Модератор А.Нурланова",
      createdBy: "admin",
      lastModified: Date.now(),
    },
  ],
  reports: [
    {
      id: 1,
      title: "Вымогательство взятки в ЦОНе",
      description: "Сотрудник требует дополнительную плату за ускорение оформления документов",
      category: "bribery",
      status: "pending",
      priority: "high",
      location: "Алматы, ЦОН Алмалинского района",
      submittedBy: "Волонтёр А.Касымов",
      submittedAt: "2024-01-20T10:30:00Z",
      assignedTo: "Ожидает назначения",
      createdBy: "volunteer",
      lastModified: Date.now(),
    },
  ],
  notifications: [],
  users: new Map(),
  lastUpdate: Date.now(),
}

// Получение всех данных
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const since = Number.parseInt(url.searchParams.get("since") || "0")

  // Возвращаем только обновления после указанного времени
  const updates = {
    events: globalData.events.filter((e) => (e.lastModified || 0) > since),
    reports: globalData.reports.filter((r) => (r.lastModified || 0) > since),
    notifications: globalData.notifications.filter((n: any) => (n.timestamp || 0) > since),
    timestamp: Date.now(),
  }

  return NextResponse.json(updates)
}

// Синхронизация данных
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    switch (type) {
      case "events":
        // Обновляем события
        if (data.events) {
          data.events.forEach((event: any) => {
            const existingIndex = globalData.events.findIndex((e) => e.id === event.id)
            event.lastModified = Date.now()

            if (existingIndex >= 0) {
              globalData.events[existingIndex] = { ...globalData.events[existingIndex], ...event }
            } else {
              globalData.events.push(event)
            }
          })
        }
        break

      case "reports":
        // Обновляем сигналы
        if (data.reports) {
          data.reports.forEach((report: any) => {
            const existingIndex = globalData.reports.findIndex((r) => r.id === report.id)
            report.lastModified = Date.now()

            if (existingIndex >= 0) {
              globalData.reports[existingIndex] = { ...globalData.reports[existingIndex], ...report }
            } else {
              globalData.reports.push(report)
            }
          })
        }
        break

      case "notification":
        // Добавляем уведомление
        const notification = {
          ...data,
          id: Date.now().toString(),
          timestamp: Date.now(),
        }
        globalData.notifications.push(notification)
        break

      case "user-register":
        // Регистрируем пользователя
        globalData.users.set(data.userId, {
          ...data,
          lastSeen: Date.now(),
        })
        break
    }

    globalData.lastUpdate = Date.now()

    return NextResponse.json({
      success: true,
      data: globalData,
      timestamp: globalData.lastUpdate,
    })
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json({ error: "Sync failed" }, { status: 500 })
  }
}
