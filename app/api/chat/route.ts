import { type NextRequest, NextResponse } from "next/server"

// Universal CORS headers for any environment
const universalHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin, Referer, User-Agent",
  "Access-Control-Allow-Credentials": "false",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: universalHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Add universal headers to all responses
    const responseHeaders = { ...universalHeaders }

    const { messages } = await request.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", messages)
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400, headers: responseHeaders })
    }

    const apiKey =
      process.env.OPENROUTER_API_KEY ||
      process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
      process.env.REACT_APP_OPENROUTER_API_KEY

    // Enhanced logging for deployment debugging
    console.log("Environment check:", {
      hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY,
      hasPublicKey: !!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
      hasReactKey: !!process.env.REACT_APP_OPENROUTER_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    })

    if (!apiKey) {
      console.error("No API key found in environment variables")
      return NextResponse.json(
        {
          error: "Configuration manquante - Missing API configuration",
          debug: process.env.NODE_ENV === "development" ? "Check environment variables in Vercel dashboard" : undefined,
          hint: "Add OPENROUTER_API_KEY in Vercel Project Settings → Environment Variables",
        },
        { status: 500, headers: responseHeaders },
      )
    }

    // Get referer with fallbacks
    const referer =
      request.headers.get("referer") ||
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.VERCEL_URL ||
      "https://elumy-digital-platform.vercel.app"

    console.log("API Request - Messages:", messages.length, "Referer:", referer)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const models = [
        "deepseek/deepseek-r1-0528:free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "microsoft/phi-3-mini-128k-instruct:free",
        "google/gemma-2-9b-it:free",
      ]

      let lastError = null

      for (const model of models) {
        try {
          console.log(`Trying model: ${model}`)

          const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "HTTP-Referer": referer,
              "X-Title": "E-lumy Digital Beauty Academy - Appointment Management Course Assistant",
              "Content-Type": "application/json",
              "User-Agent": "E-lumy-Digital-Beauty-Academy-AI-Tutor/1.0",
            },
            body: JSON.stringify({
              model: model,
              messages: messages,
              temperature: 0.7,
              max_tokens: 1000,
              stream: false,
            }),
            signal: controller.signal,
          })

          console.log(`Model ${model} response status:`, response.status)

          if (response.ok) {
            const data = await response.json()

            // Validate response structure
            if (data?.choices?.[0]?.message?.content) {
              clearTimeout(timeoutId)
              console.log(`Successful API response with model: ${model}`)
              return NextResponse.json({ content: data.choices[0].message.content }, { headers: responseHeaders })
            }
          }

          // Store error for potential debugging
          const errorText = await response.text()
          lastError = `${model}: ${response.status} - ${errorText}`
          console.log(`Model ${model} failed:`, lastError)
        } catch (modelError) {
          lastError = `${model}: ${modelError instanceof Error ? modelError.message : "Unknown error"}`
          console.log(`Model ${model} error:`, lastError)
          continue
        }
      }

      // If all models failed
      clearTimeout(timeoutId)
      console.error("All models failed. Last error:", lastError)

      return NextResponse.json(
        {
          error: "Service temporairement indisponible - Service temporarily unavailable",
          details: process.env.NODE_ENV === "development" ? lastError : undefined,
          hint: "Please try again in a few moments",
        },
        { status: 503, headers: responseHeaders },
      )
    } finally {
      clearTimeout(timeoutId)
    }
  } catch (error) {
    console.error("Chat API error:", error)

    let errorMessage = "Erreur de connexion - Connection error"
    let statusCode = 500

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = "Délai d'attente dépassé - Request timeout"
        statusCode = 408
      } else if (error.message.includes("fetch")) {
        errorMessage = "Erreur de réseau - Network error"
        statusCode = 503
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
        debug: process.env.NODE_ENV === "development" ? "Check Vercel function logs" : undefined,
      },
      {
        status: statusCode,
        headers: universalHeaders,
      },
    )
  }
}
