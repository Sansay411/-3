"use client"

import { Home, Calendar, AlertTriangle, Trophy, Settings } from "lucide-react"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  userRole: string
}

const tabs = [
  { id: "dashboard", label: "Главная", icon: Home, roles: ["volunteer", "moderator", "organizer", "admin"] },
  { id: "events", label: "События", icon: Calendar, roles: ["volunteer", "moderator", "organizer", "admin"] },
  { id: "leaderboard", label: "Рейтинг", icon: Trophy, roles: ["volunteer", "moderator", "organizer"] },
  { id: "reports", label: "Сигналы", icon: AlertTriangle, roles: ["volunteer", "organizer", "moderator", "admin"] },
  { id: "settings", label: "Настройки", icon: Settings, roles: ["volunteer", "moderator", "organizer", "admin"] },
]

export function BottomNavigation({ activeTab, onTabChange, userRole }: BottomNavigationProps) {
  const visibleTabs = tabs.filter((tab) => tab.roles.includes(userRole))

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/50 px-2 py-1 shadow-2xl">
      <div className="flex justify-around max-w-md mx-auto">
        {visibleTabs.slice(0, 5).map((tab) => {
          const IconComponent = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "text-blue-600 bg-blue-50 shadow-lg transform scale-105"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
              }`}
            >
              <IconComponent className={`w-5 h-5 mb-1 ${isActive ? "drop-shadow-sm" : ""}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
