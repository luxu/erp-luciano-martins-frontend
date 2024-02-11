<template>
  <q-page class="row items-center justify-evenly">
    <h1>Gastos Pessoais</h1>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GastosPage',
  components: { },
  setup () {
    const todos = ref()
    const meta = ref()
    return { }
  }
})
</script>
