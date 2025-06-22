"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Zap, Copy, ThumbsUp, ThumbsDown, Minimize2, Maximize2 } from "lucide-react"

interface ChatbotProps {
  user: any
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  liked?: boolean
  disliked?: boolean
}

const quickQuestions = [
  "Как подать сигнал о коррупции?",
  "Какие права у волонтёра?",
  "Как зарегистрироваться на мероприятие?",
  "Что делать при вымогательстве взятки?",
  "Куда обращаться с жалобой?",
  "Как заработать баллы в рейтинге?",
]

export function Chatbot({ user }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Привет, ${user.name}! Я ваш ИИ-помощник по антикоррупционным вопросам. Задавайте любые вопросы о законодательстве РК, процедурах подачи сигналов или участии в мероприятиях.`,
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          context: {
            userName: user.name,
            userRole: user.role,
            userCity: user.city,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Извините, произошла ошибка. Попробуйте позже или обратитесь к модератору через раздел 'Сигналы'.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleQuickQuestion = (question: string) => {
    sendMessage(question)
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    // Можно добавить toast уведомление
  }

  const rateMessage = (messageId: string, rating: "like" | "dislike") => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          return {
            ...msg,
            liked: rating === "like" ? !msg.liked : false,
            disliked: rating === "dislike" ? !msg.disliked : false,
          }
        }
        return msg
      }),
    )
  }

  return (
    <div className="p-3 h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-blue-50 max-w-md mx-auto md:max-w-none">
      {/* Заголовок - компактный для мобильных */}
      <div className="text-center py-3">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full mb-2 shadow-lg">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">ИИ-Помощник</h1>
        <p className="text-sm text-gray-600">Консультации 24/7</p>
      </div>

      {/* Быстрые вопросы - скрываемые */}
      {!isMinimized && (
        <Card className="mb-3 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                Популярные вопросы
              </CardTitle>
              <Button onClick={() => setIsMinimized(!isMinimized)} variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Minimize2 className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-1">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-gray-700 hover:from-blue-100 hover:to-purple-100 h-auto py-1 px-2"
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isMinimized && (
        <Button onClick={() => setIsMinimized(false)} variant="outline" size="sm" className="mb-3 self-start">
          <Maximize2 className="w-4 h-4 mr-1" />
          Показать вопросы
        </Button>
      )}

      {/* Чат - основная область */}
      <Card className="flex-1 flex flex-col shadow-xl">
        <CardContent className="flex-1 flex flex-col p-3">
          <div className="flex-1 overflow-y-auto space-y-3 mb-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <Avatar className="w-8 h-8 shadow-lg">
                    <AvatarFallback
                      className={
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-gradient-to-r from-green-500 to-green-600 text-white"
                      }
                    >
                      {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className={`rounded-2xl p-3 shadow-lg ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
                    <div className="flex items-center justify-between mt-2">
                      <p className={`text-xs ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                        {message.timestamp.toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                      {message.sender === "bot" && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-5 w-5 p-0 hover:bg-gray-100"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rateMessage(message.id, "like")}
                            className={`h-5 w-5 p-0 hover:bg-gray-100 ${message.liked ? "text-green-600" : ""}`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => rateMessage(message.id, "dislike")}
                            className={`h-5 w-5 p-0 hover:bg-gray-100 ${message.disliked ? "text-red-600" : ""}`}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Avatar className="w-8 h-8 shadow-lg">
                    <AvatarFallback className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-lg">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">ИИ анализирует...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Форма ввода - всегда доступна */}
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Задайте вопрос о коррупции..."
              disabled={isLoading}
              className="flex-1 rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-xl px-4 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
