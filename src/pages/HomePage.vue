<template>
  <q-page class="home-page">
    <!-- Componente de carregar dados de demonstração -->
    <div class="load-container">
      <LoadLocalStorage />

      <DeleteLocalStorage />
    </div>
    <div class="column items-center">
      <!-- Botões de navegação -->
      <div class="column q-gutter-md justify-center" style="max-width: 400px; width: 100%">
        <q-btn
          class="full-width"
          label="Inserir Produtos"
          rounded
          color="secondary"
          size="lg"
          @click="goToProductPage"
        />
        <q-btn
          class="full-width"
          label="Informações de Entrada e Saída de Produtos"
          rounded
          color="secondary"
          size="lg"
          @click="goToMovementPage"
        />
        <q-btn
          class="full-width"
          label="Dashboards de Estoque"
          rounded
          color="secondary"
          size="lg"
          @click="goToDashboardPage"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ROUTE_NAMES } from 'src/router/routes'
import { useRouter } from 'vue-router'
import LoadLocalStorage from '../components/home/loadLocalStorage.vue'
import DeleteLocalStorage from '../components/home/deleteLocalStorage.vue'

const router = useRouter()

const goToProductPage = () => {
  router.push({ name: ROUTE_NAMES.product })
}

const goToMovementPage = () => {
  router.push({ name: ROUTE_NAMES.movement })
}

const goToDashboardPage = () => {
  router.push({ name: ROUTE_NAMES.dashboard })
}
</script>

<style scoped>
.home-page {
  background-image: url('../assets/img/bg-home-page.png');
  background-color: #121212;
  position: relative;
  overflow: hidden;
  color: #ffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-size: cover;
}
.load-container {
  position: absolute;
  bottom: 20px;
  left: 20px;
}
</style>
