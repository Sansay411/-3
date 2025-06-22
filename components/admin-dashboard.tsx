"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Users,
  Activity,
  AlertTriangle,
  Settings,
  Database,
  BarChart3,
  UserCheck,
  Calendar,
  Globe,
} from "lucide-react"

interface AdminDashboardProps {
  user: any
}

const systemStats = [
  { label: "Всего пользователей", value: 2847, change: "+12%", icon: Users, color: "text-blue-600" },
  { label: "Активных сигналов", value: 23, change: "+5", icon: AlertTriangle, color: "text-red-600" },
  { label: "Мероприятий в месяц", value: 18, change: "+3", icon: Calendar, color: "text-green-600" },
  { label: "Системная нагрузка", value: "87%", change: "-2%", icon: Activity, color: "text-orange-600" },
]

const recentActivities = [
  { type: "user", message: "Новый модератор зарегистрирован", time: "5 мин назад", icon: UserCheck },
  { type: "report", message: "Критический сигнал требует внимания", time: "12 мин назад", icon: AlertTriangle },
  { type: "system", message: "Обновление системы завершено", time: "1 час назад", icon: Settings },
  { type: "event", message: "Мероприятие в Алматы отменено", time: "2 часа назад", icon: Calendar },
]

// Делаем быстрые действия администратора функциональными
const handleQuickAction = (actionType: string) => {
  switch (actionType) {
    case "users":
      alert("Открытие управления пользователями...")
      break
    case "settings":
      window.dispatchEvent(new CustomEvent("navigate", { detail: "settings" }))
      break
    case "analytics":
      alert("Открытие аналитики и отчетов...")
      break
    case "database":
      alert("Открытие управления базой данных...")
      break
    default:
      break
  }
}

// Обновляем quickActions с action полями
const quickActions = [
  {
    title: "Управление пользователями",
    description: "Роли, права доступа",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    action: "users",
  },
  {
    title: "Системные настройки",
    description: "Конфигурация платформы",
    icon: Settings,
    color: "from-gray-500 to-gray-600",
    action: "settings",
  },
  {
    title: "Аналитика и отчеты",
    description: "Статистика использования",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
    action: "analytics",
  },
  {
    title: "База данных",
    description: "Резервное копирование",
    icon: Database,
    color: "from-green-500 to-green-600",
    action: "database",
  },
]

export function AdminDashboard({ user }: AdminDashboardProps) {
  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Заголовок администратора */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl mr-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Панель администратора</h1>
                <p className="text-slate-300 mt-1">Добро пожаловать, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Globe className="w-3 h-3 mr-1" />
                Системный доступ
              </Badge>
              <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
                <Activity className="w-3 h-3 mr-1" />
                Система активна
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">99.8%</p>
            <p className="text-slate-300 text-sm">Время работы</p>
          </div>
        </div>
      </div>

      {/* Системная статистика */}
      <div className="grid grid-cols-2 gap-4">
        {systemStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="h-1 bg-gradient-to-r from-slate-400 to-slate-600" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-slate-100 ${stat.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Быстрые действия */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Settings className="w-5 h-5 mr-2" />
            Управление системой
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <div
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="p-4 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-3 group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{action.title}</h3>
                <p className="text-sm text-slate-600">{action.description}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Последняя активность */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Activity className="w-5 h-5 mr-2" />
            Системная активность
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentActivities.map((activity, index) => {
            const IconComponent = activity.icon
            return (
              <div key={index} className="flex items-center p-3 bg-slate-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                  <IconComponent className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                  <p className="text-xs text-slate-500">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
