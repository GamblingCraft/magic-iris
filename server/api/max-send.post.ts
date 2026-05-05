// server/api/max-send.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

// Конфигурация (лучше вынести в .env)
const MAX_BOT_TOKEN = 'f9LHodD0cOIIZTBj1J8TZ_Hwp9IELMmvTuRCzovD1orL2uIk839ufRVNix_DE1hz_sUaU-bkj82Xng3Z86S_'
const ADMIN_USER_ID = 61294555
const MAX_API_BASE = 'https://platform-api.max.ru'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { type, data } = body

    // Формируем сообщение в зависимости от типа формы
    let message = ''
    
    if (type === 'cta') {
      message = formatCTAMessage(data)
    } else if (type === 'quiz') {
      message = formatQuizMessage(data)
    } else {
      throw createError({ statusCode: 400, message: 'Unknown form type' })
    }

    // Отправляем в MAX через user_id
    const result = await sendToMax(message)
    
    return { success: true, message: 'Data sent to MAX', data: result }
  } catch (error: any) {
    console.error('MAX send error:', error)
    return { success: false, message: error.message }
  }
})

// Форматирование CTA формы
function formatCTAMessage(data: any): string {
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
  `
}

// Форматирование Quiz формы
function formatQuizMessage(data: any): string {
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
  `
}

// Отправка сообщения в MAX через user_id
async function sendToMax(message: string): Promise<any> {
  const url = `${MAX_API_BASE}/messages?user_id=${ADMIN_USER_ID}`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': MAX_BOT_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text: message,
      format: 'markdown'  // Поддерживает жирный текст, списки и т.д.
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