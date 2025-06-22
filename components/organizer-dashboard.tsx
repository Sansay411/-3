"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Clock, Plus, CheckCircle, BarChart3, Target } from "lucide-react"
import { useAppState } from "@/components/app-state"

interface OrganizerDashboardProps {
  user: any
}

const organizerActions = [
  { title: "Создать мероприятие", description: "Новое событие", icon: Plus, color: "from-green-500 to-green-600" },
  {
    title: "Управление участниками",
    description: "Регистрации и списки",
    icon: Users,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Аналитика событий",
    description: "Статистика посещений",
    icon: BarChart3,
    color: "from-purple-500 to-purple-600",
  },
  { title: "Планирование", description: "Календарь и ресурсы", icon: Target, color: "from-orange-500 to-orange-600" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "upcoming":
      return "bg-green-100 text-green-800 border-green-200"
    case "planning":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "completed":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "upcoming":
      return "Активно"
    case "planning":
      return "Планируется"
    case "completed":
      return "Завершено"
    default:
      return "Неизвестно"
  }
}

export function OrganizerDashboard({ user }: OrganizerDashboardProps) {
  const { state } = useAppState()

  const eventStats = [
    {
      label: "Активные события",
      value: state.globalEvents.filter((e) => e.status === "upcoming").length,
      change: "+2",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      label: "Участников всего",
      value: state.globalEvents.reduce((sum, e) => sum + e.participants, 0),
      change: "+45",
      icon: Users,
      color: "text-green-600",
    },
    {
      label: "Этот месяц",
      value: state.globalEvents.filter((e) => e.status === "completed").length,
      change: "0",
      icon: CheckCircle,
      color: "text-purple-600",
    },
    {
      label: "Планируется",
      value: state.globalEvents.filter((e) => e.status === "upcoming").length,
      change: "+3",
      icon: Clock,
      color: "text-orange-600",
    },
  ]

  const upcomingEvents = state.globalEvents.filter((e) => e.status === "upcoming").slice(0, 3)

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 min-h-screen">
      {/* Заголовок организатора */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-green-600/20" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl mr-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Центр мероприятий</h1>
                <p className="text-green-100 mt-1">Добро пожаловать, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Calendar className="w-3 h-3 mr-1" />
                Организатор
              </Badge>
              <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                {state.globalEvents.filter((e) => e.status === "upcoming").length} активных событий
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{state.globalEvents.reduce((sum, e) => sum + e.participants, 0)}</p>
            <p className="text-green-100 text-sm">Участников</p>
          </div>
        </div>
      </div>

      {/* Статистика мероприятий */}
      <div className="grid grid-cols-2 gap-4">
        {eventStats.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <Card
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0"
            >
              <div className="h-1 bg-gradient-to-r from-green-400 to-teal-600" />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-green-50 ${stat.color}`}>
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

      {/* Инструменты организатора */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-800">
            <Target className="w-5 h-5 mr-2" />
            Инструменты организатора
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {organizerActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <div
                key={index}
                onClick={() => {
                  if (action.title === "Создать мероприятие") {
                    window.dispatchEvent(new CustomEvent("navigate", { detail: "events" }))
                  }
                }}
                className="p-4 rounded-xl bg-gradient-to-r from-white to-green-50 border border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
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

      {/* Предстоящие мероприятия */}
      <Card className="shadow-xl border-0">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-slate-800">
              <Calendar className="w-5 h-5 mr-2" />
              Ваши мероприятия
            </CardTitle>
            <Button
              className="bg-green-600 text-white hover:bg-green-700"
              onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "events" }))}
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать событие
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{event.title}</h3>
                  <Badge className={getStatusColor(event.status)}>{getStatusLabel(event.status)}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {event.date} в {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2" />
                    {event.participants}/{event.maxParticipants} участников
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="bg-white">
                      Редактировать
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 text-white hover:bg-green-700"
                      onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "events" }))}
                    >
                      Управление
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Нет запланированных мероприятий</p>
              <Button
                className="mt-4 bg-green-600 text-white hover:bg-green-700"
                onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "events" }))}
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать первое событие
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
