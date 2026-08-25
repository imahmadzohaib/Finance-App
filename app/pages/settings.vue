<template>

    <div class="grid grid-cols-6 gap-8">
        <UNavigationMenu :items="links" orientation="vertical"class="col-span-2"  color="neutral"/>
        <div class="col-span-4">
            <NuxtPage />

        </div>

    </div>
</template>

<script setup>

const links =[
    {
        label:'Profile',
        to: '/settings/profile'
    },
       {
        label:'Avatar',
        to: '/settings/avatar'
    },
       {
        label:'Settings',
        to: '/settings/settings'
    },
    
]
</script>