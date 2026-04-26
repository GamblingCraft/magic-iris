<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label: string
  folder: 'show' | 'master-classes' | 'gallery' | 'slider'
  placeholder?: string
  previewAlt?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const uploadError = ref('')

const openPicker = () => {
  fileInputRef.value?.click()
}

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  emit('update:modelValue', target?.value || '')
}

const uploadFile = async (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]

  if (!file) {
    return
  }

  isUploading.value = true
  uploadError.value = ''

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', props.folder)

    const response = await $fetch<{ path: string }>('/api/admin/upload', {
      method: 'POST',
      body: formData
    })

    emit('update:modelValue', response.path)
  }
  catch {
    uploadError.value = 'Не удалось загрузить файл'
  }
  finally {
    isUploading.value = false

    if (target) {
      target.value = ''
    }
  }
}
</script>

<template>
  <label class="admin-field">
    <span class="admin-label">{{ label }}</span>

    <div class="admin-upload-field">
      <input
        :value="modelValue"
        class="admin-input"
        type="text"
        :placeholder="placeholder || '/images/...'"
        @input="updateValue"
      >

      <button
        type="button"
        class="admin-button admin-button--sand admin-upload-field__button"
        :disabled="isUploading"
        @click="openPicker"
      >
        {{ isUploading ? 'Загрузка...' : 'Загрузить' }}
      </button>
    </div>

    <input
      ref="fileInputRef"
      class="admin-upload-field__native"
      type="file"
      accept="image/*"
      @change="uploadFile"
    >

    <span v-if="uploadError" class="admin-inline-note admin-inline-note--danger">{{ uploadError }}</span>

    <figure v-if="modelValue" class="admin-upload-preview">
      <img :src="modelValue" :alt="previewAlt || label">
    </figure>
  </label>
</template>
