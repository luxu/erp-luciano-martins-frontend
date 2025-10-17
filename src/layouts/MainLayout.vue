<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          ERP Luciano Martins - Developer
        </q-toolbar-title>

        <q-btn-toggle
          v-model="isDark"
          class="q-ml-md"
          dense
          toggle-color="primary"
          color="grey-8"
          rounded
          :options="[
            { label: 'Normal', value: false, icon: 'wb_sunny' },
            { label: 'Dark', value: true, icon: 'dark_mode' }
          ]"
          aria-label="Alternar entre os temas claro e escuro"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Menu
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />

        <q-item
          clickable
          @click="handleLogout"
        >
          <q-item-section
            avatar
          >
            <q-icon name="exit_to_app" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import useAuthUser from '../composables/UseAuthUser'
import useNotify from '../composables/UseNotify'
import { LocalStorage, useQuasar } from 'quasar'

const linksList = [
  {
    title: 'Gastos',
    caption: '',
    icon: 'mdi-bell-sleep',
    routeName: 'gastos',
  },
  {
    title: 'Parcelas',
    caption: '',
    icon: 'mdi-bell-sleep',
    routeName: 'parcelas',
  },
  {
    title: 'Segmentos',
    caption: '',
    icon: 'mdi-bell-sleep',
    routeName: 'segmentos',
  },
  {
    title: 'CardBank',
    caption: '',
    icon: 'mdi-bell-sleep',
    routeName: 'cardbanks',
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const leftDrawerOpen = ref(false)
    const router = useRouter()
    const { logout } = useAuthUser()
    const { notifySuccess } = useNotify()
    const $q = useQuasar()
    const storedPreference = LocalStorage.getItem('dark_mode')
    const isDark = ref(
      storedPreference === null
        ? $q.dark.isActive
        : typeof storedPreference === 'boolean'
          ? storedPreference
          : storedPreference === 'true'
    )

    $q.dark.set(isDark.value)

    watch(isDark, (value) => {
      $q.dark.set(value)
      LocalStorage.set('dark_mode', value)
    })

    const handleLogout = () => {
      logout()
      notifySuccess('Logout realizado com sucesso.')
      router.push('/login')
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      isDark,
      handleLogout,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
