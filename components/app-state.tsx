"use client"

import type React from "react"

import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { fileSyncService } from "@/lib/file-sync-service"

interface AppState {
  user: any
  events: any[]
  reports: any[]
  courses: any[]
  notifications: any[]
  settings: any
  globalEvents: any[]
  globalReports: any[]
  isOnline: boolean
  lastSync: number
  isLoading: boolean
}

interface AppAction {
  type: string
  payload?: any
}

const initialState: AppState = {
  user: null,
  events: [],
  reports: [],
  courses: [],
  notifications: [],
  settings: {
    pushNotifications: true,
    emailNotifications: true,
    darkMode: false,
    language: "ru",
  },
  globalEvents: [],
  globalReports: [],
  isOnline: true,
  lastSync: 0,
  isLoading: true,
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload }

    case "UPDATE_USER":
      return { ...state, user: { ...state.user, ...action.payload } }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_ONLINE_STATUS":
      return { ...state, isOnline: action.payload }

    case "LOAD_INITIAL_DATA":
      return {
        ...state,
        globalEvents: action.payload.events || [],
        globalReports: action.payload.reports || [],
        notifications: action.payload.notifications || [],
        lastSync: Date.now(),
        isLoading: false,
      }

    case "SYNC_EVENTS":
      return { ...state, globalEvents: action.payload, lastSync: Date.now() }

    case "SYNC_REPORTS":
      return { ...state, globalReports: action.payload, lastSync: Date.now() }

    case "REGISTER_EVENT":
      const updatedEvents = state.globalEvents.map((event) =>
        event.id === action.payload.eventId
          ? { ...event, participants: event.participants + 1, lastModified: Date.now() }
          : event,
      )

      fileSyncService.syncEvents(updatedEvents)

      return { ...state, globalEvents: updatedEvents }

    case "CANCEL_EVENT_REGISTRATION":
      const cancelledEvents = state.globalEvents.map((event) =>
        event.id === action.payload.eventId
          ? { ...event, participants: Math.max(0, event.participants - 1), lastModified: Date.now() }
          : event,
      )

      fileSyncService.syncEvents(cancelledEvents)

      return { ...state, globalEvents: cancelledEvents }

    case "ADD_GLOBAL_EVENT":
      fileSyncService.addEvent(action.payload)
      return state

    case "UPDATE_GLOBAL_EVENT":
      fileSyncService.updateEvent(action.payload.id, action.payload.updates)
      return state

    case "ADD_GLOBAL_REPORT":
      fileSyncService.addReport(action.payload)
      return state

    case "UPDATE_GLOBAL_REPORT":
      const updatedGlobalReports = state.globalReports.map((report) =>
        report.id === action.payload.id ? { ...report, ...action.payload.updates, lastModified: Date.now() } : report,
      )

      fileSyncService.syncReports(updatedGlobalReports)

      return { ...state, globalReports: updatedGlobalReports }

    case "ADD_REPORT":
      return {
        ...state,
        reports: [...state.reports, action.payload],
        globalReports: [...state.globalReports, { ...action.payload, lastModified: Date.now() }],
      }

    case "UPDATE_REPORT":
      return {
        ...state,
        reports: state.reports.map((report) =>
          report.id === action.payload.id ? { ...report, ...action.payload.updates } : report,
        ),
        globalReports: state.globalReports.map((report) =>
          report.id === action.payload.id ? { ...report, ...action.payload.updates, lastModified: Date.now() } : report,
        ),
      }

    case "START_COURSE":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId ? { ...course, status: "in_progress", progress: 0 } : course,
        ),
      }

    case "UPDATE_COURSE_PROGRESS":
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.courseId ? { ...course, progress: action.payload.progress } : course,
        ),
      }

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      }

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: state.notifications.map((notif) =>
          notif.id === action.payload.id ? { ...notif, read: true } : notif,
        ),
      }

    case "UPDATE_SETTINGS":
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      }

    default:
      return state
  }
}

const AppStateContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const initializeSync = async () => {
      try {
        const response = await fetch("/api/file-sync/load")
        if (response.ok) {
          const data = await response.json()
          dispatch({ type: "LOAD_INITIAL_DATA", payload: data })
        } else {
          dispatch({ type: "SET_LOADING", payload: false })
        }
      } catch (error) {
        console.error("Failed to load initial data:", error)
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }

    initializeSync()
  }, [])

  useEffect(() => {
    if (state.user) {
      fileSyncService.initialize(state.user.id, state.user.role)

      fileSyncService.subscribe("events-loaded", (events: any[]) => {
        dispatch({ type: "SYNC_EVENTS", payload: events })
      })

      fileSyncService.subscribe("reports-loaded", (reports: any[]) => {
        dispatch({ type: "SYNC_REPORTS", payload: reports })
      })

      fileSyncService.subscribe("events-updated", (events: any[]) => {
        dispatch({ type: "SYNC_EVENTS", payload: events })
      })

      fileSyncService.subscribe("reports-updated", (reports: any[]) => {
        dispatch({ type: "SYNC_REPORTS", payload: reports })
      })

      fileSyncService.subscribe("event-added", (event: any) => {
        dispatch({ type: "SYNC_EVENTS", payload: [...state.globalEvents, event] })
      })

      fileSyncService.subscribe("report-added", (report: any) => {
        dispatch({ type: "SYNC_REPORTS", payload: [...state.globalReports, report] })
      })

      fileSyncService.subscribe("notifications-received", (notifications: any[]) => {
        notifications.forEach((notification: any) => {
          dispatch({ type: "ADD_NOTIFICATION", payload: notification })
        })
      })

      const handleOnline = () => dispatch({ type: "SET_ONLINE_STATUS", payload: true })
      const handleOffline = () => dispatch({ type: "SET_ONLINE_STATUS", payload: false })

      window.addEventListener("online", handleOnline)
      window.addEventListener("offline", handleOffline)

      return () => {
        window.removeEventListener("online", handleOnline)
        window.removeEventListener("offline", handleOffline)
        fileSyncService.cleanup()
      }
    }
  }, [state.user])

  return <AppStateContext.Provider value={{ state, dispatch }}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider")
  }
  return context
}
