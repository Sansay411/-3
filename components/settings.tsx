"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  SettingsIcon,
  User,
  Bell,
  Shield,
  Smartphone,
  Save,
  Eye,
  EyeOff,
  LogOut,
  Phone,
  Edit,
  X,
  UserCheck,
  Calendar,
  MapPin,
} from "lucide-react"
import { useToast } from "@/components/toast"
import { useAppState } from "@/components/app-state"

interface SettingsProps {
  user: any
  onLogout: () => void
}

export function Settings({ user, onLogout }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "app">("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [editData, setEditData] = useState({
    name: user.name,
    email: user.email,
    city: user.city,
    phone: user.phone || "",
  })

  const [settings, setSettings] = useState({
    // Уведомления
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    reportUpdates: true,

    // Приватность
    profileVisible: true,
    showInLeaderboard: user.role !== "admin",
    anonymousReports: true,

    // Интерфейс
    darkMode: false,
    language: "ru",
    soundEnabled: true,

    // Безопасность
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
    if (confirm("Вы уверены, что хотите выйти из аккаунта для входа в другой?")) {
      onLogout()
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />
      case "moderator":
        return <UserCheck className="w-4 h-4" />
      case "organizer":
        return <Calendar className="w-4 h-4" />
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
    <div className="p-3 space-y-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen max-w-md mx-auto md:max-w-none">
      {/* Заголовок */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-slate-600 to-slate-800 rounded-full mb-4 shadow-lg">
          <SettingsIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Настройки</h1>
        <p className="text-gray-600 text-sm">Управление профилем и предпочтениями</p>
      </div>

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
          <Shield className="w-3 h-3 mr-1" />
          Аккаунт
        </Button>
        <Button
          variant={activeTab === "app" ? "default" : "outline"}
          onClick={() => setActiveTab("app")}
          className={`flex-1 text-xs whitespace-nowrap ${activeTab === "app" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
        >
          <Smartphone className="w-3 h-3 mr-1" />
          Приложение
        </Button>
      </div>

      {/* Профиль */}
      {activeTab === "profile" && (
        <>
          <Card className="shadow-xl border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-slate-800 text-lg">
                  <User className="w-5 h-5 mr-2" />
                  Мой профиль
                </CardTitle>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex space-x-1">
                    <Button onClick={handleSaveProfile} variant="ghost" size="sm">
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button onClick={handleCancelEdit} variant="ghost" size="sm">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                    {currentUser.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                {isEditing ? (
                  <div className="w-full space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя и фамилия</Label>
                      <Input
                        id="name"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Город</Label>
                      <Select
                        value={editData.city}
                        onValueChange={(value) => setEditData({ ...editData, city: value })}
                      >
                        <SelectTrigger>
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

                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{currentUser.name}</h2>
                    <p className="text-gray-600 mb-3">{currentUser.email}</p>

                    <div className="flex items-center mb-4">
                      {getRoleIcon(currentUser.role)}
                      <span className="ml-2 font-medium text-gray-700">{getRoleLabel(currentUser.role)}</span>
                    </div>

                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{currentUser.city}</span>
                    </div>

                    <div className="flex items-center space-x-8 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{currentUser.points || 0}</p>
                        <p className="text-sm text-gray-600">Баллов</p>
                      </div>
                      <div className="w-px h-12 bg-gray-300"></div>
                      <div>
                        <p className="text-2xl font-bold text-green-600">{currentUser.level}</p>
                        <p className="text-sm text-gray-600">Уровень</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-lg font-bold text-blue-600">12</p>
                  <p className="text-xs text-gray-600">Мероприятий</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-lg font-bold text-green-600">3</p>
                  <p className="text-xs text-gray-600">Курсов</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <p className="text-lg font-bold text-purple-600">2</p>
                  <p className="text-xs text-gray-600">Сигналов</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-lg font-bold text-orange-600">45</p>
                  <p className="text-xs text-gray-600">Дней</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Настройки аккаунта */}
      {activeTab === "account" && (
        <>
          {/* Безопасность */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Shield className="w-5 h-5 mr-2" />
                Безопасность аккаунта
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Двухфакторная аутентификация</p>
                  <p className="text-sm text-gray-600">Дополнительная защита аккаунта</p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({ ...settings, twoFactorAuth: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Уведомления о входе</p>
                  <p className="text-sm text-gray-600">Получать уведомления при входе</p>
                </div>
                <Switch
                  checked={settings.loginAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, loginAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Смена пароля */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Shield className="w-5 h-5 mr-2" />
                Смена пароля
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>

              <Button
                onClick={handleChangePassword}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
                disabled={!passwords.current || !passwords.new || !passwords.confirm}
              >
                Изменить пароль
              </Button>
            </CardContent>
          </Card>

          {/* Приватность */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Eye className="w-5 h-5 mr-2" />
                Приватность
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Видимость профиля</p>
                  <p className="text-sm text-gray-600">Показывать профиль другим</p>
                </div>
                <Switch
                  checked={settings.profileVisible}
                  onCheckedChange={(checked) => setSettings({ ...settings, profileVisible: checked })}
                />
              </div>

              {user.role !== "admin" && (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Участие в рейтинге</p>
                    <p className="text-sm text-gray-600">Показывать в таблице лидеров</p>
                  </div>
                  <Switch
                    checked={settings.showInLeaderboard}
                    onCheckedChange={(checked) => setSettings({ ...settings, showInLeaderboard: checked })}
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Анонимные сигналы по умолчанию</p>
                  <p className="text-sm text-gray-600">Подавать сигналы анонимно</p>
                </div>
                <Switch
                  checked={settings.anonymousReports}
                  onCheckedChange={(checked) => setSettings({ ...settings, anonymousReports: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Настройки приложения */}
      {activeTab === "app" && (
        <>
          {/* Уведомления */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Bell className="w-5 h-5 mr-2" />
                Уведомления
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push-уведомления</p>
                  <p className="text-sm text-gray-600">Уведомления в приложении</p>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email уведомления</p>
                  <p className="text-sm text-gray-600">Уведомления на почту</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS уведомления</p>
                  <p className="text-sm text-gray-600">Уведомления на телефон</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Напоминания о мероприятиях</p>
                  <p className="text-sm text-gray-600">За 1 час до события</p>
                </div>
                <Switch
                  checked={settings.eventReminders}
                  onCheckedChange={(checked) => setSettings({ ...settings, eventReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Обновления по сигналам</p>
                  <p className="text-sm text-gray-600">Статус рассмотрения</p>
                </div>
                <Switch
                  checked={settings.reportUpdates}
                  onCheckedChange={(checked) => setSettings({ ...settings, reportUpdates: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Интерфейс */}
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Smartphone className="w-5 h-5 mr-2" />
                Интерфейс
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Темная тема</p>
                  <p className="text-sm text-gray-600">Переключить на темный режим</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Звуковые уведомления</p>
                  <p className="text-sm text-gray-600">Звуки в приложении</p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Язык интерфейса</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger>
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
        </>
      )}

      {/* Кнопка сохранения настроек */}
      <Button
        onClick={handleSaveSettings}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Save className="w-5 h-5 mr-2" />
        Сохранить настройки
      </Button>

      {/* Кнопки действий */}
      <div className="space-y-3">
        <Button
          onClick={() => window.dispatchEvent(new CustomEvent("navigate", { detail: "emergency" }))}
          variant="outline"
          className="w-full bg-red-50 text-red-600 border-red-200 hover:bg-red-100 py-3"
        >
          <Phone className="w-4 h-4 mr-2" />
          Экстренные службы
        </Button>

        <Button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Сменить аккаунт
        </Button>
      </div>
    </div>
  )
}
