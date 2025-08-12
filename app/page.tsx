"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Languages } from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

// Universal environment detection
const getEnvironmentInfo = () => {
  if (typeof window === "undefined") return { isServer: true }

  return {
    isServer: false,
    isIframe: window !== window.parent,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile/i.test(navigator.userAgent),
    isEmbedded: document.referrer && document.referrer !== window.location.href,
    origin: window.location.origin,
    referrer: document.referrer,
    userAgent: navigator.userAgent,
  }
}

// Universal API URL detection
const getApiUrl = () => {
  if (typeof window === "undefined") return "/api/chat"

  const env = getEnvironmentInfo()
  const baseUrl = env.origin || window.location.origin
  return `${baseUrl}/api/chat`
}

// Improved markdown renderer component
const MarkdownRenderer = ({ content }: { content: string }) => {
  const renderContent = (text: string) => {
    text = text.replace(/\n\n/g, "<br><br>")
    text = text.replace(/\n/g, "<br>")
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>")
    text = text.replace(/^- (.+)$/gm, "<div style='margin: 4px 0;'>• $1</div>")
    text = text.replace(/^\d+\. (.+)$/gm, "<div style='margin: 4px 0;'>• $1</div>")
    text = text.replace(/^### (.+)$/gm, "<div style='margin: 8px 0 4px 0;'><strong>$1</strong></div>")
    text = text.replace(/^## (.+)$/gm, "<div style='margin: 8px 0 4px 0;'><strong>$1</strong></div>")
    text = text.replace(/^# (.+)$/gm, "<div style='margin: 8px 0 4px 0;'><strong>$1</strong></div>")
    text = text.replace(
      /`([^`]+)`/g,
      '<span style="background-color: #f3f4f6; padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 13px;">$1</span>',
    )
    return text
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: renderContent(content) }}
      style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: "14px",
        lineHeight: "1.6",
        wordBreak: "break-word",
        whiteSpace: "normal",
      }}
    />
  )
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("french")
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [showCongratulations, setShowCongratulations] = useState(true)
  const [environmentInfo, setEnvironmentInfo] = useState<any>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Detect environment on mount
  useEffect(() => {
    const env = getEnvironmentInfo()
    setEnvironmentInfo(env)
    console.log("Environment detected:", env)
  }, [])

  const languages = [
    { value: "arabic", label: "العربية", flag: "🇸🇦" },
    { value: "english", label: "English", flag: "🇺🇸" },
    { value: "french", label: "Français", flag: "🇫🇷" },
  ]

  const placeholders = {
    arabic: "اسأل عن أي جانب من الدورة...",
    english: "Ask about any aspect of the course...",
    french: "Posez une question sur le cours...",
  }

  const welcomeMessages = {
    arabic:
      "مرحباً بك! أنا مساعدك الذكي لدورة إدارة المواعيد في أكاديمية إي-لومي للجمال الرقمية. أنا هنا لمساعدتك في فهم أي جانب من جوانب إدارة المواعيد أو الإجابة على أسئلتك العملية بعد إكمال الدورة. كيف يمكنني مساعدتك اليوم؟",
    english:
      "Welcome! I'm your AI assistant for the appointment management course on E-lumy Digital Beauty Academy. I'm here to help you understand any aspect of appointment scheduling or answer your practical questions after completing the course. How can I help you today?",
    french:
      "Bienvenue ! Je suis votre assistant IA pour le cours de gestion des rendez-vous sur l'Académie de Beauté Numérique E-lumy. Je suis là pour vous aider à comprendre tout aspect de la planification des rendez-vous ou répondre à vos questions pratiques après avoir terminé le cours. Comment puis-je vous aider aujourd'hui ?",
  }

  const commonQuestions = {
    arabic: [
      "كيف أنظم جدول المواعيد بفعالية؟",
      "ما هي الأدوات اللازمة لحجز المواعيد؟",
      "كيف أتعامل مع تضارب المواعيد؟",
    ],
    english: [
      "How do I organize appointments efficiently?",
      "What tools are needed for booking appointments?",
      "How do I handle appointment conflicts?",
    ],
    french: [
      "Comment organiser efficacement les rendez-vous?",
      "Quels outils sont nécessaires pour la prise de rendez-vous?",
      "Comment gérer les conflits de rendez-vous?",
    ],
  }

  // Improved auto-scroll effect
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        // Try multiple methods to ensure scrolling works in all environments
        const scrollContainer =
          scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") || scrollAreaRef.current

        if (scrollContainer) {
          // Method 1: Set scrollTop
          scrollContainer.scrollTop = scrollContainer.scrollHeight

          // Method 2: Use scrollIntoView as backup
          setTimeout(() => {
            const lastMessage = scrollContainer.querySelector("[data-message-id]:last-child")
            if (lastMessage) {
              lastMessage.scrollIntoView({ behavior: "smooth", block: "end" })
            }
          }, 100)

          // Method 3: Force scroll with requestAnimationFrame
          requestAnimationFrame(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight
          })
        }
      }
    }

    // Scroll immediately
    scrollToBottom()

    // Also scroll after a short delay to handle any layout changes
    const timeoutId = setTimeout(scrollToBottom, 200)

    return () => clearTimeout(timeoutId)
  }, [messages])

  // Additional effect to scroll when loading state changes
  useEffect(() => {
    if (!isLoading && scrollAreaRef.current) {
      const scrollContainer =
        scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") || scrollAreaRef.current
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }, 300)
      }
    }
  }, [isLoading])

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer =
        scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]") || scrollAreaRef.current

      if (scrollContainer) {
        // Smooth scroll to bottom
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: "smooth",
        })

        // Fallback for browsers that don't support smooth scrolling
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight
        }, 100)
      }
    }
  }, [])

  // Universal API call function with multiple fallbacks
  const makeApiCall = async (messageContent: string, conversationMessages: Message[]) => {
    const languageInstructions = {
      arabic: "Always respond in Arabic",
      english: "Always respond in English",
      french: "Always respond in French",
    }

    const outOfScopeMessages = {
      arabic:
        "عذراً، هذا السؤال خارج نطاق دورة إدارة المواعيد. أنا مختص فقط في الإجابة على الأسئلة المتعلقة بتقنيات إدارة المواعيد وتنظيم الجداول والبروتوكولات الإدارية التي تم تغطيتها في الدورة.",
      english:
        "Sorry, this question falls outside the scope of the appointment management course. I can only answer questions related to appointment scheduling techniques, planning organization, and administrative protocols covered in the course.",
      french:
        "Désolé, cette question sort du cadre du cours de gestion des rendez-vous. Je ne peux répondre qu'aux questions liées aux techniques de gestion des rendez-vous, à l'organisation des plannings et aux protocoles administratifs couverts dans le cours.",
    }

    // Try multiple API URL strategies
    const apiUrls = [
      getApiUrl(),
      "/api/chat",
      `${window.location.origin}/api/chat`,
      `${window.location.protocol}//${window.location.host}/api/chat`,
    ]

    let lastError: Error | null = null

    for (const apiUrl of apiUrls) {
      try {
        console.log("Trying API URL:", apiUrl)

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `You are a specialized tutor for E-lumy Digital Beauty Academy's appointment management course. 

LANGUAGE: ${languageInstructions[selectedLanguage as keyof typeof languageInstructions]}

CONVERSATION HANDLING:
- ALWAYS respond in the selected language (${selectedLanguage})
- For greetings (hi, hello, bonjour, salut, etc.) or basic conversational starters: Respond warmly and guide them to ask about appointment management topics
- For questions about appointment management course content: Provide helpful, detailed answers
- For completely unrelated topics (cooking, politics, other beauty treatments not in course, etc.): Use the out-of-scope message

OUT-OF-SCOPE RESPONSE (only for truly unrelated topics):
${outOfScopeMessages[selectedLanguage as keyof typeof outOfScopeMessages]}

RESPONSE FORMAT:
- Keep answers SHORT and BITE-SIZED (maximum 3-4 sentences)
- Use line breaks between different points for better readability
- You can use **bold** for emphasis and - for bullet points if helpful
- Answer the specific question directly
- Add ONE quick practical tip if helpful
- Be concise and to the point

APPOINTMENT MANAGEMENT COURSE CONTENT INCLUDES:
- Efficient appointment scheduling organization
- Essential tools and information for booking appointments (agenda, software, client database)
- Professional attitude and communication for appointment booking
- Making appointment booking simple, fast and flexible
- Preparing and conducting successful appointments
- Building clear and realistic appointment schedules
- Managing appointment conflicts and cancellations
- Client information management and follow-up
- Staff scheduling and resource allocation
- Using paper agendas vs. management software
- Optimizing time slots and avoiding downtime
- Handling walk-ins and last-minute requests
- Spa and beauty salon appointment coordination
- Managing multiple treatment rooms and staff
- Client database management and history tracking

EXAMPLES:
- "Hi" → Respond warmly in selected language and ask how you can help with appointment management questions
- "How do I organize appointments?" → Provide detailed course-related answer
- "How to cook pasta?" → Use out-of-scope response`,
              },
              ...conversationMessages.map((m) => ({ role: m.role, content: m.content })),
              { role: "user", content: messageContent },
            ],
          }),
        })

        if (response.ok) {
          const data = await response.json()
          console.log("API call successful with URL:", apiUrl)
          return data
        } else {
          const errorData = await response.json().catch(() => ({}))
          lastError = new Error(`HTTP ${response.status}: ${errorData.error || "Unknown error"}`)
          console.warn("API call failed with URL:", apiUrl, lastError.message)
        }
      } catch (error) {
        lastError = error as Error
        console.warn("API call failed with URL:", apiUrl, error)
      }
    }

    // If all URLs failed, throw the last error
    throw lastError || new Error("All API endpoints failed")
  }

  const handleQuestionClick = async (question: string) => {
    setShowSuggestions(false)
    setShowCongratulations(false)
    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    try {
      const data = await makeApiCall(question, messages)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error("Error:", error)
      const errorMessages = {
        arabic: "عذراً، حدث خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
        english: "Sorry, a connection error occurred. Please check your internet connection and try again.",
        french:
          "Désolé, une erreur de connexion s'est produite. Veuillez vérifier votre connexion internet et réessayer.",
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessages[selectedLanguage as keyof typeof errorMessages],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    setShowSuggestions(false)
    setShowCongratulations(false)
    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const messageContent = input
    setInput("")

    try {
      const data = await makeApiCall(messageContent, messages)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error("Error:", error)
      const errorMessages = {
        arabic: "عذراً، حدث خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.",
        english: "Sorry, a connection error occurred. Please check your internet connection and try again.",
        french:
          "Désolé, une erreur de connexion s'est produite. Veuillez vérifier votre connexion internet et réessayer.",
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorMessages[selectedLanguage as keyof typeof errorMessages],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Responsive layout based on environment
  const isCompact = environmentInfo.isIframe || environmentInfo.isMobile || environmentInfo.isEmbedded

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setShowSuggestions(true)
    setMessages([
      {
        role: "assistant",
        content: welcomeMessages[language as keyof typeof welcomeMessages],
        timestamp: new Date(),
      },
    ])
  }

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: welcomeMessages[selectedLanguage as keyof typeof welcomeMessages],
        timestamp: new Date(),
      },
    ])
  }, []) // Run only once on mount

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#CF9FFF" }}>
      <div className="flex max-w-7xl mx-auto lg:p-4 lg:pt-4 lg:gap-6">
        {/* Main Chat Container */}
        <div className={`${showCongratulations ? "flex-1 lg:max-w-4xl" : "flex-1 lg:max-w-6xl lg:mx-auto"} w-full`}>
          <div className="bg-white lg:rounded-2xl shadow-xl overflow-hidden min-h-screen lg:min-h-[70vh]">
            {/* Chat Header with Integrated Logo */}
            <div
              className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-100"
              style={{ background: "linear-gradient(90deg, #000435 0%, #CF9FFF 100%)" }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {/* E-lumy Digital Beauty Academy Logo */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg p-1 shadow-sm">
                    <Image
                      src="/images/e-lumy-robot-logo.png"
                      alt="E-lumy Digital Beauty Academy"
                      width={40}
                      height={40}
                      className="object-contain w-full h-full"
                      priority
                      unoptimized
                    />
                  </div>
                  <div>
                    <h2
                      className="text-base sm:text-lg font-bold text-white"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {selectedLanguage === "arabic" && "مساعد دورة إدارة المواعيد"}
                      {selectedLanguage === "english" && "Appointment Management Course Assistant"}
                      {selectedLanguage === "french" && "Assistant Cours Gestion des Rendez-vous"}
                    </h2>
                    <p
                      className="text-xs sm:text-sm text-white/90 font-light"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {selectedLanguage === "arabic" && "أكاديمية إي-لومي للجمال الرقمية"}
                      {selectedLanguage === "english" && "E-lumy Digital Beauty Academy"}
                      {selectedLanguage === "french" && "Académie de Beauté Numérique E-lumy"}
                    </p>
                  </div>
                </div>

                {/* Language Selector */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Languages className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-24 sm:w-32 bg-white/10 border-white/20 text-white text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          <div className="flex items-center space-x-2">
                            <span>{lang.flag}</span>
                            <span className="text-xs sm:text-sm">{lang.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="h-[calc(100vh-140px)] sm:h-96 p-3 sm:p-6" ref={scrollAreaRef}>
              <div className="space-y-4 sm:space-y-6">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    data-message-id={message.id}
                    data-message-index={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${
                        message.role === "user" ? "text-white shadow-lg" : "bg-gray-50 text-gray-900 shadow-sm"
                      }`}
                      style={
                        message.role === "user"
                          ? {
                              background: "linear-gradient(135deg, #000435 0%, #CF9FFF 100%)",
                            }
                          : {}
                      }
                    >
                      <div className="space-y-1 sm:space-y-2">
                        {message.role === "assistant" ? (
                          <MarkdownRenderer content={message.content} />
                        ) : (
                          <p
                            className="whitespace-pre-wrap font-regular leading-relaxed text-sm"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                          >
                            {message.content}
                          </p>
                        )}
                        <p
                          className={`text-xs font-light ${message.role === "user" ? "text-white/80" : "text-gray-500"}`}
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Suggested Questions */}
                {showSuggestions && messages.length === 1 && (
                  <div className="flex justify-start">
                    <div className="max-w-[95%] sm:max-w-[90%] space-y-2 sm:space-y-3">
                      <p className="text-sm text-gray-500 font-light" style={{ fontFamily: "var(--font-montserrat)" }}>
                        {selectedLanguage === "arabic" && "أسئلة شائعة:"}
                        {selectedLanguage === "english" && "Common questions:"}
                        {selectedLanguage === "french" && "Questions fréquentes:"}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                        {commonQuestions[selectedLanguage as keyof typeof commonQuestions].map((question, index) => (
                          <Button
                            key={index}
                            onClick={() => handleQuestionClick(question)}
                            disabled={isLoading}
                            className="h-auto px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white border border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full transition-all duration-200 shadow-sm hover:shadow-md text-left justify-start"
                            style={{ fontFamily: "var(--font-montserrat)" }}
                            variant="outline"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ backgroundColor: "#000435" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ backgroundColor: "#000435", animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ backgroundColor: "#000435", animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span
                          className="text-sm font-light text-gray-500"
                          style={{ fontFamily: "var(--font-montserrat)" }}
                        >
                          {selectedLanguage === "arabic" && "جاري الكتابة..."}
                          {selectedLanguage === "english" && "Typing..."}
                          {selectedLanguage === "french" && "En cours de frappe..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-3 sm:p-6 bg-white">
              <div className="flex space-x-2 sm:space-x-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={placeholders[selectedLanguage as keyof typeof placeholders]}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border-2 px-3 sm:px-4 py-2 sm:py-3 text-sm font-regular focus:border-2 transition-colors"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                    borderColor: "#000435",
                    focusBorderColor: "#CF9FFF",
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="rounded-xl px-4 sm:px-6 py-2 sm:py-3 font-bold text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #000435 0%, #CF9FFF 100%)",
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p
                className="text-xs font-light text-gray-500 mt-2 text-center"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {selectedLanguage === "arabic" && "اضغط Enter للإرسال"}
                {selectedLanguage === "english" && "Press Enter to send"}
                {selectedLanguage === "french" && "Appuyez sur Entrée pour envoyer"}
              </p>
            </div>
          </div>

          {/* Footer - Now visible in all environments */}
          <div className="text-center mt-4">
            <p className="text-sm font-light text-gray-600" style={{ fontFamily: "var(--font-montserrat)" }}>
              © 2024 E-lumy Digital Beauty Academy.
              {selectedLanguage === "arabic" && " جميع الحقوق محفوظة"}
              {selectedLanguage === "english" && " All rights reserved"}
              {selectedLanguage === "french" && " Tous droits réservés"}
              <br />
              <span className="text-xs">
                {selectedLanguage === "arabic" && "الجلسات الحضورية متوفرة في معهد فندي للتجميل"}
                {selectedLanguage === "english" && "In-person sessions available at Institut Fandi D'Esthétique"}
                {selectedLanguage === "french" && "Sessions en présentiel disponibles à l'institut Fandi D'Esthétique"}
              </span>
            </p>
          </div>
        </div>

        {/* Right Sidebar - Show when congratulations is enabled */}
        {showCongratulations && (
          <div className="w-80 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-4">
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-full p-4">
                    <div className="text-4xl">🎉</div>
                  </div>
                </div>

                <div className="text-center">
                  <h3
                    className="text-xl font-bold text-green-800 mb-2"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {selectedLanguage === "arabic" && "تهانينا!"}
                    {selectedLanguage === "english" && "Congratulations!"}
                    {selectedLanguage === "french" && "Félicitations !"}
                  </h3>
                  <p className="text-sm font-semibold text-green-700" style={{ fontFamily: "var(--font-montserrat)" }}>
                    {selectedLanguage === "arabic" && "لقد اجتزت الاختبار بنجاح"}
                    {selectedLanguage === "english" && "You passed the quiz successfully"}
                    {selectedLanguage === "french" && "Vous avez réussi le quiz"}
                  </p>
                </div>

                <div className="border-t border-gray-200"></div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {selectedLanguage === "arabic" && "استخدم هذه الواجهة"}
                      {selectedLanguage === "english" && "Use This Interface"}
                      {selectedLanguage === "french" && "Utilisez Cette Interface"}
                    </h4>
                    <p
                      className="text-sm text-gray-600 leading-relaxed"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {selectedLanguage === "arabic" &&
                        "يمكنك الآن استخدام هذه الواجهة للحصول على إجابات لأي أسئلة قد تكون لديك حول دورة إدارة المواعيد."}
                      {selectedLanguage === "english" &&
                        "You can now use this chat interface to get answers to any questions you might still have about the appointment management course."}
                      {selectedLanguage === "french" &&
                        "Vous pouvez maintenant utiliser cette interface pour obtenir des réponses à toutes les questions que vous pourriez encore avoir sur le cours de gestion des rendez-vous."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {selectedLanguage === "arabic" && "جلسات تدريبية في المعهد"}
                      {selectedLanguage === "english" && "Onsite Training Sessions"}
                      {selectedLanguage === "french" && "Sessions de Formation Sur Site"}
                    </h4>
                    <p
                      className="text-sm text-gray-600 leading-relaxed"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {selectedLanguage === "arabic" &&
                        "ستُقام جلسات تدريبية عملية في المعهد لمساعدتك على الممارسة وتعميق معرفتك بتقنيات إدارة المواعيد."}
                      {selectedLanguage === "english" &&
                        "Practical training sessions will be hosted at the institute to help you practice and deepen your knowledge of appointment management techniques."}
                      {selectedLanguage === "french" &&
                        "Des sessions de formation pratique seront organisées à l'institut pour vous aider à pratiquer et approfondir vos connaissances des techniques de gestion des rendez-vous."}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {selectedLanguage === "arabic" && "ابدأ بطرح أسئلتك الآن"}
                      {selectedLanguage === "english" && "Start asking your questions now"}
                      {selectedLanguage === "french" && "Commencez à poser vos questions maintenant"}
                    </p>
                    <div className="w-full h-1 bg-gradient-to-r from-green-200 to-emerald-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
