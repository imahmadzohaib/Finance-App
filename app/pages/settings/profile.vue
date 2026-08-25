<template>
  <UForm :state="state" :schema="schema" @submit.prevent="saveProfile">
    <UFormField class="mb-4" label="Full Name" name="name">
      <UInput v-model="state.name" class="w-full"/>
    </UFormField>

    <UFormField class="mb-4" label="Email" name="email"
      help="You will receive a confirmation email on both the old and the new addresses if you modify the email address">
      <UInput v-model="state.email"  class="w-full"/>
    </UFormField>

    <UButton type="submit" color="neutral" variant="solid" label="Save" :loading="pending" :disabled="pending" />
  </UForm>
</template>

<script setup>
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { toastSuccess, toastError } = useAppToast()
const pending = ref(false)

const state = ref({
  name: user.value.user_metadata?.full_name,
  email: user.value.email
})

const schema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email()
})

const saveProfile = async () => {
  pending.value = true

  try {

    const payload = {
      data: {
        full_name: state.value.name
      }
    }

    if (state.value.email !== user.value.email) {
      payload.email = state.value.email
    }

    const { error } = await supabase.auth.updateUser(payload)
    if (error) throw error

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession()
    if (refreshError) throw refreshError

    if (refreshed?.user) {
      state.value.name = refreshed.user.user_metadata?.full_name
      state.value.email = refreshed.user.email
    }

    toastSuccess({
      title: 'Profile updated',
      description: 'Your profile has been updated'
    })
  } catch (error) {
    toastError({
      title: 'Error updating profile',
      description: error.message
    })
  } finally {
    pending.value = false
  }
}
</script>