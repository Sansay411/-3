import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "sync-data")

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

export async function GET() {
  try {
    await ensureDataDir()

    const data: any = {
      events: [],
      reports: [],
      notifications: [],
      timestamp: Date.now(),
    }

    try {
      const eventsData = await fs.readFile(path.join(DATA_DIR, "events.json"), "utf-8")
      data.events = JSON.parse(eventsData)
    } catch {
      data.events = []
    }

    try {
      const reportsData = await fs.readFile(path.join(DATA_DIR, "reports.json"), "utf-8")
      data.reports = JSON.parse(reportsData)
    } catch {
      data.reports = []
    }

    try {
      const notificationsData = await fs.readFile(path.join(DATA_DIR, "notifications.json"), "utf-8")
      data.notifications = JSON.parse(notificationsData)
    } catch {
      data.notifications = []
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Load data error:", error)
    return NextResponse.json({
      events: [],
      reports: [],
      notifications: [],
      timestamp: Date.now(),
    })
  }
}
