"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  UserCheck,
  AlertTriangle,
  Eye,
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  TrendingUp,
  Filter,
  Search,
} from "lucide-react"
import { useAppState } from "@/components/app-state"

interface ModeratorDashboardProps {
  user: any
}

const quickModerationActions = [
  {
    title: "Обработать сигналы",
    description: "Новые поступления",
    icon: AlertTriangle,
    count: 8,
    color: "from-red-500 to-red-600",
  },
  {
    title: "Модерация контента",
    description: "Проверка материалов",
    icon: FileText,
    count: 4,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Чаты и сообщения",
    description: "Поддержка пользователей",
    icon: MessageSquare,
    count: 12,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Аналитика работы",
    description: "Отчеты и статистика",
    icon: TrendingUp,
    count: 0,
    color: "from-purple-500 to-purple-600",
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200"
    case "medium":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export function ModeratorDashboard({ user }: ModeratorDashboardProps) {
  const { state } = useAppState()

  const moderationStats = [
    {
      label: "Новые сигналы",
      value: state.globalReports.filter((r) => r.status === "pending").length,
      urgent: state.globalReports.filter((r) => r.status === "pending" && r.priority === "high").length,
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      label: "В обработке",
      value: state.globalReports.filter((r) => r.status === "investigating").length,
      urgent: 0,
      icon: Eye,
      color: "text-blue-600",
    },
    {
      label: "Решено сегодня",
      value: state.globalReports.filter((r) => r.status === "resolved").length,
      urgent: 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Требует внимания",
      value: state.globalReports.filter((r) => r.priority === "high" && r.status === "pending").length,
      urgent: state.globalReports.filter((r) => r.priority === "high" && r.status === "pending").length,
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  const pendingReports = state.globalReports.filter((r) => r.status === "pending").slice(0, 3)

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Заголовок модератора */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl mr-4">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Модерация Антикор</h1>
                <p className="text-blue-100 mt-1">Добро пожаловать, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Eye className="w-3 h-3 mr-1" />
                Модератор
              </Badge>
              <Badge className="bg-red-500/20 text-red-200 border-red-400/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {state.globalReports.filter((r) => r.status === "pending").length} новых сигналов
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{state.globalReports.length}</p>
            <p className="text-blue-100 text-sm">Всего дел</p>
          </div>
        </div>
      </div>

      {/* Статистика модерации */}
      <div className="grid grid-cols-2 gap-4">
        {moderationStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-600" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-blue-50 ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {stat.urgent > 0 && <Badge className="bg-red-100 text-red-800 text-xs">{stat.urgent} срочных</Badge>}
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Быстрые действия модератора */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Filter className="w-5 h-5 mr-2" />
            Рабочие инструменты
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {quickModerationActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-white to-blue-50 border border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group relative"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-3 group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                {action.count > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {action.count}
                  </div>
                )}
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Ожидающие сигналы */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-slate-800">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Требуют рассмотрения
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="bg-white"
              onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "reports" }))}
            >
              <Search className="w-4 h-4 mr-2" />
              Все сигналы
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingReports.length > 0 ? (
            pendingReports.map((report) => (
              <div
                key={report.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{report.title}</h3>
                  <Badge className={getPriorityColor(report.priority)}>
                    {report.priority === "high" ? "Высокий" : report.priority === "medium" ? "Средний" : "Низкий"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <div className="flex items-center space-x-4">
                    <span>{report.category}</span>
                    <span>•</span>
                    <span>{report.location}</span>
                  </div>
                  <span>{new Date(report.submittedAt).toLocaleDateString("ru-RU")}</span>
                </div>
                <div className="flex justify-end mt-3 space-x-2">
                  <Button variant="outline" size="sm" className="bg-white">
                    Подробнее
                  </Button>
                  <Button
                    size="sm"
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "reports" }))}
                  >
                    Взять в работу
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Нет новых сигналов для рассмотрения</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
