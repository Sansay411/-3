"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { useAppState } from "@/components/app-state"

export function SyncIndicator() {
  const { state } = useAppState()

  if (state.isLoading) {
    return (
      <div className="fixed top-4 left-4 z-50">
        <Badge className="bg-blue-100 text-blue-800">Загрузка данных...</Badge>
      </div>
    )
  }

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col space-y-1">
      <Badge className={state.isOnline ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
        {state.isOnline ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
        {state.isOnline ? "Онлайн" : "Офлайн"}
      </Badge>

      <Badge className="bg-gray-100 text-gray-800">
        <span className="text-xs">
          📅 {state.globalEvents.length} событий | 🚨 {state.globalReports.length} сигналов
        </span>
      </Badge>
    </div>
  )
}
