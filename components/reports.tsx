"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertTriangle,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  X,
  Shield,
  DollarSign,
  Scale,
  Ban,
  HelpCircle,
  FileText,
} from "lucide-react"
import { useToast } from "@/components/toast"
import { useAppState } from "@/components/app-state"

interface ReportsProps {
  user: any
}

const categories = {
  bribery: { label: "Взяточничество", color: "bg-red-100 text-red-800", icon: DollarSign },
  procurement: { label: "Госзакупки", color: "bg-blue-100 text-blue-800", icon: FileText },
  conflict: { label: "Конфликт интересов", color: "bg-yellow-100 text-yellow-800", icon: Scale },
  abuse: { label: "Злоупотребление", color: "bg-purple-100 text-purple-800", icon: Ban },
  other: { label: "Другое", color: "bg-gray-100 text-gray-800", icon: HelpCircle },
}

const statuses = {
  pending: { label: "Ожидает", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  investigating: { label: "Расследуется", color: "bg-blue-100 text-blue-800", icon: Eye },
  resolved: { label: "Решён", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Отклонён", color: "bg-red-100 text-red-800", icon: X },
}

const priorities = {
  high: { label: "Высокий", color: "bg-red-100 text-red-800" },
  medium: { label: "Средний", color: "bg-yellow-100 text-yellow-800" },
  low: { label: "Низкий", color: "bg-green-100 text-green-800" },
}

export function Reports({ user }: ReportsProps) {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    anonymous: true,
  })
  const { showToast } = useToast()
  const { state, dispatch } = useAppState()

  const canViewReports = user.role === "moderator" || user.role === "admin"
  const canCreateReports = ["volunteer", "organizer", "moderator", "admin"].includes(user.role)

  // Получаем сигналы из глобального состояния
  const reportList = canViewReports
    ? state.globalReports
    : state.globalReports.filter((report) => report.submittedBy === user.name || report.submittedBy === "Вами")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Создаем новый сигнал
    const newReport = {
      ...formData,
      status: "pending",
      priority: "medium",
      submittedBy: formData.anonymous ? "Анонимно" : user.name,
      submittedAt: new Date().toISOString(),
      assignedTo: "Ожидает назначения",
      createdBy: user.role,
    }

    // Добавляем в глобальное состояние
    dispatch({
      type: "ADD_GLOBAL_REPORT",
      payload: newReport,
    })

    // Начисляем баллы за подачу сигнала
    const points = 15
    if (state.user) {
      dispatch({
        type: "UPDATE_USER",
        payload: { points: (state.user.points || 0) + points },
      })
    }

    // Добавляем уведомление
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "Сигнал отправлен!",
        message: `Ваш сигнал "${formData.title}" принят к рассмотрению. Получено +${points} баллов.`,
        type: "success",
        timestamp: new Date(),
        read: false,
      },
    })

    showToast("Сигнал успешно отправлен!", "success")

    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      anonymous: true,
    })
    setActiveTab("list")
  }

  const handleViewDetails = (reportId: number) => {
    showToast(`Открытие деталей сигнала #${reportId}`, "info")
  }

  const handleTakeReport = (reportId: number) => {
    if (user.role === "moderator") {
      dispatch({
        type: "UPDATE_GLOBAL_REPORT",
        payload: {
          id: reportId,
          updates: {
            status: "investigating",
            assignedTo: user.name,
          },
        },
      })
      showToast(`Сигнал #${reportId} взят в работу`, "success")
    }
  }

  return (
    <div className="p-3 space-y-4 max-w-md mx-auto md:max-w-none">
      {/* Заголовок - оптимизирован для мобильных */}
      <div className="text-center py-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {canViewReports ? "Управление сигналами" : "Подача сигналов"}
        </h1>
        <p className="text-sm md:text-base text-gray-600 px-2">
          {canViewReports
            ? "Просмотр и обработка поступивших сигналов о коррупции"
            : "Сообщите о коррупционных нарушениях анонимно и безопасно"}
        </p>
      </div>

      {/* Табы - адаптивные */}
      <div className="flex space-x-2 overflow-x-auto">
        {canViewReports && (
          <Button
            variant={activeTab === "list" ? "default" : "outline"}
            onClick={() => setActiveTab("list")}
            className={`whitespace-nowrap text-sm ${activeTab === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
          >
            <Eye className="w-4 h-4 mr-1" />
            Все сигналы
          </Button>
        )}
        {canCreateReports && (
          <Button
            variant={activeTab === "create" ? "default" : "outline"}
            onClick={() => setActiveTab("create")}
            className={`whitespace-nowrap text-sm ${activeTab === "create" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
          >
            <Plus className="w-4 h-4 mr-1" />
            Подать сигнал
          </Button>
        )}
      </div>

      {/* Список сигналов */}
      {activeTab === "list" && canViewReports && (
        <div className="space-y-4">
          {/* Статистика - компактная для мобильных */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3">
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-yellow-600">5</p>
                <p className="text-xs md:text-sm text-gray-600">Ожидают</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-blue-600">3</p>
                <p className="text-xs md:text-sm text-gray-600">В работе</p>
              </div>
            </Card>
            <Card className="p-3">
              <div className="text-center">
                <p className="text-lg md:text-2xl font-bold text-green-600">12</p>
                <p className="text-xs md:text-sm text-gray-600">Решены</p>
              </div>
            </Card>
          </div>

          {/* Список сигналов - оптимизирован */}
          {reportList.map((report) => {
            const category = categories[report.category as keyof typeof categories]
            const status = statuses[report.status as keyof typeof statuses]
            const priority = priorities[report.priority as keyof typeof priorities]
            const StatusIcon = status.icon

            return (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base md:text-lg mb-2 truncate">{report.title}</CardTitle>
                      <p className="text-sm text-gray-600 line-clamp-2">{report.description}</p>
                    </div>
                    <div className="flex flex-col space-y-1 ml-2">
                      <Badge className={`${category.color} text-xs`}>
                        <category.icon className="w-3 h-3 mr-1" />
                        {category.label}
                      </Badge>
                      <Badge className={`${priority.color} text-xs`}>{priority.label}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      <p>
                        <strong>Место:</strong> {report.location}
                      </p>
                      <p>
                        <strong>Подал:</strong> {report.submittedBy}
                      </p>
                      <p>
                        <strong>Дата:</strong> {new Date(report.submittedAt).toLocaleDateString("ru-RU")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <Badge className={status.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {status.label}
                      </Badge>

                      <div className="flex space-x-1">
                        <Button
                          onClick={() => handleViewDetails(report.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1"
                        >
                          Детали
                        </Button>
                        {report.status === "pending" && user.role === "moderator" && (
                          <Button
                            onClick={() => handleTakeReport(report.id)}
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-700 text-xs px-2 py-1"
                          >
                            Взять
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Форма подачи сигнала - оптимизирована */}
      {activeTab === "create" && canCreateReports && (
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg p-4">
            <CardTitle className="flex items-center text-lg">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Подать сигнал о коррупции
            </CardTitle>
            <p className="text-red-100 mt-1 text-sm">Все сигналы рассматриваются конфиденциально</p>
          </CardHeader>

          <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm">
                  Краткое описание нарушения *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Например: Вымогательство взятки в ЦОНе"
                  required
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm">
                  Категория нарушения *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categories).map(([key, category]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center">
                          <category.icon className="w-4 h-4 mr-2" />
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm">
                  Место происшествия *
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Город, организация, адрес"
                  required
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm">
                  Подробное описание *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Опишите детали нарушения..."
                  rows={4}
                  required
                  className="text-sm"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Подать анонимно (рекомендуется)
                </Label>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Гарантии безопасности:
                </h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li className="flex items-start">
                    <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-green-600" />
                    Защита данных по закону РК
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-green-600" />
                    Анонимность гарантирована
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-3 h-3 mr-1 mt-0.5 text-green-600" />
                    +15 баллов за подачу сигнала
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 py-3 text-sm font-semibold"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Подать сигнал безопасно
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Информационный блок */}
      {!canViewReports && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-3">
            <h4 className="font-medium text-green-900 mb-2 text-sm">📞 Горячие линии:</h4>
            <div className="text-xs text-green-800 space-y-1">
              <p>
                <strong>Агентство по противодействию коррупции:</strong> 1424
              </p>
              <p>
                <strong>Генеральная прокуратура РК:</strong> 123
              </p>
              <p>
                <strong>КНБ:</strong> 1415
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
