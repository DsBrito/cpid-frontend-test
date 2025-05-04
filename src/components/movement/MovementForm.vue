<template>
  <q-card class="q-pa-md no-box-shadow no-border-radius">
    <div class="text-h5 q-mb-md">Cadastro de Movimentação de Estoque</div>

    <q-form @submit.prevent="onSubmit" @reset="resetForm" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <!-- Seleção de Produto -->
        <div class="col-12 col-md-6">
          <q-select
            v-model="formData.product"
            :options="filteredProducts"
            label="Selecione o Produto *"
            option-label="name"
            filled
            use-input
            input-debounce="300"
            @filter="filterProducts"
            :rules="[(val) => !!val || 'Produto é obrigatório']"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section> Nenhum product encontrado </q-item-section>
              </q-item>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label caption>
                    Código: {{ scope.opt.code }} | Estoque atual: {{ scope.opt.amount }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template v-slot:selected>
              <div v-if="formData.product">
                {{ formData.product.name }} (Código: {{ formData.product.code }})
              </div>
            </template>
          </q-select>
        </div>

        <!-- Tipo de Movimentação -->
        <div class="col-12 col-md-6">
          <q-select
            v-model="formData.type"
            :options="['Entrada', 'Saída']"
            label="Tipo de Movimentação *"
            filled
            :rules="[(val) => !!val || 'Tipo de movimentação é obrigatório']"
          />
        </div>

        <!-- Motivo da Movimentação -->
        <div class="col-12 col-md-6">
          <q-select
            v-model="formData.reason"
            :options="reasonOptions"
            label="Motivo da Movimentação *"
            filled
            :rules="[(val) => !!val || 'Motivo é obrigatório']"
          />
        </div>

        <!-- Quantidade -->
        <div class="col-12 col-md-6">
          <q-input
            v-model.number="formData.amount"
            type="number"
            label="Quantidade *"
            filled
            :rules="[
              (val) => !!val || 'Quantidade é obrigatória',
              (val) => val > 0 || 'A quantidade deve ser maior que zero',
              (val) =>
                validateAmount(val) ||
                'Quantidade insuficiente em estoque. \n Estoque atual:' + productsCount,
            ]"
          />
        </div>

        <!-- Responsável -->
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.responsible"
            label="Responsável pela Movimentação *"
            filled
            :rules="[(val) => !!val || 'Responsável é obrigatório']"
            ref="responsibleRef"
          />
        </div>

        <!-- Data da Movimentação -->
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.date"
            type="date"
            label="Data da Movimentação *"
            filled
            disable
            :rules="[(val) => !!val || 'Data é obrigatória']"
          />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="row justify-end q-gutter-sm">
        <q-btn label="Limpar" type="reset" color="grey-7" flat icon="clear_all" />
        <q-btn label="Salvar" type="submit" color="primary" icon="save" />
      </div>
    </q-form>
  </q-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Loading } from 'quasar'
import { showNotification, getCurrentDate } from 'src/utils/utils-functions'
const emit = defineEmits(['dataUpdated'])
const responsibleRef = ref(null)
const productsCount = ref()
const formData = ref({
  id: null,
  product: null,
  type: null,
  reason: null,
  amount: null,
  date: getCurrentDate(),
  responsible: '',
  dateRegistration: null,
})

const products = ref([])
const filteredProducts = ref([])
const reasonsIn = ['Compra', 'Devolução']
const reasonsOut = ['Venda', 'Vencimento']

const reasonOptions = computed(() => {
  if (formData.value.type === 'Entrada') {
    return reasonsIn
  } else if (formData.value.type === 'Saída') {
    return reasonsOut
  }
  return []
})

const filterProducts = (val, update) => {
  const needle = val.toLowerCase()

  update(() => {
    if (val === '') {
      filteredProducts.value = products.value
    } else {
      filteredProducts.value = products.value.filter((p) => p.name.toLowerCase().includes(needle))
    }
  })
}

const loadProducts = () => {
  // Carrega os products do localStorage (da chave 'dataProducts' como usado no ProductForm)
  const productsArmazenados = localStorage.getItem('dataProducts')
  if (productsArmazenados) {
    products.value = JSON.parse(productsArmazenados)
    filteredProducts.value = products.value
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    product: null,
    type: null,
    reason: null,
    amount: null,
    date: getCurrentDate(),
    responsible: '',
    dateRegistration: null,
  }

  // Foca o primeiro campo após ocorrer o reset
  if (responsibleRef.value) {
    responsibleRef.value.focus()
  }
}

const validateAmount = (amount) => {
  // Valida se há estoque suficiente para saída
  if (formData.value.type === 'Saída' && formData.value.product) {
    productsCount.value = formData.value.product.amount || 0
    console.log('Quantidade do product:', productsCount.value)
    if (amount > productsCount.value) {
      return false
    }
  }
  return true
}

const onSubmit = () => {
  try {
    const movement = {
      id: Date.now(),
      productId: formData.value.product.id,
      productCode: formData.value.product.code,
      productName: formData.value.product.name,
      type: formData.value.type,
      reason: formData.value.reason,
      amount: formData.value.amount,
      date: formData.value.date,
      responsible: formData.value.responsible,
      dateRegistration: new Date().toISOString(),
    }

    // Busca movimentações existentes ou inicia array vazio
    const movementsStored = localStorage.getItem('dataMoviments')
    let movements = []

    if (movementsStored) {
      movements = JSON.parse(movementsStored)
    }

    // Adiciona a nova movimentação
    movements.push(movement)

    // Salva no localStorage
    localStorage.setItem('dataMoviments', JSON.stringify(movements))

    // Atualiza o estoque do product
    updateStockProduct(movement)
    showNotification('positive', 'Movimentação registrada com sucesso!')

    emit('dataUpdated')
    resetForm()
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error)
    showNotification('negative', 'Erro ao registrar movimentação')
  } finally {
    Loading.hide()
  }
}

const updateStockProduct = (movement) => {
  // Atualiza o estoque do product com base no type de movimentação
  const productsCopy = [...products.value]
  const productIndex = productsCopy.findIndex((p) => p.id === movement.productId)
  if (productIndex !== -1) {
    if (movement.type === 'Entrada') {
      productsCopy[productIndex].amount += movement.amount
    } else {
      productsCopy[productIndex].amount -= movement.amount
    }

    // Atualiza o localStorage de products (a amount em estoque)
    localStorage.setItem('dataProducts', JSON.stringify(productsCopy))

    // Atualiza a lista de products atual
    products.value = productsCopy
  }
}
onMounted(() => {
  loadProducts()
  resetForm()
})
</script>

<style scoped></style>
