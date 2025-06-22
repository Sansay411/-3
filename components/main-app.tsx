"use client"

import { useState, useEffect } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Settings } from "@/components/settings"
import { Leaderboard } from "@/components/leaderboard"
import { Events } from "@/components/events"
import { Chatbot } from "@/components/chatbot"
import { Learning } from "@/components/learning"
import { Reports } from "@/components/reports"
import { Emergency } from "@/components/emergency"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ModeratorDashboard } from "@/components/moderator-dashboard"
import { OrganizerDashboard } from "@/components/organizer-dashboard"
import { VolunteerDashboard } from "@/components/volunteer-dashboard"
import { SyncIndicator } from "@/components/sync-indicator"
import { useAppState } from "@/components/app-state"

interface MainAppProps {
  user: any
  onLogout: () => void
}

export function MainApp({ user, onLogout }: MainAppProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { state, dispatch } = useAppState()

  // Инициализируем пользователя в глобальном состоянии
  useEffect(() => {
    if (user && !state.user) {
      dispatch({ type: "SET_USER", payload: user })
    }
  }, [user, state.user, dispatch])

  // Добавляем обработчик навигационных событий
  useEffect(() => {
    const handleNavigate = (event: any) => {
      setActiveTab(event.detail)
    }

    window.addEventListener("navigate", handleNavigate)
    return () => window.removeEventListener("navigate", handleNavigate)
  }, [])

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        switch (user.role) {
          case "admin":
            return <AdminDashboard user={user} />
          case "moderator":
            return <ModeratorDashboard user={user} />
          case "organizer":
            return <OrganizerDashboard user={user} />
          default:
            return <VolunteerDashboard user={user} />
        }
      case "settings":
        return <Settings user={user} onLogout={onLogout} />
      case "leaderboard":
        return <Leaderboard user={user} />
      case "events":
        return <Events user={user} />
      case "chatbot":
        return <Chatbot user={user} />
      case "learning":
        return <Learning user={user} />
      case "reports":
        return <Reports user={user} />
      case "emergency":
        return <Emergency user={user} />
      default:
        return <VolunteerDashboard user={user} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SyncIndicator />
      <div className="pb-20">{renderContent()}</div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} userRole={user.role} />
    </div>
  )
}
