<template>
  <q-page class="home-page">
    <div class="column items-center">
      <!-- <img
        alt="Quasar logo"
        src="~assets/img/cpid-dsbrito-logo.png"
        style="width: 300px; height: 300px"
      /> -->

      <!-- Button -->
      <div class="column q-gutter-md justify-center">
        <q-btn
          class="full-width"
          label="Inserir Produtos"
          rounded
          color="primary"
          size="lg"
          to="{ name: 'home' }"
        />
        <q-btn
          class="full-width"
          label="Informações de Entrada e Saída de Produtos"
          rounded
          color="primary"
          size="lg"
          to="{ name: 'home' }"
        />
        <q-btn
          class="full-width"
          label="Dashboards de Estoque"
          rounded
          color="primary"
          size="lg"
          to="{ name: 'home' }"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
//
</script>
<style scoped>
.home-page {
  background-image: url('../assets/img/bg-home-page.png');
  background-color: #121212;
  position: relative;
  overflow: hidden;
  color: #ffff;
  font-family: 'Georgia', serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-position: center;
  background-size: cover;
}
</style>
