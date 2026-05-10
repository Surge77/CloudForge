import { type NextRequest, NextResponse } from "next/server"

interface ChatHistory {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  message: string
  history?: ChatHistory[]
  mode?: string
}

const modeSystemPrompts: Record<string, string> = {
  review: "You are an expert code reviewer. Analyze the provided code for bugs, security issues, performance problems, and best practices. Be specific and actionable.",
  fix: "You are an expert debugger. Identify errors in the provided code and provide corrected implementations with clear explanations.",
  optimize: "You are a performance engineer. Suggest concrete optimizations for readability, performance, and maintainability.",
  chat: "You are an expert coding assistant inside CloudForge, a browser-based IDE. Answer coding questions clearly and concisely. Format code with markdown code blocks.",
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  const model = process.env.GROQ_CHAT_MODEL || "llama-3.3-70b-versatile"

  if (!apiKey) {
    return NextResponse.json({ error: "AI service not configured" }, { status: 503 })
  }

  try {
    const body: ChatRequest = await request.json()
    const { message, history = [], mode = "chat" } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const systemPrompt = modeSystemPrompts[mode] || modeSystemPrompts.chat

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...history.map((h) => ({ role: h.role, content: h.content })),
      { role: "user" as const, content: message },
    ]

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2048,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error("Groq chat error:", err)
      return NextResponse.json({ error: "AI service error" }, { status: 502 })
    }

    const data = await response.json()
    const responseText: string = data.choices?.[0]?.message?.content || ""

    return NextResponse.json({
      response: responseText,
      model: data.model || model,
      tokens: data.usage?.completion_tokens,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
