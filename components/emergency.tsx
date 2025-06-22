"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MapPin, Clock, AlertTriangle, Shield, Users, Zap, Copy } from "lucide-react"
import { useToast } from "@/components/toast"

interface EmergencyProps {
  user: any
}

const emergencyContacts = [
  {
    id: "corruption",
    title: "Агентство по противодействию коррупции",
    number: "1424",
    description: "Сообщить о коррупционных нарушениях",
    color: "from-red-500 to-red-600",
    icon: Shield,
    available: "24/7",
  },
  {
    id: "prosecutor",
    title: "Генеральная прокуратура РК",
    number: "123",
    description: "Правовая помощь и консультации",
    color: "from-blue-500 to-blue-600",
    icon: Users,
    available: "Рабочие часы",
  },
  {
    id: "knb",
    title: "Комитет национальной безопасности",
    number: "1415",
    description: "Серьёзные нарушения безопасности",
    color: "from-purple-500 to-purple-600",
    icon: AlertTriangle,
    available: "24/7",
  },
  {
    id: "police",
    title: "Полиция (экстренная служба)",
    number: "102",
    description: "Угроза жизни и безопасности",
    color: "from-orange-500 to-orange-600",
    icon: Zap,
    available: "24/7",
  },
]

const quickActions = [
  {
    id: "witness_protection",
    title: "Защита свидетелей",
    description: "Запросить защиту при угрозах",
    icon: Shield,
    color: "bg-green-500",
  },
  {
    id: "legal_aid",
    title: "Юридическая помощь",
    description: "Бесплатная правовая консультация",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    id: "anonymous_tip",
    title: "Анонимный сигнал",
    description: "Сообщить анонимно о нарушении",
    icon: AlertTriangle,
    color: "bg-purple-500",
  },
]

