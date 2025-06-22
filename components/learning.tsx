"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play, CheckCircle, Award, Clock, Users, Trophy, Video, Download } from "lucide-react"
import { useToast } from "@/components/toast"
import { useAppState } from "@/components/app-state"

interface LearningProps {
  user: any
}

const courses = [
  {
    id: 1,
    title: "Основы антикоррупционного законодательства РК",
    description: "Изучение базовых принципов и норм антикоррупционного права Казахстана",
    duration: "2 часа",
    lessons: 8,
    videos: 6,
    points: 50,
    difficulty: "Начальный",
    progress: 0,
    status: "available",
    category: "law",
    videoUrl: "https://example.com/video1.mp4",
  },
  {
    id: 2,
    title: "Процедуры подачи сигналов о коррупции",
    description: "Пошаговое руководство по правильному оформлению и подаче сигналов",
    duration: "1.5 часа",
    lessons: 6,
    videos: 4,
    points: 35,
    difficulty: "Начальный",
    progress: 25,
    status: "in_progress",
    category: "procedures",
    videoUrl: "https://example.com/video2.mp4",
  },
  {
    id: 3,
    title: "Этика государственной службы",
    description: "Принципы этичного поведения и конфликт интересов в госсекторе",
    duration: "3 часа",
    lessons: 12,
    videos: 8,
    points: 75,
    difficulty: "Средний",
    progress: 0,
    status: "locked",
    category: "ethics",
    videoUrl: "https://example.com/video3.mp4",
  },
]

const quizzes = [
  {
    id: 1,
    title: 'Тест: Закон РК "О противодействии коррупции"',
    questions: 15,
    points: 20,
    timeLimit: "15 мин",
    attempts: 3,
    bestScore: null,
    status: "available",
  },
  {
    id: 2,
    title: "Викторина: Коррупционные правонарушения",
    questions: 10,
    points: 15,
    timeLimit: "10 мин",
    attempts: 2,
    bestScore: 85,
    status: "completed",
  },
]

const testQuestions = {
  1: [
    {
      question: "Что такое коррупция согласно законодательству РК?",
      options: [
        "Только взяточничество",
        "Злоупотребление служебными полномочиями в личных целях",
        "Нарушение трудовой дисциплины",
        "Административное правонарушение",
      ],
      correct: 1,
    },
    {
      question: "Какой орган занимается противодействием коррупции в РК?",
      options: [
        "Министерство внутренних дел",
        "Агентство по противодействию коррупции",
        "Генеральная прокуратура",
        "Все перечисленные",
      ],
      correct: 3,
    },
    {
      question: "Какая статья УК РК предусматривает ответственность за получение взятки?",
      options: ["Статья 365", "Статья 366", "Статья 367", "Статья 368"],
      correct: 1,
    },
    {
      question: "Какой максимальный срок рассмотрения сигнала о коррупции?",
      options: ["15 дней", "30 дней", "45 дней", "60 дней"],
      correct: 1,
    },
    {
      question: "Что НЕ является коррупционным правонарушением?",
      options: ["Получение взятки", "Дача взятки", "Опоздание на работу", "Злоупотребление должностными полномочиями"],
      correct: 2,
    },
  ],
  2: [
    {
      question: "Какие виды коррупционных правонарушений существуют?",
      options: ["Только уголовные", "Только административные", "Уголовные и административные", "Только дисциплинарные"],
      correct: 2,
    },
    {
      question: "Кто может подать сигнал о коррупции?",
      options: [
        "Только граждане РК",
        "Только государственные служащие",
        "Любое физическое или юридическое лицо",
        "Только волонтеры",
      ],
      correct: 2,
    },
  ],
}

