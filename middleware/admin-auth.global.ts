export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/admin')) {
    return
  }

  const isLoginPage = to.path === '/admin/login'
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  const session = await $fetch<{ authenticated: boolean }>('/api/admin/auth/session', {
    headers
  }).catch(() => ({ authenticated: false }))

  if (!session.authenticated && !isLoginPage) {
    return navigateTo(`/admin/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }

  if (session.authenticated && isLoginPage) {
    return navigateTo('/admin')
  }
})