export function Emergency({ user }: EmergencyProps) {
  const [callingNumber, setCallingNumber] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<string>(user.city)
  const { showToast } = useToast()

  // Реальный звонок
  const handleEmergencyCall = (number: string, title: string) => {
    setCallingNumber(number)

    // ИНТЕГРАЦИЯ НУЖНА: Реальные звонки
    makePhoneCall(number, title)

    // Логирование экстренного вызова
    logEmergencyCall(number, title, user.id)

    setTimeout(() => {
      setCallingNumber(null)
      showToast(`Звонок на ${title} инициирован`, "success")
    }, 2000)
  }

  // Копирование номера
  const copyNumber = (number: string, title: string) => {
    navigator.clipboard.writeText(number)
    showToast(`Номер ${title} скопирован: ${number}`, "success")
  }

  // Получение геолокации
  const getCurrentLocation = () => {
    // ИНТЕГРАЦИЯ НУЖНА: Геолокация
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          // ИНТЕГРАЦИЯ НУЖНА: Обратное геокодирование
          reverseGeocode(latitude, longitude).then((address) => {
            setUserLocation(address)
            showToast("Местоположение обновлено", "success")
          })
        },
        (error) => {
          showToast("Не удалось получить местоположение", "error")
          console.error("Geolocation error:", error)
        },
      )
    } else {
      showToast("Геолокация не поддерживается", "error")
    }
  }

  // Быстрые действия
  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "witness_protection":
        // Открыть форму запроса защиты
        requestWitnessProtection()
        break
      case "legal_aid":
        // Открыть форму юридической помощи
        requestLegalAid()
        break
      case "anonymous_tip":
        // Перейти к подаче анонимного сигнала
        window.dispatchEvent(new CustomEvent("navigate", { detail: "reports" }))
        break
      default:
        break
    }
  }

  // SOS функция
  const handleSOS = () => {
    // ИНТЕГРАЦИЯ НУЖНА: Отправка SOS сигнала
    sendSOSSignal(user.id, userLocation)
    showToast("SOS сигнал отправлен!", "success")

    // Автоматический звонок в полицию
    handleEmergencyCall("102", "Полиция")
  }

  // ИНТЕГРАЦИИ НУЖНЫ:

  // 1. Телефонные звонки
  const makePhoneCall = (number: string, title: string) => {
    // Для мобильных устройств
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      window.location.href = `tel:${number}`
    }
    // Для веб-версии можно использовать WebRTC или интеграцию с телефонными сервисами
    console.log(`Звонок на ${number} (${title})`)
  }

  // 2. Геолокация и обратное геокодирование
  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Интеграция с Google Maps API, Yandex Maps API или аналогичными
    try {
      // Пример с Google Maps Geocoding API
      // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
      // const data = await response.json()
      // return data.results[0]?.formatted_address || `${lat}, ${lng}`

      return `${lat.toFixed(4)}, ${lng.toFixed(4)}` // Временная заглушка
    } catch (error) {
      console.error("Reverse geocoding error:", error)
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    }
  }

  // 3. Логирование экстренных вызовов
  const logEmergencyCall = (number: string, service: string, userId: string) => {
    // Отправка в аналитику или базу данных
    const logData = {
      userId,
      service,
      number,
      timestamp: new Date().toISOString(),
      location: userLocation,
    }
    console.log("Emergency call logged:", logData)
    // Отправить на сервер для статистики и безопасности
  }

  // 4. SOS сигнал
  const sendSOSSignal = (userId: string, location: string) => {
    // Отправка экстренного сигнала модераторам и службам
    const sosData = {
      userId,
      location,
      timestamp: new Date().toISOString(),
      type: "SOS",
    }
    console.log("SOS signal sent:", sosData)
    // ИНТЕГРАЦИЯ НУЖНА: Push-уведомления модераторам, SMS, email
  }

  // 5. Запрос защиты свидетелей
  const requestWitnessProtection = () => {
    // Открыть форму или отправить запрос
    const protectionRequest = {
      userId: user.id,
      timestamp: new Date().toISOString(),
      location: userLocation,
      urgency: "high",
    }
    console.log("Witness protection requested:", protectionRequest)
    showToast("Запрос на защиту свидетелей отправлен", "success")
    // ИНТЕГРАЦИЯ НУЖНА: Отправка в соответствующие органы
  }

  // 6. Запрос юридической помощи
  const requestLegalAid = () => {
    const legalRequest = {
      userId: user.id,
      timestamp: new Date().toISOString(),
      type: "legal_consultation",
    }
    console.log("Legal aid requested:", legalRequest)
    showToast("Запрос на юридическую помощь отправлен", "success")
    // ИНТЕГРАЦИЯ НУЖНА: Система записи к юристам
  }

  return (
    <div className="p-4 space-y-6 bg-gradient-to-br from-red-50 via-white to-orange-50 min-h-screen">
      {/* Заголовок */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4 shadow-lg">
          <Phone className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Экстренная связь</h1>
        <p className="text-gray-600">Быстрый доступ к службам помощи</p>
      </div>

      {/* SOS кнопка */}
      <Card className="border-red-500 bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl">
        <CardContent className="p-6 text-center">
          <Button
            onClick={handleSOS}
            className="w-full h-20 bg-white text-red-600 hover:bg-red-50 text-xl font-bold shadow-lg"
          >
            🆘 ЭКСТРЕННЫЙ ВЫЗОВ SOS
          </Button>
          <p className="text-red-100 text-sm mt-3">
            Нажмите для отправки сигнала бедствия и автоматического звонка в службы
          </p>
        </CardContent>
      </Card>

      {/* Предупреждение */}
      <Card className="border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Важно!</h3>
              <p className="text-sm text-red-800">
                При угрозе жизни немедленно звоните 102 (полиция) или 103 (скорая помощь). Все звонки записываются и
                могут быть использованы в качестве доказательств.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Экстренные контакты */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Горячие линии</h2>

        {emergencyContacts.map((contact) => {
          const IconComponent = contact.icon
          const isCalling = callingNumber === contact.number

          return (
            <Card key={contact.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${contact.color}`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${contact.color} shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{contact.title}</h3>
                      <p className="text-gray-600 text-sm">{contact.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <Clock className="w-3 h-3 mr-1" />
                    {contact.available}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-gray-900">{contact.number}</div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => copyNumber(contact.number, contact.title)}
                      variant="outline"
                      size="sm"
                      className="bg-white"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleEmergencyCall(contact.number, contact.title)}
                      disabled={isCalling}
                      className={`bg-gradient-to-r ${contact.color} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200 px-6 py-3`}
                    >
                      {isCalling ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Соединяем...
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4 mr-2" />
                          Позвонить
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Быстрые действия */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Быстрые действия</h2>

        <div className="grid gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon

            return (
              <Card
                key={action.id}
                onClick={() => handleQuickAction(action.id)}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl ${action.color} shadow-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <Button variant="outline" size="sm" className="bg-white">
                      Открыть
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Местоположение */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">Ваше местоположение</h3>
                <p className="text-sm text-blue-700">{userLocation}</p>
                <p className="text-xs text-blue-600 mt-1">Местоположение поможет службам быстрее найти вас</p>
              </div>
            </div>
            <Button
              onClick={getCurrentLocation}
              variant="outline"
              size="sm"
              className="bg-white text-blue-600 border-blue-200"
            >
              Обновить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
