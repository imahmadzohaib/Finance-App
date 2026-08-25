export const useAvatarUrl = () => {
  const supabase = useSupabaseClient()

  // Shared across components/pages
  const url = useState('avatar-url', () => null)

  const loadAvatar = async () => {
    const { data: userData, error } = await supabase.auth.getUser()

    if (error) {
      console.error(error)
      return
    }

    const avatar = userData.user?.user_metadata?.avatar_url

    if (!avatar) {
      url.value = null
      return
    }

    const { data: storageData } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatar)

    url.value = storageData.publicUrl
  }

  const refresh = async () => {
    await loadAvatar()
  }

  // Only load if we don't already have a URL
  if (!url.value) {
    loadAvatar()
  }

  return {
    url,
    refresh
  }
}