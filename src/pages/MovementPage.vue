<template>
  <q-page padding class="product-page">
    <div class="row q-gutter-xl items-start justify-center">
      <div style="width: 300px">
        <img alt="DsBrito-logo" src="~assets/img/cpid-dsbrito-logo.png" style="width: 100%" />
        <div class="text-subtitle2 q-mb-sm">Verifique aqui o histórico de movimentações:</div>

        <q-btn
          label="Registro de Movimentações"
          color="primary"
          @click="dialogVisible = true"
          class="bg-secondary full-width"
        />
      </div>

      <!-- Formulário de Cadastro-->
      <div style="flex: 1">
        <MovementForm @data-updated="updateTableData" />
      </div>
    </div>

    <!-- Diálogo com tabela dos produtos cadastrados -->
    <q-dialog v-model="dialogVisible" full-width>
      <q-card style="max-width: 900px; width: 100%">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Histórico de Movimentações</div>
          <q-btn flat icon="close" round dense @click="dialogVisible = false" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <MovementTable :rows="rows" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import MovementForm from '../components/movement/MovementForm.vue'
import MovementTable from '../components/movement/MovementTable.vue'
import { getLocalStorage } from '../utils/product-storage'
import { ref } from 'vue'

const rows = ref(getLocalStorage('dataCompany'))
const dialogVisible = ref(false)

const updateTableData = () => {
  rows.value = getLocalStorage('dataCompany')
}
</script>

<style setup></style>