export function Learning({ user }: LearningProps) {
  const [activeTab, setActiveTab] = useState<"courses" | "quizzes">("courses")
  const [currentTest, setCurrentTest] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [testScore, setTestScore] = useState(0)
  const [testCompleted, setTestCompleted] = useState(false)
  const [showVideo, setShowVideo] = useState<number | null>(null)
  const { showToast } = useToast()
  const { state, dispatch } = useAppState()

  const handleStartCourse = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return

    showToast(`Начат курс: ${course.title}`, "success")
    course.status = "in_progress"
    course.progress = 10
  }

  const handleContinueCourse = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return

    showToast(`Продолжение курса: ${course.title}`, "info")
  }

  const handleWatchVideo = (courseId: number) => {
    setShowVideo(courseId)
    showToast("Открытие видеоурока...", "info")
  }

  const handleStartQuiz = (quizId: number) => {
    const quiz = quizzes.find((q) => q.id === quizId)
    if (!quiz) return

    const questions = testQuestions[quizId as keyof typeof testQuestions]
    if (!questions) {
      showToast("Тест временно недоступен", "error")
      return
    }

    setCurrentTest({ ...quiz, questions })
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setTestScore(0)
    setTestCompleted(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentTest.questions[currentQuestion].correct
    if (isCorrect) {
      setTestScore(testScore + 1)
    }

    if (currentQuestion < currentTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      completeTest()
    }
  }

  const completeTest = () => {
    const finalScore = Math.round((testScore / currentTest.questions.length) * 100)
    const earnedPoints = Math.round((finalScore / 100) * currentTest.points)

    if (state.user) {
      dispatch({
        type: "UPDATE_USER",
        payload: { points: (state.user.points || 0) + earnedPoints },
      })
    }

    dispatch({
      type: "ADD_NOTIFICATION",
      payload: {
        id: Date.now().toString(),
        title: "Тест завершен!",
        message: `Результат: ${finalScore}%. Получено +${earnedPoints} баллов.`,
        type: finalScore >= 70 ? "success" : "warning",
        timestamp: new Date(),
        read: false,
      },
    })

    setTestCompleted(true)
    showToast(`Тест завершен! Результат: ${finalScore}%`, finalScore >= 70 ? "success" : "warning")
  }

  const handleCloseTest = () => {
    setCurrentTest(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setTestScore(0)
    setTestCompleted(false)
  }

  const handleDownloadCertificate = () => {
    showToast("Сертификат скачан!", "success")
  }

  // Видеоплеер
  if (showVideo) {
    const course = courses.find((c) => c.id === showVideo)
    return (
      <div className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{course?.title}</CardTitle>
              <Button onClick={() => setShowVideo(null)} variant="ghost" size="sm">
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Видеоурок</p>
                  <p className="text-sm text-gray-500">"{course?.title}"</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                  <Play className="w-4 h-4 mr-2" />
                  Воспроизвести
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Скачать
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Тест
  if (currentTest) {
    const question = currentTest.questions[currentQuestion]
    const progress = ((currentQuestion + 1) / currentTest.questions.length) * 100

    if (testCompleted) {
      const finalScore = Math.round((testScore / currentTest.questions.length) * 100)
      return (
        <div className="p-4 max-w-md mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              <CardTitle>Тест завершен!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{finalScore}%</p>
                  <p className="text-gray-600">Ваш результат</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">
                    {testScore} из {currentTest.questions.length} правильных ответов
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCloseTest} variant="outline" className="flex-1">
                    Закрыть
                  </Button>
                  <Button onClick={() => handleStartQuiz(currentTest.id)} className="flex-1">
                    Пройти снова
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return (
      <div className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg truncate">{currentTest.title}</CardTitle>
              <Button onClick={handleCloseTest} variant="ghost" size="sm">
                ✕
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  Вопрос {currentQuestion + 1} из {currentTest.questions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-base font-semibold leading-relaxed break-words">{question.question}</h3>
              <div className="space-y-2">
                {question.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className={`w-full text-left justify-start h-auto p-3 whitespace-normal break-words ${
                      selectedAnswer === index ? "bg-blue-600 text-white" : ""
                    }`}
                  >
                    <span className="mr-2 font-bold flex-shrink-0">{String.fromCharCode(65 + index)}.</span>
                    <span className="break-words">{option}</span>
                  </Button>
                ))}
              </div>
              <Button onClick={handleNextQuestion} disabled={selectedAnswer === null} className="w-full">
                {currentQuestion < currentTest.questions.length - 1 ? "Следующий вопрос" : "Завершить тест"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-3 space-y-4 max-w-md mx-auto md:max-w-none">
      {/* Заголовок */}
      <div className="text-center py-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Обучение</h1>
        <p className="text-sm md:text-base text-gray-600">Изучайте антикоррупционное право и получайте сертификаты</p>
      </div>

      {/* Статистика обучения */}
      <Card>
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-blue-600">1</p>
              <p className="text-xs text-gray-600">Курсов пройдено</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">{state.user?.points || 0}</p>
              <p className="text-xs text-gray-600">Баллов заработано</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">2</p>
              <p className="text-xs text-gray-600">Сертификатов</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Табы */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === "courses" ? "default" : "outline"}
          onClick={() => setActiveTab("courses")}
          className={`text-sm ${activeTab === "courses" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
        >
          <BookOpen className="w-4 h-4 mr-1" />
          Курсы
        </Button>
        <Button
          variant={activeTab === "quizzes" ? "default" : "outline"}
          onClick={() => setActiveTab("quizzes")}
          className={`text-sm ${activeTab === "quizzes" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
        >
          <Award className="w-4 h-4 mr-1" />
          Тесты
        </Button>
      </div>

      {/* Курсы */}
      {activeTab === "courses" && (
        <div className="space-y-3">
          {courses.map((course) => {
            const isLocked = course.status === "locked"

            return (
              <Card key={course.id} className={isLocked ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base leading-tight">{course.title}</CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {course.progress > 0 && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Прогресс</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <Video className="w-3 h-3 mr-1" />
                          {course.videos} видео
                        </div>
                      </div>
                      <div className="flex items-center text-green-600">
                        <Award className="w-3 h-3 mr-1" />
                        <span className="text-sm font-medium">+{course.points}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleWatchVideo(course.id)}
                        disabled={isLocked}
                        variant="outline"
                        className="flex-1 text-sm"
                      >
                        <Video className="w-4 h-4 mr-1" />
                        Видео
                      </Button>
                      <Button
                        onClick={() => {
                          if (course.status === "in_progress") {
                            handleContinueCourse(course.id)
                          } else if (!isLocked) {
                            handleStartCourse(course.id)
                          }
                        }}
                        disabled={isLocked}
                        className={`flex-1 text-sm ${
                          course.status === "in_progress"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : course.status === "completed"
                              ? "bg-green-600 text-white"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {course.status === "in_progress" ? (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Продолжить
                          </>
                        ) : course.status === "completed" ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Завершён
                          </>
                        ) : isLocked ? (
                          "Заблокирован"
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Начать
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
      )}

      {/* Тесты */}
      {activeTab === "quizzes" && (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base leading-tight">{quiz.title}</CardTitle>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {quiz.questions} вопросов
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {quiz.timeLimit}
                    </div>
                    <div className="flex items-center">
                      <Award className="w-3 h-3 mr-1" />+{quiz.points} баллов
                    </div>
                    <div className="flex items-center">
                      <Play className="w-3 h-3 mr-1" />
                      {quiz.attempts} попытки
                    </div>
                  </div>

                  {quiz.bestScore && (
                    <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        Лучший результат: <span className="font-bold">{quiz.bestScore}%</span>
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleStartQuiz(quiz.id)}
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 text-sm"
                  >
                    {quiz.status === "completed" ? "Пройти снова" : "Начать тест"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Сертификаты */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-base">
            <Award className="w-4 h-4 mr-2 text-yellow-600" />
            Мои сертификаты
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center p-2 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                <Award className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 text-sm">Основы антикоррупционного права</p>
                <p className="text-xs text-gray-600">Получен 15 января 2024</p>
              </div>
              <Button onClick={handleDownloadCertificate} variant="outline" size="sm" className="text-xs px-2 py-1">
                Скачать
              </Button>
            </div>

            <div className="text-center py-3 text-gray-500">
              <p className="text-sm">Завершите курсы, чтобы получить больше сертификатов</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
