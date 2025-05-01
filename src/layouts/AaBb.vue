<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-black text-white">
      <q-toolbar class="q-px-md">
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="toggleLeftDrawer"
          aria-label="Menu"
          class="q-mr-sm"
        />
        <q-toolbar-title class="text-h6 text-weight-bold"> CPID Frontend Test </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      behavior="desktop"
      :width="200"
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      class="bg-black text-white"
    >
      <q-scroll-area class="fit">
        <q-list class="q-pa-sm">
          <q-item-label header>About Me</q-item-label>
          <Navigation v-for="link in aboutMeList" :key="link.title" v-bind="link" />

          <q-item-label header>Navigation Page</q-item-label>
          <Navigation v-for="link in navigationPages" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="no-padding no-margin">
      <router-view />
    </q-page-container>

    <q-footer class="bg-black flex justify-center items-center no-padding no-margin">
      &copy; Dionatas Santos Brito, 2025 - Todos os direitos reservados.
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { ROTAS } from 'src/router/routes'
import Navigation from '../components/home/NavigationState.vue'

const leftDrawerOpen = ref(false)
const miniState = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Links externos
const aboutMeList = [
  {
    title: 'Github',
    caption: 'github.com/DsBrito',
    icon: 'code',
    link: 'https://github.com/DsBrito',
  },
  {
    title: 'LinkedIn',
    caption: '@saty9136',
    icon: 'linkedin',
    link: 'https://www.linkedin.com/in/saty9136/',
  },
  {
    title: 'Instagram',
    caption: '@saty9136',
    icon: 'center_focus_strong',
    link: 'https://instagram.com/saty9136',
  },
  {
    title: 'Gmail',
    caption: 'saty9136@gmail.com',
    icon: 'attach_email',
    link: 'mailto:saty9136@gmail.com',
  },
]

// Navegação interna por objeto de rota (corrigido)
const navigationPages = [
  {
    title: 'Home',
    caption: 'Home Page',
    icon: 'house',
    link: { name: ROTAS.home.name }, // objeto de rota, como o Vue Router espera
  },
]
</script>

<style scoped></style>
