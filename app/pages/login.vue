<template>
    <UCard v-if="!success">
        <template #header>
            Sign-in to Finance Tracker
        </template>

        <form @submit.prevent="handleLogin">
            <UFormField label="Email" name="email" class="mb-4" :required="true" help="You will receive an email with the confirmation link">
                <UInput type="email" placeholder="Email" required v-model="email"/>
            </UFormField>
            <UButton type="submit" variant="solid" color="neutral" :loading="pending" :disabled="pending" >Sign-in</UButton>
        </form>
    </UCard>

    <UCard v-else>
        <template #header>
            Email has been sent
        </template>

        <div class="text-center">
            <p class="mb-4">We have sent an email to <strong>{{ email }}</strong> with a link to sign-in</p>
            <p>
                <strong>Important: </strong> The link will expire in 5 minutes
            </p>
        </div>
    </UCard>
</template>

<script setup >
const success= ref(false);
const email = ref('');
const pending = ref(false)
const { toastError } = useAppToast();
const supabase = useSupabaseClient();
const redirectUrl = useRuntimeConfig().public.baseUrl
useIsUserLoggedIn()

const handleLogin = async ()=>{
    pending.value=true;

    try{
        const {error} = await supabase.auth.signInWithOtp({
            email:email.value,
            options:{
<<<<<<< HEAD
                emailRedirectTo: 'https://finance-app-alpha-flax.vercel.app/confirm'
=======
                emailRedirectTo: `$${redirectUrl}/confirm`
>>>>>>> 1d59eff (data changed)
            }
        })
        if(error){
            toastError({
                title:'Error authentication',
                description:error.message
            })
        }else{
            success.value = true;
        }
    } finally{
        pending.value= false
    }
}
</script>  
