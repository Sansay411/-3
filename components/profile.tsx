"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Award,
  Calendar,
  MapPin,
  LogOut,
  Settings,
  Shield,
  Phone,
  Edit,
  Save,
  X,
  Bell,
  Eye,
  EyeOff,
  Smartphone,
} from "lucide-react"
import { useToast } from "@/components/toast"
import { useAppState } from "@/components/app-state"

interface ProfileProps {
  user: any
  onLogout: () => void
}

const badges = [
  { name: "Новичок", color: "bg-blue-100 text-blue-800", icon: "🌟" },
  { name: "Активный участник", color: "bg-green-100 text-green-800", icon: "⚡" },
  { name: "Знаток законов", color: "bg-purple-100 text-purple-800", icon: "📚" },
]

const stats = [
  { label: "Мероприятий посещено", value: 12 },
  { label: "Курсов пройдено", value: 3 },
  { label: "Сигналов подано", value: 2 },
  { label: "Дней в приложении", value: 45 },
]

export function Profile({ user, onLogout }: ProfileProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "settings">("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    city: user.city,
    phone: user.phone || "",
  })
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    reportUpdates: true,
    profileVisible: true,
    showInLeaderboard: user.role !== "admin",
    anonymousReports: true,
    darkMode: false,
    language: "ru",
    soundEnabled: true,
    twoFactorAuth: false,
    loginAlerts: true,
  })
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const { showToast } = useToast()
  const { state, dispatch } = useAppState()

  const handleSaveProfile = () => {
    dispatch({
      type: "UPDATE_USER",
      payload: editData,
    })

    const updatedUser = { ...user, ...editData }
    localStorage.setItem("anticor-user", JSON.stringify(updatedUser))

    setIsEditing(false)
    showToast("Профиль успешно обновлен!", "success")
  }

  const handleCancelEdit = () => {
    setEditData({
      name: user.name,
      email: user.email,
      city: user.city,
      phone: user.phone || "",
    })
    setIsEditing(false)
  }

  const handleSaveSettings = () => {
    dispatch({
      type: "UPDATE_SETTINGS",
      payload: settings,
    })
    showToast("Настройки сохранены!", "success")
  }

  const handleChangePassword = () => {
    if (passwords.new !== passwords.confirm) {
      showToast("Пароли не совпадают!", "error")
      return
    }
    if (passwords.new.length < 6) {
      showToast("Пароль должен содержать минимум 6 символов!", "error")
      return
    }
    showToast("Пароль успешно изменен!", "success")
    setPasswords({ current: "", new: "", confirm: "" })
  }

  const handleLogout = () => {
    if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
      onLogout()
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />
      case "moderator":
        return <Settings className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Администратор"
      case "moderator":
        return "Модератор Антикор"
      case "organizer":
        return "Организатор"
      default:
        return "Волонтёр"
    }
  }

  const currentUser = state.user || user

  return (
    <div className="p-3 space-y-4 max-w-md mx-auto md:max-w-none">
      {/* Табы */}
      <div className="flex space-x-1 overflow-x-auto">
        <Button
          variant={activeTab === "profile" ? "default" : "outline"}
          onClick={() => setActiveTab("profile")}
          className={`flex-1 text-xs whitespace-nowrap ${activeTab === "profile" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
        >
          <User className="w-3 h-3 mr-1" />
          Профиль
        </Button>
        <Button
          variant={activeTab === "account" ? "default" : "outline"}
          onClick={() => setActiveTab("account")}
          className={`flex-1 text-xs whitespace-nowrap ${activeTab === "account" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
        >
          <Settings className="w-3 h-3 mr-1" />
          Аккаунт
        </Button>
        <Button
          variant={activeTab === "settings" ? "default" : "outline"}
          onClick={() => setActiveTab("settings")}
          className={`flex-1 text-xs whitespace-nowrap ${activeTab === "settings" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
        >
          <Smartphone className="w-3 h-3 mr-1" />
          Настройки
        </Button>
      </div>

      {/* Профиль */}
      {activeTab === "profile" && (
        <>
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Мой профиль</CardTitle>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-1">
                    <Button
                      onClick={handleSaveProfile}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center mb-4">
                <Avatar className="w-16 h-16 mb-3">
                  <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                    {currentUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {isEditing ? (
                  <div className="w-full space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-sm">
                        Имя и фамилия
                      </Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="city" className="text-sm">
                        Город
                      </Label>
                      <Select
                        value={editData.city}
                        onValueChange={(value) => setEditData({ ...editData, city: value })}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Алматы">Алматы</SelectItem>
                          <SelectItem value="Нур-Султан">Нур-Султан</SelectItem>
                          <SelectItem value="Шымкент">Шымкент</SelectItem>
                          <SelectItem value="Караганда">Караганда</SelectItem>
                          <SelectItem value="Актобе">Актобе</SelectItem>
                          <SelectItem value="Тараз">Тараз</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm">
                        Телефон
                      </Label>
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="+7 (___) ___-__-__"
                        className="text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">{currentUser.name}</h2>
                    <p className="text-gray-600 mb-2 text-sm">{currentUser.email}</p>

                    <div className="flex items-center mb-3">
                      {getRoleIcon(currentUser.role)}
                      <span className="ml-2 text-sm font-medium text-gray-700">{getRoleLabel(currentUser.role)}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{currentUser.city}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-6 text-center">
                  <div>
                    <p className="text-xl font-bold text-blue-600">{currentUser.points || 0}</p>
                    <p className="text-xs text-gray-600">Баллов</p>
                  </div>
                  <div className="w-px h-8 bg-gray-300"></div>
                  <div>
                    <p className="text-xl font-bold text-green-600">{currentUser.level}</p>
                    <p className="text-xs text-gray-600">Уровень</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Достижения */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Award className="w-4 h-4 mr-2 text-yellow-600" />
                Достижения
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                  <Badge key={index} className={`${badge.color} px-2 py-1 text-xs`}>
                    <span className="mr-1">{badge.icon}</span>
                    {badge.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Статистика */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Статистика активности</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Информация о регистрации */}
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">Участник с {new Date(currentUser.joinDate).toLocaleDateString("ru-RU")}</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Настройки аккаунта */}
      {activeTab === "account" && (
        <>
          {/* Безопасность */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Shield className="w-4 h-4 mr-2" />
                Безопасность аккаунта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Двухфакторная аутентификация</p>
                  <p className="text-xs text-gray-600">Дополнительная защита аккаунта</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Уведомления о входе</p>
                  <p className="text-xs text-gray-600">Получать уведомления при входе</p>
                </div>
                <Switch
                  checked={settings.loginAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, loginAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Смена пароля */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Shield className="w-4 h-4 mr-2" />
                Смена пароля
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="currentPassword" className="text-sm">
                  Текущий пароль
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="text-sm pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="newPassword" className="text-sm">
                  Новый пароль
                </Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-sm">
                  Подтвердите пароль
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="text-sm"
                />
              </div>

              <Button
                onClick={handleChangePassword}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
                disabled={!passwords.current || !passwords.new || !passwords.confirm}
              >
                Изменить пароль
              </Button>
            </CardContent>
          </Card>

          {/* Приватность */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Eye className="w-4 h-4 mr-2" />
                Приватность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Видимость профиля</p>
                  <p className="text-xs text-gray-600">Показывать профиль другим</p>
                </div>
                <Switch
                  checked={settings.profileVisible}
                  onCheckedChange={(checked) => setSettings({ ...settings, profileVisible: checked })}
                />
              </div>

              {user.role !== "admin" && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">Участие в рейтинге</p>
                    <p className="text-xs text-gray-600">Показывать в таблице лидеров</p>
                  </div>
                  <Switch
                    checked={settings.showInLeaderboard}
                    onCheckedChange={(checked) => setSettings({ ...settings, showInLeaderboard: checked })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Анонимные сигналы по умолчанию</p>
                  <p className="text-xs text-gray-600">Подавать сигналы анонимно</p>
                </div>
                <Switch
                  checked={settings.anonymousReports}
                  onCheckedChange={(checked) => setSettings({ ...settings, anonymousReports: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Кнопка сохранения настроек аккаунта */}
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 py-3 text-sm font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Сохранить настройки аккаунта
          </Button>
        </>
      )}

      {/* Настройки приложения */}
      {activeTab === "settings" && (
        <>
          {/* Уведомления */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Bell className="w-4 h-4 mr-2" />
                Уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Push-уведомления</p>
                  <p className="text-xs text-gray-600">Уведомления в приложении</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Email уведомления</p>
                  <p className="text-xs text-gray-600">Уведомления на почту</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">SMS уведомления</p>
                  <p className="text-xs text-gray-600">Уведомления на телефон</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Напоминания о мероприятиях</p>
                  <p className="text-xs text-gray-600">За 1 час до события</p>
                </div>
                <Switch
                  checked={settings.eventReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, eventReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Обновления по сигналам</p>
                  <p className="text-xs text-gray-600">Статус рассмотрения</p>
                </div>
                <Switch
                  checked={settings.reportUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, reportUpdates: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Интерфейс */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-base">
                <Smartphone className="w-4 h-4 mr-2" />
                Интерфейс
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Темная тема</p>
                  <p className="text-xs text-gray-600">Переключить на темный режим</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Звуковые уведомления</p>
                  <p className="text-xs text-gray-600">Звуки в приложении</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                />
              </div>

              <div className="space-y-1">
                <Label className="text-sm">Язык интерфейса</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">Русский</SelectItem>
                    <SelectItem value="kz">Қазақша</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Кнопка сохранения настроек приложения */}
          <Button
            onClick={handleSaveSettings}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 py-3 text-sm font-semibold"
          >
            <Save className="w-4 h-4 mr-2" />
            Сохранить настройки приложения
          </Button>
        </>
      )}

      {/* Кнопки действий - показываются на всех вкладках */}
      <div className="space-y-2">
        <Button
          onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "emergency" }))}
          variant="outline"
          className="w-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
        >
          <Phone className="w-4 h-4 mr-2" />
          Экстренные службы
        </Button>

        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Выйти из аккаунта
        </Button>
      </div>
    </div>
  )
}
