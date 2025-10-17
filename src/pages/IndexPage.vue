<template>
  <q-page class="flex flex-col items-center justify-center gap-6 p-6">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      class="h-40 w-40"
    >
    <div class="flex flex-wrap items-center justify-center gap-4">
      <UiButton>
        Acessar painel
      </UiButton>
      <UiButton variant="outline">
        Criar conta
      </UiButton>
    </div>
  </q-page>
</template>

<script setup>
import UiButton from 'components/ui/button/Button.vue'
</script>
