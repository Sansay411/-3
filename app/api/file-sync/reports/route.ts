import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "sync-data")
const REPORTS_FILE = path.join(DATA_DIR, "reports.json")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

async function loadReports() {
  try {
    const data = await fs.readFile(REPORTS_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return [
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
    ]
  }
}

async function saveReports(reports: any[]) {
  await ensureDataDir()
  await fs.writeFile(REPORTS_FILE, JSON.stringify(reports, null, 2))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, report, reports, reportId, updates } = body

    const currentReports = await loadReports()

    switch (action) {
      case "add":
        const newReport = {
          ...report,
          id: Date.now(),
          lastModified: Date.now(),
        }
        currentReports.push(newReport)
        await saveReports(currentReports)

        await createNotification({
          type: "new-report",
          title: "Новый сигнал!",
          message: `Поступил сигнал: "${newReport.title}"`,
          reportId: newReport.id,
          priority: newReport.priority,
          timestamp: Date.now(),
        })

        return NextResponse.json({ report: newReport, reports: currentReports })

      case "update":
        const reportIndex = currentReports.findIndex((r: any) => r.id === reportId)
        if (reportIndex >= 0) {
          currentReports[reportIndex] = {
            ...currentReports[reportIndex],
            ...updates,
            lastModified: Date.now(),
          }
          await saveReports(currentReports)
        }
        return NextResponse.json({ report: currentReports[reportIndex], reports: currentReports })

      case "sync":
        if (reports) {
          reports.forEach((report: any) => {
            const existingIndex = currentReports.findIndex((r: any) => r.id === report.id)
            report.lastModified = Date.now()

            if (existingIndex >= 0) {
              currentReports[existingIndex] = { ...currentReports[existingIndex], ...report }
            } else {
              currentReports.push(report)
            }
          })
          await saveReports(currentReports)
        }
        return NextResponse.json({ reports: currentReports })

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Reports API error:", error)
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
