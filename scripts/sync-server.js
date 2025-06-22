// Простой сервер синхронизации для демонстрации
const http = require("http")
const url = require("url")

// Глобальное хранилище данных
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

const server = http.createServer((req, res) => {
  // Настройка CORS
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  const parsedUrl = url.parse(req.url, true)
  const path = parsedUrl.pathname

  console.log(`${req.method} ${path}`)

  if (path === "/api/updates" && req.method === "GET") {
    // Получение обновлений
    const since = Number.parseInt(parsedUrl.query.since) || 0

    const updates = {
      events: globalData.events.filter((e) => (e.lastModified || 0) > since),
      reports: globalData.reports.filter((r) => (r.lastModified || 0) > since),
      notifications: globalData.notifications.filter((n) => (n.timestamp || 0) > since),
      timestamp: Date.now(),
    }

    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify(updates))
  } else if (path.startsWith("/api/") && req.method === "POST") {
    // Обработка POST запросов
    let body = ""

    req.on("data", (chunk) => {
      body += chunk.toString()
    })

    req.on("end", () => {
      try {
        const data = JSON.parse(body)

        if (path === "/api/events/sync") {
          // Синхронизация событий
          if (data.events) {
            data.events.forEach((event) => {
              const existingIndex = globalData.events.findIndex((e) => e.id === event.id)
              event.lastModified = Date.now()

              if (existingIndex >= 0) {
                globalData.events[existingIndex] = { ...globalData.events[existingIndex], ...event }
              } else {
                globalData.events.push(event)
              }
            })
          }

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ events: globalData.events }))
        } else if (path === "/api/reports/sync") {
          // Синхронизация сигналов
          if (data.reports) {
            data.reports.forEach((report) => {
              const existingIndex = globalData.reports.findIndex((r) => r.id === report.id)
              report.lastModified = Date.now()

              if (existingIndex >= 0) {
                globalData.reports[existingIndex] = { ...globalData.reports[existingIndex], ...report }
              } else {
                globalData.reports.push(report)
              }
            })
          }

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ reports: globalData.reports }))
        } else if (path === "/api/notifications/broadcast") {
          // Рассылка уведомлений
          const notification = {
            ...data,
            id: Date.now().toString(),
            timestamp: Date.now(),
          }
          globalData.notifications.push(notification)

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ success: true }))
        } else if (path === "/api/users/register") {
          // Регистрация пользователя
          globalData.users.set(data.userId, {
            ...data,
            lastSeen: Date.now(),
          })

          res.writeHead(200, { "Content-Type": "application/json" })
          res.end(JSON.stringify({ success: true }))
        } else {
          res.writeHead(404)
          res.end("Not Found")
        }

        globalData.lastUpdate = Date.now()
      } catch (error) {
        console.error("Error processing request:", error)
        res.writeHead(500, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "Internal Server Error" }))
      }
    })
  } else {
    res.writeHead(404)
    res.end("Not Found")
  }
})

const PORT = 3001
server.listen(PORT, () => {
  console.log(`🚀 Sync server running on http://localhost:${PORT}`)
  console.log("📱 Ready for multi-device synchronization demo!")
})
