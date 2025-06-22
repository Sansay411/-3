"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Plus, BookOpen, Search, Monitor, CheckCircle } from "lucide-react"
import { EventModal } from "@/components/event-modal"
import { useToast } from "@/components/toast"
import { useAppState } from "@/components/app-state"

interface EventsProps {
  user: any
}

const eventTypes = {
  lecture: { label: "Лекция", color: "bg-blue-100 text-blue-800", icon: BookOpen },
  flashmob: { label: "Флешмоб", color: "bg-green-100 text-green-800", icon: Users },
  raid: { label: "Рейд", color: "bg-red-100 text-red-800", icon: Search },
  webinar: { label: "Вебинар", color: "bg-purple-100 text-purple-800", icon: Monitor },
}

export function Events({ user }: EventsProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("upcoming")
  const { state, dispatch } = useAppState()
  const [events, setEvents] = useState(state.globalEvents)

  // Обновляем события при изменении глобального состояния
  useEffect(() => {
    setEvents(state.globalEvents)
  }, [state.globalEvents])
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("view")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { showToast } = useToast()

  const filteredEvents = events.filter((event) => filter === "all" || event.status === filter)

  const handleRegister = (eventId: number) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    if (event.participants >= event.maxParticipants) {
      showToast("Мероприятие заполнено", "error")
      return
    }

    setRegisteredEvents([...registeredEvents, eventId])

    // Обновляем глобальное состояние
    dispatch({
      type: "REGISTER_EVENT",
      payload: { eventId },
    })

    // Добавляем баллы пользователю
    if (state.user) {
      dispatch({
        type: "UPDATE_USER",
        payload: { points: (state.user.points || 0) + event.points },
      })
    }

    // Добавляем уведомление
    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "Регистрация успешна!",
        message: `Вы зарегистрированы на "${event.title}". Получено +${event.points} баллов.`,
        type: "success",
        timestamp: new Date(),
        read: false,
      },
    })

    showToast(`Вы зарегистрированы на "${event.title}"!`, "success")
    addToCalendar(event)
  }

  // Создание мероприятия
  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setModalMode("create")
    setIsModalOpen(true)
  }

  // Просмотр деталей
  const handleEventDetails = (eventId: number) => {
    const event = events.find((e) => e.id === eventId)
    setSelectedEvent(event)
    setModalMode("view")
    setIsModalOpen(true)
  }

  // Управление мероприятием
  const handleManageEvent = (eventId: number) => {
    const event = events.find((e) => e.id === eventId)
    setSelectedEvent(event)
    setModalMode("edit")
    setIsModalOpen(true)
  }

  const handleSaveEvent = (eventData: any) => {
    if (modalMode === "create") {
      const newEvent = {
        ...eventData,
        participants: 0,
        status: "upcoming",
        organizer: user.name,
        createdBy: user.role,
      }

      // Добавляем в глобальное состояние
      dispatch({
        type: "ADD_GLOBAL_EVENT",
        payload: newEvent,
      })

      showToast("Мероприятие создано успешно!", "success")
      sendPushNotification("Новое мероприятие!", `"${eventData.title}" - ${eventData.date}`)
    } else if (modalMode === "edit") {
      dispatch({
        type: "UPDATE_GLOBAL_EVENT",
        payload: {
          id: selectedEvent.id,
          updates: eventData,
        },
      })
      showToast("Мероприятие обновлено!", "success")
    }
  }

  const handleCancelRegistration = (eventId: number) => {
    setRegisteredEvents(registeredEvents.filter((id) => id !== eventId))

    dispatch({
      type: "CANCEL_EVENT_REGISTRATION",
      payload: { eventId },
    })

    showToast("Регистрация отменена", "info")
  }

  const isRegistered = (eventId: number) => registeredEvents.includes(eventId)

  // ИНТЕГРАЦИЯ НУЖНА: Добавление в календарь
  const addToCalendar = (event: any) => {
    // Для веб-версии можно использовать Google Calendar API
    // Для мобильной версии - нативные календари iOS/Android
    console.log("Добавление в календарь:", event)
  }

  // ИНТЕГРАЦИЯ НУЖНА: Push-уведомления
  const sendPushNotification = (title: string, body: string) => {
    // Требует интеграцию с Firebase Cloud Messaging или аналогичным сервисом
    console.log("Отправка push-уведомления:", { title, body })
  }

  return (
    <div className="p-4 space-y-4">
      {/* Заголовок */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Мероприятия</h1>
        <p className="text-gray-600">Участвуйте в событиях и зарабатывайте баллы</p>
      </div>

      {/* Фильтры */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <Button
          variant={filter === "upcoming" ? "default" : "outline"}
          onClick={() => setFilter("upcoming")}
          className={filter === "upcoming" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
        >
          Предстоящие ({events.filter((e) => e.status === "upcoming").length})
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
          className={filter === "completed" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
        >
          Завершённые ({events.filter((e) => e.status === "completed").length})
        </Button>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
        >
          Все ({events.length})
        </Button>
      </div>

      {/* Список мероприятий */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const eventType = eventTypes[event.type as keyof typeof eventTypes]
          const isEventRegistered = isRegistered(event.id)
          const IconComponent = eventType.icon

          return (
            <Card key={event.id} className={event.status === "completed" ? "opacity-75" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                  </div>
                  <Badge className={`${eventType.color} ml-2`}>
                    <IconComponent className="w-4 h-4 mr-1" />
                    {eventType.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Дата и время */}
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {new Date(event.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <Clock className="w-4 h-4 ml-4 mr-2" />
                    <span className="text-sm">{event.time}</span>
                  </div>

                  {/* Место */}
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>

                  {/* Участники */}
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {event.participants}/{event.maxParticipants} участников
                    </span>
                    <div className="ml-2 flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Организатор */}
                  <div className="text-xs text-gray-500">Организатор: {event.organizer}</div>

                  {/* Баллы и кнопки */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center">
                      <Plus className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-sm font-medium text-green-600">+{event.points} баллов</span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEventDetails(event.id)}
                        variant="outline"
                        size="sm"
                        className="bg-white text-gray-700"
                      >
                        Подробнее
                      </Button>

                      {event.status === "upcoming" && (
                        <>
                          {!isEventRegistered ? (
                            <Button
                              onClick={() => handleRegister(event.id)}
                              disabled={event.participants >= event.maxParticipants}
                              className="bg-blue-600 text-white hover:bg-blue-700"
                              size="sm"
                            >
                              {event.participants >= event.maxParticipants ? "Заполнено" : "Участвовать"}
                            </Button>
                          ) : (
                            <div className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-1">
                              <Button size="sm" className="bg-green-600 text-white text-xs" disabled>
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Зарегистрирован
                              </Button>
                              <Button
                                onClick={() => handleCancelRegistration(event.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                              >
                                Отменить
                              </Button>
                            </div>
                          )}
                        </>
                      )}

                      {(user.role === "organizer" || user.role === "admin" || user.role === "moderator") && (
                        <Button
                          onClick={() => handleManageEvent(event.id)}
                          variant="outline"
                          size="sm"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          Управление
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

      {/* Кнопка создания мероприятия */}
      {(user.role === "organizer" || user.role === "admin") && (
        <Card className="border-dashed border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Создать мероприятие</h3>
            <p className="text-gray-600 mb-4">Организуйте новое событие для волонтёров</p>
            <Button
              onClick={handleCreateEvent}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать событие
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Модальное окно */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveEvent}
        event={selectedEvent}
        mode={modalMode}
      />
    </div>
  )
}
