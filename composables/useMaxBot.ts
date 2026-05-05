// composables/useMaxBot.ts
interface SendToMaxOptions {
  type: 'cta' | 'quiz'
  data: Record<string, any>
}

export const useMaxBot = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  const sendToMax = async (options: SendToMaxOptions) => {
    loading.value = true
    error.value = null
    
    try {
      // Автоматически определяем базовый URL
      const baseUrl = process.client ? window.location.origin : (process.env.PUBLIC_SITE_URL || 'https://magic-iris.ru')
      
      const response = await $fetch(`${baseUrl}/api/max-send`, {
        method: 'POST',
        body: options
      })
      
      return { success: true, data: response }
    } catch (err: any) {
      error.value = err.message || 'Ошибка отправки'
      console.error('❌ MaxBot error:', err)
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }
  
  return {
    sendToMax,
    loading,
    error
  }
}