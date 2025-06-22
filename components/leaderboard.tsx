"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Trophy, Medal, Award, Crown } from "lucide-react"

interface LeaderboardProps {
  user: any
}

// Убираем администраторов из рейтинга и обновляем данные
const leaderboardData = [
  {
    id: 1,
    name: "Айгуль Нурланова",
    points: 2450,
    level: "Агент прозрачности",
    city: "Алматы",
    rank: 1,
    role: "volunteer",
  },
  { id: 2, name: "Данияр Касымов", points: 2380, level: "Активист", city: "Нур-Султан", rank: 2, role: "volunteer" },
  { id: 3, name: "Сауле Жанибекова", points: 2290, level: "Активист", city: "Шымкент", rank: 3, role: "moderator" },
  { id: 4, name: "Ерлан Токтаров", points: 2150, level: "Наблюдатель", city: "Караганда", rank: 4, role: "organizer" },
  { id: 5, name: "Мадина Абдуллаева", points: 2050, level: "Наблюдатель", city: "Алматы", rank: 5, role: "volunteer" },
  { id: 6, name: "Арман Сейтов", points: 1980, level: "Наблюдатель", city: "Актобе", rank: 6, role: "volunteer" },
  { id: 7, name: "Гульнара Омарова", points: 1920, level: "Наблюдатель", city: "Тараз", rank: 7, role: "volunteer" },
  { id: 8, name: "Бауржан Алиев", points: 1850, level: "Наблюдатель", city: "Павлодар", rank: 8, role: "volunteer" },
  { id: 9, name: "Жанар Кенжебаева", points: 1780, level: "Новичок", city: "Костанай", rank: 9, role: "volunteer" },
  { id: 10, name: "Нурлан Бекетов", points: 1720, level: "Новичок", city: "Атырау", rank: 10, role: "volunteer" },
]

const categories = [
  { id: "all", label: "Общий", icon: Trophy },
  { id: "city", label: "По городу", icon: Medal },
  { id: "region", label: "По региону", icon: Award },
]

export function Leaderboard({ user }: LeaderboardProps) {
  const [activeCategory, setActiveCategory] = useState("all")

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Агент прозрачности":
        return "bg-purple-100 text-purple-800"
      case "Активист":
        return "bg-green-100 text-green-800"
      case "Наблюдатель":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Заголовок */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Рейтинг волонтёров</h1>
        <p className="text-gray-600">Топ-10 активных участников</p>
      </div>

      {/* Категории */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center whitespace-nowrap ${
                activeCategory === category.id ? "bg-blue-600 text-white" : "bg-white text-gray-700"
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {category.label}
            </Button>
          )
        })}
      </div>

      {/* Топ-3 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">🏆 Топ-3 лидера</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-end space-x-4 mb-6">
            {/* 2 место */}
            <div className="text-center">
              <div className="w-16 h-20 bg-gray-100 rounded-lg flex items-end justify-center mb-2">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">2</span>
                </div>
              </div>
              <p className="text-sm font-medium">{leaderboardData[1].name.split(" ")[0]}</p>
              <p className="text-xs text-gray-600">{leaderboardData[1].points}</p>
            </div>

            {/* 1 место */}
            <div className="text-center">
              <div className="w-16 h-24 bg-yellow-100 rounded-lg flex items-end justify-center mb-2">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-800" />
                </div>
              </div>
              <p className="text-sm font-medium">{leaderboardData[0].name.split(" ")[0]}</p>
              <p className="text-xs text-gray-600">{leaderboardData[0].points}</p>
            </div>

            {/* 3 место */}
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-end justify-center mb-2">
                <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold">3</span>
                </div>
              </div>
              <p className="text-sm font-medium">{leaderboardData[2].name.split(" ")[0]}</p>
              <p className="text-xs text-gray-600">{leaderboardData[2].points}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Полный рейтинг */}
      <Card>
        <CardHeader>
          <CardTitle>Полный рейтинг</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {leaderboardData
            .filter((participant) => participant.role === "volunteer")
            .map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center p-3 rounded-lg border ${
                  participant.name === user.name ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 mr-3">{getRankIcon(participant.rank)}</div>

                <Avatar className="w-10 h-10 mr-3">
                  <AvatarFallback className="text-sm bg-gray-100">
                    {participant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{participant.name}</p>
                    <p className="font-bold text-blue-600">{participant.points}</p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <Badge className={`text-xs ${getLevelColor(participant.level)}`}>{participant.level}</Badge>
                    <p className="text-xs text-gray-600">{participant.city}</p>
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>

      {/* Ваша позиция */}
      {user.role === "admin" ? (
        <Card className="bg-slate-50 border-slate-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-slate-600">Администраторы не участвуют в рейтинге волонтеров</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-blue-600 mb-1">Ваша текущая позиция</p>
              <p className="text-2xl font-bold text-blue-800">#15</p>
              <p className="text-sm text-blue-600">До топ-10 осталось {1720 - user.points + 1} баллов</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
