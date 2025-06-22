"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Award, Calendar, MessageSquare, TrendingUp, Users, CheckCircle } from "lucide-react"

interface DashboardProps {
  user: any
}

const dailyTasks = [
  { id: 1, title: "Поделиться постом о коррупции", points: 5, completed: false },
  { id: 2, title: "Пройти мини-тест", points: 10, completed: true },
  { id: 3, title: "Прочитать новость дня", points: 3, completed: false },
  { id: 4, title: "Оценить мероприятие", points: 8, completed: false },
]

const recentAchievements = [
  { title: "Первые шаги", description: "Зарегистрировались в приложении", icon: "🎯" },
  { title: "Активный читатель", description: "Прочитали 5 статей", icon: "📚" },
]

export function Dashboard({ user }: DashboardProps) {
  const completedTasks = dailyTasks.filter((task) => task.completed).length
  const totalTasks = dailyTasks.length
  const progressPercentage = (completedTasks / totalTasks) * 100

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">
      {/* Заголовок с улучшенным дизайном */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
          <span className="text-2xl font-bold text-white">
            {user.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Добро пожаловать, {user.name}!</h1>
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white font-medium shadow-lg">
          <Award className="w-4 h-4 mr-2" />
          {user.level}
        </div>
      </div>

      {/* Статистика с градиентами */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-3 shadow-lg">
              <Award className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{user.points}</p>
            <p className="text-sm text-gray-600 font-medium">Баллов</p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-3 shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">15</p>
            <p className="text-sm text-gray-600 font-medium">Место в рейтинге</p>
          </CardContent>
        </Card>
      </div>

      {/* Ежедневные задачи */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
            Ежедневные задачи
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Прогресс: {completedTasks}/{totalTasks}
              </span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex-1">
                <p className={`font-medium ${task.completed ? "text-green-800 line-through" : "text-gray-900"}`}>
                  {task.title}
                </p>
                <p className="text-sm text-gray-600">+{task.points} баллов</p>
              </div>
              {task.completed ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                  Выполнить
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Последние достижения */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-600" />
            Последние достижения
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <span className="text-2xl mr-3">{achievement.icon}</span>
              <div>
                <p className="font-medium text-gray-900">{achievement.title}</p>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Быстрые действия */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-16 flex flex-col bg-white text-gray-700">
            <Calendar className="w-6 h-6 mb-1" />
            <span className="text-sm">События</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col bg-white text-gray-700">
            <MessageSquare className="w-6 h-6 mb-1" />
            <span className="text-sm">Чат-бот</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col bg-white text-gray-700">
            <Users className="w-6 h-6 mb-1" />
            <span className="text-sm">Рейтинг</span>
          </Button>
          <Button variant="outline" className="h-16 flex flex-col bg-white text-gray-700">
            <Award className="w-6 h-6 mb-1" />
            <span className="text-sm">Обучение</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
