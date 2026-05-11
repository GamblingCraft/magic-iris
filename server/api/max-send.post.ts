// server/api/max-send.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

type FormType = 'cta' | 'quiz'

type MaxSendBody = {
  type?: FormType
  data?: Record<string, any>
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig(event)

    const maxBotToken = config.maxBotToken || process.env.MAX_BOT_TOKEN
    const maxAdminChatId = config.maxAdminChatId || process.env.MAX_ADMIN_CHAT_ID
    const maxApiBase = config.maxApiBase || process.env.MAX_API_BASE || 'https://platform-api.max.ru'

    if (!maxBotToken) {
      throw createError({
        statusCode: 500,
        message: 'MAX_BOT_TOKEN is not configured'
      })
    }

    if (!maxAdminChatId) {
      throw createError({
        statusCode: 500,
        message: 'MAX_ADMIN_CHAT_ID is not configured'
      })
    }

    const body = await readBody<MaxSendBody>(event)
    const { type, data } = body

    if (!type || !data) {
      throw createError({
        statusCode: 400,
        message: 'Form type and data are required'
      })
    }

    let message = ''

    if (type === 'cta') {
      message = formatCTAMessage(data)
    } else if (type === 'quiz') {
      message = formatQuizMessage(data)
    } else {
      throw createError({
        statusCode: 400,
        message: 'Unknown form type'
      })
    }

    const result = await sendToMax({
      message,
      botToken: maxBotToken,
      userId: String(maxAdminChatId),
      apiBase: maxApiBase
    })

    return {
      success: true,
      message: 'Data sent to MAX',
      data: result
    }
  } catch (error: any) {
    console.error('MAX send error:', error)

    return {
      success: false,
      message: error?.message || 'MAX send error'
    }
  }
})

function formatCTAMessage(data: Record<string, any>): string {
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return `
🔔 **НОВАЯ ЗАЯВКА С САЙТА**

📅 **Время:** ${timestamp}
📞 **Телефон:** ${data.phone || 'не указан'}

📊 **Источник:** Форма "Готовы обсудить проект?"

---
_Отправлено с сайта magic-iris.ru_
  `.trim()
}

function formatQuizMessage(data: Record<string, any>): string {
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return `
🎁 **НОВАЯ ЗАЯВКА С КВИЗА**

📅 **Дата и время:** ${timestamp}

👤 **Контактные данные:**
• **Имя:** ${data.name || 'не указано'}
• **Телефон:** ${data.phone || 'не указан'}
• **Связь:** ${data.contactMethod || 'не указан'}

📋 **Данные мероприятия:**
• **Подарок:** ${data.gift || 'не выбран'}
• **Тип мероприятия:** ${data.event || 'не указано'}${data.eventOther ? ` (${data.eventOther})` : ''}
• **Дата мероприятия:** ${data.date || 'не указана'}
• **Город:** ${data.city || 'не указан'}
• **Количество гостей:** ${data.guestsCount || 'не указано'}

✅ **Согласие на обработку ПД:** ${data.agree ? 'Да' : 'Нет'}

---
_Отправлено с сайта magic-iris.ru_
  `.trim()
}

async function sendToMax(params: {
  message: string
  botToken: string
  userId: string
  apiBase: string
}): Promise<any> {
  const url = `${params.apiBase}/messages?user_id=${encodeURIComponent(params.userId)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: params.botToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: params.message,
      format: 'markdown'
    })
  })

  const responseText = await response.text()

  if (!response.ok) {
    console.error('MAX API error response:', responseText)
    throw new Error(`MAX API error (${response.status}): ${responseText}`)
  }

  try {
    return JSON.parse(responseText)
  } catch {
    return { raw: responseText }
  }
}