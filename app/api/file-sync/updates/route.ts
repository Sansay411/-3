import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "sync-data")

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const since = Number.parseInt(url.searchParams.get("since") || "0")

    const updates: any = {
      hasUpdates: false,
      events: [],
      reports: [],
      notifications: [],
      timestamp: Date.now(),
    }

    try {
      const eventsData = await fs.readFile(path.join(DATA_DIR, "events.json"), "utf-8")
      const events = JSON.parse(eventsData)
      const updatedEvents = events.filter((e: any) => (e.lastModified || 0) > since)

      if (updatedEvents.length > 0) {
        updates.hasUpdates = true
        updates.events = events
      }
    } catch {}

    try {
      const reportsData = await fs.readFile(path.join(DATA_DIR, "reports.json"), "utf-8")
      const reports = JSON.parse(reportsData)
      const updatedReports = reports.filter((r: any) => (r.lastModified || 0) > since)

      if (updatedReports.length > 0) {
        updates.hasUpdates = true
        updates.reports = reports
      }
    } catch {}

    try {
      const notificationsData = await fs.readFile(path.join(DATA_DIR, "notifications.json"), "utf-8")
      const notifications = JSON.parse(notificationsData)
      const newNotifications = notifications.filter((n: any) => (n.timestamp || 0) > since)

      if (newNotifications.length > 0) {
        updates.hasUpdates = true
        updates.notifications = newNotifications
      }
    } catch {}

    return NextResponse.json(updates)
  } catch (error) {
    console.error("Updates check error:", error)
    return NextResponse.json({
      hasUpdates: false,
      events: [],
      reports: [],
      notifications: [],
      timestamp: Date.now(),
    })
  }
}
