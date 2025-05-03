<template>
  <q-btn class="q-ma-xs" color="secondary" :disable="isDelete" size="xl" @click="clearLoadData">
    <div class="column items-center">
      <q-icon name="delete" />
      <div class="text-center text-caption">
        <span v-if="isDelete">Carregando...</span>
        <template v-else>
          <div>Apagar</div>
          <div>Local de</div>
          <div>Storage</div>
        </template>
      </div>
    </div>
  </q-btn>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { clearData } from 'src/utils/product-storage'

const isDelete = ref(false)

const clearLoadData = async () => {
  isDelete.value = true
  try {
    clearData('dataCompany')
    clearData('movements')

    Notify.create({
      type: 'positive',
      message: 'Dados do Local Storage apagados com sucesso!',
      timeout: 2000,
      position: 'top',
    })
  } catch (error) {
    Notify.create({
      type: 'negative',
      message: `Erro ao apagar os dados: ${error.message || error}`,
      timeout: 2000,
      position: 'top',
    })
  } finally {
    isDelete.value = false
  }
}
</script>
