<template>
  <q-layout view="hHh lpR fFf">
    <q-header reveal elevated class="bg-primary">
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
        <q-toolbar-title class="text-h6 text-weight-bold">
          CPID Frontend Test - DsBrito
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      behavior="desktop"
      :width="180"
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      class="bg-primary text-white"
    >
      <q-scroll-area class="fit">
        <q-list class="q-pa-sm">
          <q-item-label header class="text-white">Navigation Page</q-item-label>
          <Navigation v-for="link in navigationPages" :key="link.title" v-bind="link" />

          <q-item-label header class="text-white">About Me</q-item-label>
          <Navigation v-for="link in aboutMeList" :key="link.title" v-bind="link" />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-primary flex justify-center items-center no-padding no-margin">
      &copy; Dionatas Santos Brito, 2025 - Todos os direitos reservados.
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { ROUTE_NAMES } from 'src/router/routes'
import Navigation from '../components/home/NavigationState.vue'

const leftDrawerOpen = ref(false)
const miniState = ref(true)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Using Material Icons from "https://fonts.google.com/icons?icon.set=Material+Icons"
const aboutMeList = [
  {
    title: 'Github',
    icon: 'code',
    link: 'https://github.com/DsBrito',
  },
  {
    title: 'LinkedIn',
    icon: 'groups',
    link: 'https://www.linkedin.com/in/dionatas-brito-7a3000242/',
  },
  {
    title: 'Instagram',
    icon: 'photo_camera',
    link: 'https://www.instagram.com/dssbrito/',
  },
  {
    title: 'Código do Projeto',
    icon: 'source',
    link: 'https://github.com/DsBrito/cpid-frontend-test',
  },
]

const navigationPages = [
  {
    title: 'Home Page',
    icon: 'house',
    link: { name: ROUTE_NAMES.home },
  },
  {
    title: 'Product Page',
    icon: 'store',
    link: { name: ROUTE_NAMES.product },
  },
  {
    title: 'Movement Page',
    icon: 'sync_alt',
    link: { name: ROUTE_NAMES.movement },
  },
  {
    title: 'Dashboard Page',
    icon: 'analytics',
    link: { name: ROUTE_NAMES.dashboard },
  },
]
</script>

<style scoped></style>
