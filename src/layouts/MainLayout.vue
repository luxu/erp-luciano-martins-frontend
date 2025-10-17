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

        <div>Quasar v{{ $q.version }}</div>
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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import EssentialLink from 'components/EssentialLink.vue'
import useAuthUser from '../composables/UseAuthUser'
import useNotify from '../composables/UseNotify'

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

    const handleLogout = () => {
      logout()
      notifySuccess('Logout realizado com sucesso.')
      router.push('/login')
    }

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      handleLogout,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>
