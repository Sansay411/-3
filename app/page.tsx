"use client"

import { useState, useEffect } from "react"
import { OnboardingScreen } from "@/components/onboarding-screen"
import { AuthScreen } from "@/components/auth-screen"
import { MainApp } from "@/components/main-app"
import { AppStateProvider } from "@/components/app-state"
import { useToast } from "@/components/toast"

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<"onboarding" | "auth" | "app">("onboarding")
  const [user, setUser] = useState<any>(null)
  const { ToastContainer } = useToast()

  useEffect(() => {
    // Проверяем, есть ли сохраненный пользователь
    const savedUser = localStorage.getItem("anticor-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setCurrentScreen("app")
    }
  }, [])

  const handleOnboardingComplete = () => {
    setCurrentScreen("auth")
  }

  const handleAuthComplete = (userData: any) => {
    setUser(userData)
    localStorage.setItem("anticor-user", JSON.stringify(userData))
    setCurrentScreen("app")
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("anticor-user")
    setCurrentScreen("onboarding")
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {currentScreen === "onboarding" && <OnboardingScreen onComplete={handleOnboardingComplete} />}
        {currentScreen === "auth" && <AuthScreen onAuthComplete={handleAuthComplete} />}
        {currentScreen === "app" && user && <MainApp user={user} onLogout={handleLogout} />}
      </div>
      <ToastContainer />
    </>
  )
}

export default function Home() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  )
}
