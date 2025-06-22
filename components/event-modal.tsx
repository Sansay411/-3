"use client"

import type React from "react"

import { useState } from "react"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users, Award } from "lucide-react"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (eventData: any) => void
  event?: any
  mode: "create" | "edit" | "view"
}

export function EventModal({ isOpen, onClose, onSubmit, event, mode }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date || "",
    time: event?.time || "",
    location: event?.location || "",
    maxParticipants: event?.maxParticipants || 50,
    points: event?.points || 25,
    type: event?.type || "lecture",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const isReadOnly = mode === "view"

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === "create" ? "Создать мероприятие" : mode === "edit" ? "Редактировать мероприятие" : "Детали мероприятия"
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Название мероприятия</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Например: Лекция по антикоррупционному праву"
            required
            disabled={isReadOnly}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Описание</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Подробное описание мероприятия..."
            rows={4}
            required
            disabled={isReadOnly}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Дата</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Время</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Место проведения</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Адрес или онлайн-платформа"
              className="pl-10"
              required
              disabled={isReadOnly}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Тип мероприятия</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
            disabled={isReadOnly}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lecture">Лекция</SelectItem>
              <SelectItem value="flashmob">Флешмоб</SelectItem>
              <SelectItem value="raid">Рейд</SelectItem>
              <SelectItem value="webinar">Вебинар</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Максимум участников</Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: Number.parseInt(e.target.value) })}
                className="pl-10"
                min="1"
                required
                disabled={isReadOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="points">Баллы за участие</Label>
            <div className="relative">
              <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="points"
                type="number"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number.parseInt(e.target.value) })}
                className="pl-10"
                min="1"
                required
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>

        {mode !== "view" && (
          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
              {mode === "create" ? "Создать мероприятие" : "Сохранить изменения"}
            </Button>
          </div>
        )}

        {mode === "view" && event && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-gray-900">Дополнительная информация</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-2" />
                {event.participants}/{event.maxParticipants} участников
              </div>
              <div className="flex items-center text-gray-600">
                <Award className="w-4 h-4 mr-2" />+{event.points} баллов
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  )
}
