<template>
  <q-page padding class="product-page">
    <div class="row q-gutter-xl items-start justify-center">
      <div style="width: 300px">
        <img alt="DsBrito-logo" src="~assets/img/cpid-dsbrito-logo.png" style="width: 100%" />
        <div class="text-subtitle2 q-mb-sm">Verifique aqui os produtos cadastrados:</div>

        <q-btn
          label="Tabela de Produtos Cadastrados"
          color="primary"
          @click="dialogVisible = true"
          class="bg-secondary full-width"
        />
      </div>

      <!-- Formulário de Cadastro-->
      <div style="flex: 1">
        <ProductForm @data-updated="updateTableData" />
      </div>
    </div>

    <!-- Diálogo com tabela dos produtos cadastrados -->
    <q-dialog v-model="dialogVisible" full-width>
      <q-card style="max-width: 900px; width: 100%">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Produtos Cadastrados</div>
          <q-btn flat icon="close" round dense @click="dialogVisible = false" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <TableComponent :rows="rows" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import ProductForm from '../components/product/ProductForm.vue'
import TableComponent from '../components/product/ProductTable.vue'
import { getLocalStorage } from '../utils/product-storage'
import { ref } from 'vue'

const rows = ref(getLocalStorage('dataProducts'))
const dialogVisible = ref(false)

const updateTableData = () => {
  rows.value = getLocalStorage('dataProducts')
}
</script>

<style setup></style>
