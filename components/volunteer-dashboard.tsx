"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, Calendar, MessageSquare, TrendingUp, CheckCircle, Target, BookOpen, Star, Zap } from "lucide-react"
import { useAppState } from "@/components/app-state"
import { useToast } from "@/components/toast"

interface VolunteerDashboardProps {
  user: any
}

const dailyTasks = [
  { id: 1, title: "Поделиться постом о коррупции", points: 5, completed: false },
  { id: 2, title: "Пройти мини-тест", points: 10, completed: true },
  { id: 3, title: "Прочитать новость дня", points: 3, completed: false },
  { id: 4, title: "Оценить мероприятие", points: 8, completed: false },
]

const recentAchievements = [
  { title: "Первые шаги", description: "Зарегистрировались в приложении", icon: Target },
  { title: "Активный читатель", description: "Прочитали 5 статей", icon: BookOpen },
]

const volunteerActions = [
  {
    title: "Мероприятия",
    description: "Участие в событиях",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
    action: "events",
  },
  {
    title: "Чат-помощник",
    description: "ИИ консультант",
    icon: MessageSquare,
    color: "from-green-500 to-green-600",
    action: "chatbot",
  },
  {
    title: "Рейтинг",
    description: "Таблица лидеров",
    icon: TrendingUp,
    color: "from-purple-500 to-purple-600",
    action: "leaderboard",
  },
  {
    title: "Обучение",
    description: "Курсы и тесты",
    icon: BookOpen,
    color: "from-orange-500 to-orange-600",
    action: "learning",
  },
]

export function VolunteerDashboard({ user }: VolunteerDashboardProps) {
  const { state, dispatch } = useAppState()
  const { showToast } = useToast()

  // Используем данные из глобального состояния если доступны
  const currentUser = state.user || user
  const completedTasks = dailyTasks.filter((task) => task.completed).length
  const totalTasks = dailyTasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

  const handleQuickAction = (action: string) => {
    window.dispatchEvent(new CustomEvent("navigate", { detail: action }))
  }

  const handleCompleteTask = (taskId: number) => {
    const task = dailyTasks.find((t) => t.id === taskId)
    if (!task || task.completed) return

    // Отмечаем задание как выполненное
    task.completed = true

    // Начисляем баллы
    dispatch({
      type: "UPDATE_USER",
      payload: { points: (currentUser.points || 0) + task.points },
    })

    // Добавляем уведомление
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "Задание выполнено!",
        message: `"${task.title}" завершено. Получено +${task.points} баллов.`,
        type: "success",
        timestamp: new Date(),
        read: false,
      },
    })

    showToast(`Задание выполнено! +${task.points} баллов`, "success")
  }

  return (
    <div className="p-3 space-y-4 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 min-h-screen max-w-md mx-auto md:max-w-none">
      {/* Заголовок волонтера - адаптивный */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-800 p-4 md:p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
        <div className="relative">
          <div className="flex items-center mb-3">
            <div className="p-2 md:p-3 bg-white/10 backdrop-blur-sm rounded-xl mr-3">
              <Star className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-3xl font-bold truncate">Добро пожаловать!</h1>
              <p className="text-blue-100 mt-1 text-sm md:text-base truncate">{currentUser.name}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              <Award className="w-3 h-3 mr-1" />
              {currentUser.level}
            </Badge>
            <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30 text-xs">
              <Zap className="w-3 h-3 mr-1" />
              {currentUser.points || 0} баллов
            </Badge>
          </div>
          <div className="text-right mt-2 md:absolute md:top-0 md:right-0 md:mt-0">
            <p className="text-xl md:text-2xl font-bold">#15</p>
            <p className="text-blue-100 text-xs md:text-sm">В рейтинге</p>
          </div>
        </div>
      </div>

      {/* Статистика волонтера - компактная */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-2 shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">{currentUser.points || 0}</p>
            <p className="text-xs text-slate-600 font-medium">Баллов заработано</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0">
          <div className="h-1 bg-gradient-to-r from-green-400 to-green-600" />
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-2 shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-slate-900 mb-1">15</p>
            <p className="text-xs text-slate-600 font-medium">Место в рейтинге</p>
          </CardContent>
        </Card>
      </div>

      {/* Ежедневные задачи - оптимизированные */}
      <Card className="overflow-hidden shadow-xl border-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-slate-800 text-base">
            <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
            Ежедневные задачи
          </CardTitle>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>
                Прогресс: {completedTasks}/{totalTasks}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                task.completed ? "bg-green-50 border-green-200 shadow-sm" : "bg-white border-slate-200 hover:shadow-md"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm ${task.completed ? "text-green-800 line-through" : "text-slate-900"}`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-slate-600">+{task.points} баллов</p>
              </div>
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-3 py-1"
                  onClick={() => handleCompleteTask(task.id)}
                >
                  Выполнить
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Достижения - компактные */}
      <Card className="overflow-hidden shadow-xl border-0">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-slate-800 text-base">
            <Award className="w-4 h-4 mr-2 text-yellow-600" />
            Последние достижения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentAchievements.map((achievement, index) => {
            const IconComponent = achievement.icon
            return (
              <div
                key={index}
                className="flex items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
              >
                <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                  <IconComponent className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">{achievement.title}</p>
                  <p className="text-xs text-slate-600">{achievement.description}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Быстрые действия - адаптивные */}
      <Card className="overflow-hidden shadow-xl border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-slate-800 text-base">Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {volunteerActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <div
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="p-3 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div
                  className={`inline-flex p-2 rounded-xl bg-gradient-to-r ${action.color} mb-2 group-hover:scale-110 transition-transform duration-200`}
                >
                  <IconComponent className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-1 text-sm">{action.title}</h3>
                <p className="text-xs text-slate-600">{action.description}</p>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
