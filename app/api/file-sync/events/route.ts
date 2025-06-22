import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "sync-data")
const EVENTS_FILE = path.join(DATA_DIR, "events.json")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function loadEvents() {
  try {
    const data = await fs.readFile(EVENTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return [
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
      {
        id: 2,
        title: 'Флешмоб "За честность в образовании"',
        date: "2024-01-28",
        time: "15:00",
        location: "Алматы, площадь Республики",
        participants: 23,
        maxParticipants: 50,
        points: 30,
        type: "flashmob",
        status: "upcoming",
        description: "Мирная акция за прозрачность в образовательной системе",
        organizer: "Организатор Е.Токтаров",
        createdBy: "organizer",
        lastModified: Date.now(),
      },
    ]
  }
}

async function saveEvents(events: any[]) {
  await ensureDataDir()
  await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, event, events, eventId, updates } = body

    const currentEvents = await loadEvents()

    switch (action) {
      case "add":
        const newEvent = {
          ...event,
          id: Date.now(),
          lastModified: Date.now(),
        }
        currentEvents.push(newEvent)
        await saveEvents(currentEvents)

        await createNotification({
          type: "new-event",
          title: "Новое мероприятие!",
          message: `Создано мероприятие "${newEvent.title}"`,
          eventId: newEvent.id,
          timestamp: Date.now(),
        })

        return NextResponse.json({ event: newEvent, events: currentEvents })

      case "update":
        const eventIndex = currentEvents.findIndex((e: any) => e.id === eventId)
        if (eventIndex >= 0) {
          currentEvents[eventIndex] = {
            ...currentEvents[eventIndex],
            ...updates,
            lastModified: Date.now(),
          }
          await saveEvents(currentEvents)
        }
        return NextResponse.json({ event: currentEvents[eventIndex], events: currentEvents })

      case "sync":
        if (events) {
          events.forEach((event: any) => {
            const existingIndex = currentEvents.findIndex((e: any) => e.id === event.id)
            event.lastModified = Date.now()

            if (existingIndex >= 0) {
              currentEvents[existingIndex] = { ...currentEvents[existingIndex], ...event }
            } else {
              currentEvents.push(event)
            }
          })
          await saveEvents(currentEvents)
        }
        return NextResponse.json({ events: currentEvents })

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Events API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function createNotification(notification: any) {
  try {
    const notificationsFile = path.join(DATA_DIR, "notifications.json")
    let notifications = []

    try {
      const data = await fs.readFile(notificationsFile, "utf-8")
      notifications = JSON.parse(data)
    } catch {}

    notifications.push({
      ...notification,
      id: Date.now().toString(),
    })

    await fs.writeFile(notificationsFile, JSON.stringify(notifications, null, 2))
  } catch (error) {
    console.error("Failed to create notification:", error)
  }
}
