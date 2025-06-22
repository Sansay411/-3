"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Shield, Users, Award, MessageCircle } from "lucide-react"

interface OnboardingScreenProps {
  onComplete: () => void
}

const onboardingSteps = [
  {
    icon: Shield,
    title: "Добро пожаловать в Антикор",
    description: "Присоединяйтесь к движению за прозрачность и честность в Республике Казахстан",
    color: "text-blue-600",
  },
  {
    icon: Users,
    title: "Станьте волонтёром",
    description: "Участвуйте в мероприятиях, обучайтесь и помогайте бороться с коррупцией",
    color: "text-green-600",
  },
  {
    icon: Award,
    title: "Зарабатывайте баллы",
    description: "Получайте награды за активность, поднимайтесь в рейтинге волонтёров",
    color: "text-yellow-600",
  },
  {
    icon: MessageCircle,
    title: "ИИ-помощник",
    description: "Получайте консультации и поддержку от умного чатбота 24/7",
    color: "text-purple-600",
  },
]

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const step = onboardingSteps[currentStep]
  const IconComponent = step.icon

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4`}>
              <IconComponent className={`w-10 h-10 ${step.color}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h1>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>

          <div className="flex justify-center mb-8">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${index === currentStep ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="bg-white text-gray-700"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <Button onClick={nextStep} className="bg-blue-600 text-white hover:bg-blue-700">
              {currentStep === onboardingSteps.length - 1 ? "Начать" : "Далее"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
