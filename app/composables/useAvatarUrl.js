export const useAvatarUrl = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const url = useState('avatar-url', () => null)

  const loadAvatar = async () => {
    if (!user.value) {
      url.value = null
      return
    }

    try {
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
    } catch (e) {
      console.error(e)
      url.value = null
    }
  }

  const refresh = async () => {
    await loadAvatar()
  }

  if (!url.value && user.value) {
    loadAvatar()
  }

  return {
    url,
    refresh
  }
}