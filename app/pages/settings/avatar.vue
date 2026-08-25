<template>
  <div>
    <div class="mb-4">
      <UFormField label="Current avatar" class="w-full" help="This would be blank by default">
        <UAvatar :src="url" size="3xl" />
      </UFormField>
    </div>

    <div class="mb-4">
      <UFormField label="New avatar" class="w-full" name="avatar"
        help="After choosing an image click Save to actually upload the new avatar">
        <UInput type="file" ref="fileInput"  @change="handleFile"/>
      </UFormField>
    </div>

    <UButton type="submit" color="neutral" variant="solid" label="Save" :loading="uploading"
      @click="saveAvatar" />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const { data: userData} = await supabase.auth.getUser()


const {url,refresh } = useAvatarUrl()

const { toastSuccess, toastError } = useAppToast();
const selectedFile = ref(null)

const handleFile = (event) => {
  selectedFile.value = event.target.files?.[0] || null
}

const fileInput = ref('');
const uploading = ref(false)

const saveAvatar = async () => {
  if (!selectedFile.value) {
    toastError({
      title: 'Select a file to upload first'
    })
    return
  }

  try {
    uploading.value = true

    // Get the latest user
    const { data: currentUser, error: userError } =
      await supabase.auth.getUser()

    if (userError) throw userError

    const currentAvatarUrl =
      currentUser.user?.user_metadata?.avatar_url

    const file = selectedFile.value
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`

    // Upload new avatar
    const { error: uploadError } =
      await supabase.storage
        .from('avatars')
        .upload(fileName, file)

    if (uploadError) throw uploadError

    // Update metadata
    const { error: updateError } =
      await supabase.auth.updateUser({
        data: {
          avatar_url: fileName
        }
      })

    if (updateError) throw updateError

    // Delete previous avatar
    if (currentAvatarUrl) {
      const { error: deleteError } =
        await supabase.storage
          .from('avatars')
          .remove([currentAvatarUrl])

      if (deleteError) throw deleteError
    }

    await refresh()

    toastSuccess({
      title: 'Avatar uploaded'
    })

    selectedFile.value = null
  } catch (error) {
    toastError({
      title: 'Error uploading avatar',
      description: error.message
    })
  } finally {
    uploading.value = false
  }
}
</script>