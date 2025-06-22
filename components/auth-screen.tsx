"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, User, UserCheck, Calendar, LogOut } from "lucide-react"

interface AuthScreenProps {
  onAuthComplete: (user: any) => void
}

const roles = [
  {
    value: "volunteer",
    label: "Волонтёр",
    icon: User,
    description: "Участие в мероприятиях, обучение, подача сигналов",
    color: "from-blue-500 to-indigo-600",
  },
  {
    value: "moderator",
    label: "Модератор Антикор",
    icon: UserCheck,
    description: "Управление сигналами, модерация контента",
    color: "from-blue-600 to-indigo-700",
  },
  {
    value: "organizer",
    label: "Организатор",
    icon: Calendar,
    description: "Создание и управление мероприятиями",
    color: "from-green-500 to-emerald-600",
  },
  {
    value: "admin",
    label: "Администратор",
    icon: Shield,
    description: "Полный доступ к системе",
    color: "from-slate-600 to-slate-800",
  },
]

// Демо аккаунты для быстрого входа
const demoAccounts = [
  { email: "volunteer@demo.kz", password: "demo123", role: "volunteer", name: "Айгуль Нурланова" },
  { email: "moderator@demo.kz", password: "demo123", role: "moderator", name: "Данияр Касымов" },
  { email: "organizer@demo.kz", password: "demo123", role: "organizer", name: "Сауле Жанибекова" },
  { email: "admin@demo.kz", password: "demo123", role: "admin", name: "Ерлан Токтаров" },
]

export function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showDemo, setShowDemo] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "volunteer",
    city: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Проверяем демо аккаунты при входе
    if (isLogin) {
      const demoAccount = demoAccounts.find((acc) => acc.email === formData.email && acc.password === formData.password)

      if (demoAccount) {
        const userData = {
          id: Math.random().toString(36).substr(2, 9),
          name: demoAccount.name,
          email: demoAccount.email,
          role: demoAccount.role,
          city: "Алматы",
          level: "Новичок",
          points: demoAccount.role === "volunteer" ? 150 : 0,
          badges: [],
          joinDate: new Date().toISOString(),
        }
        onAuthComplete(userData)
        return
      }
    }

    // Обычная регистрация/вход
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || "Пользователь",
      email: formData.email,
      role: formData.role,
      city: formData.city || "Алматы",
      level: "Новичок",
      points: 0,
      badges: [],
      joinDate: new Date().toISOString(),
    }

    onAuthComplete(userData)
  }

  const handleDemoLogin = (account: any) => {
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: account.name,
      email: account.email,
      role: account.role,
      city: "Алматы",
      level: account.role === "volunteer" ? "Наблюдатель" : "Администратор",
      points: account.role === "volunteer" ? 150 : 0,
      badges: [],
      joinDate: new Date().toISOString(),
    }
    onAuthComplete(userData)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 mx-auto">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? "Вход в систему" : "Регистрация"}</CardTitle>
          <p className="text-sm text-gray-600 mt-2">{isLogin ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}</p>
        </CardHeader>
        <CardContent>
          {/* Демо аккаунты */}
          {isLogin && (
            <div className="mb-4">
              <Button
                type="button"
                onClick={() => setShowDemo(!showDemo)}
                variant="outline"
                className="w-full mb-3 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {showDemo ? "Скрыть демо аккаунты" : "Показать демо аккаунты"}
              </Button>

              {showDemo && (
                <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Быстрый вход:</p>
                  {demoAccounts.map((account, index) => (
                    <Button
                      key={index}
                      onClick={() => handleDemoLogin(account)}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start text-xs"
                    >
                      <span className="font-medium">{account.name}</span>
                      <span className="ml-2 text-gray-500">({account.role})</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Имя и фамилия</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder={isLogin ? "Попробуйте: volunteer@demo.kz" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder={isLogin ? "Попробуйте: demo123" : ""}
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="city">Город</Label>
                  <Input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Алматы"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Выберите роль</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {roles.map((role) => {
                      const IconComponent = role.icon
                      const isSelected = formData.role === role.value
                      return (
                        <div
                          key={role.value}
                          onClick={() => setFormData({ ...formData, role: role.value })}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? `border-transparent bg-gradient-to-r ${role.color} text-white shadow-lg transform scale-105`
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${isSelected ? "bg-white/20" : "bg-gray-100"}`}>
                              <IconComponent className={`w-4 h-4 ${isSelected ? "text-white" : "text-gray-600"}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-900"}`}>
                                {role.label}
                              </h3>
                              <p className={`text-xs ${isSelected ? "text-white/80" : "text-gray-600"}`}>
                                {role.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
              {isLogin ? "Войти" : "Зарегистрироваться"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline text-sm"
              >
                {isLogin ? "Нет аккаунта? Зарегистрируйтесь" : "Уже есть аккаунт? Войдите"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
