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
import { clearData } from 'src/utils/product-storage'
import { showNotification } from 'src/utils/utils-functions'

const isDelete = ref(false)

const clearLoadData = () => {
  isDelete.value = true
  try {
    clearData('dataProducts')
    clearData('dataMoviments')

    showNotification('positive', 'Dados do Local Storage apagados com sucesso!')
  } catch (error) {
    showNotification(
      'negative',
      `Erro ao apagar os dados: ${typeof error === 'object' && error.message ? error.message : 'Erro desconhecido'}`,
    )
    isDelete.value = false
  }
  isDelete.value = false
}
</script>
