<script setup lang="ts">
definePageMeta({
  layout: false
})

const route = useRoute()
const login = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const redirectTarget = computed(() => {
  const rawTarget = String(route.query.redirect || '/admin')
  return rawTarget.startsWith('/admin') ? rawTarget : '/admin'
})

const submit = async () => {
  if (loading.value) {
    return
  }

  errorMessage.value = ''
  loading.value = true

  try {
    await $fetch('/api/admin/auth/login', {
      method: 'POST',
      body: {
        login: login.value,
        password: password.value
      }
    })

    await navigateTo(redirectTarget.value)
  }
  catch (error) {
    errorMessage.value =
      (error as { data?: { statusMessage?: string }; statusMessage?: string })?.data?.statusMessage ||
      (error as { statusMessage?: string })?.statusMessage ||
      'Не удалось войти'
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin-login">
    <div class="admin-login__card">
      <p class="admin-login__eyebrow">Magic Iris Admin</p>
      <h1 class="admin-login__title">Вход в админку</h1>
      <p class="admin-login__lead">Введите логин и пароль из файла <code>.env</code>.</p>

      <form class="admin-login__form" @submit.prevent="submit">
        <label class="admin-field">
          <span>Логин</span>
          <input v-model="login" type="text" autocomplete="username">
        </label>

        <label class="admin-field">
          <span>Пароль</span>
          <input v-model="password" type="password" autocomplete="current-password">
        </label>

        <p v-if="errorMessage" class="admin-login__error">{{ errorMessage }}</p>

        <button type="submit" class="admin-button admin-button--primary" :disabled="loading">
          {{ loading ? 'Входим...' : 'Войти' }}
        </button>
      </form>
    </div>
  </div>
</template>
