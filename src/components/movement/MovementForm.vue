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
            @update:model-value="resetMotivo"
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
import { Loading, Notify } from 'quasar'

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
const reasonsOut = ['Venda', 'Vencimento', 'Perda']

const reasonOptions = computed(() => {
  if (formData.value.type === 'Entrada') {
    return reasonsIn
  } else if (formData.value.type === 'Saída') {
    return reasonsOut
  }
  return []
})

function filterProducts(val, update) {
  const needle = val.toLowerCase()

  update(() => {
    if (val === '') {
      filteredProducts.value = products.value
    } else {
      filteredProducts.value = products.value.filter((p) => p.name.toLowerCase().includes(needle))
    }
  })
}

// Functions
function loadProducts() {
  // Carrega os products do localStorage (da chave 'dataCompany' como usado no ProductForm)
  const productsArmazenados = localStorage.getItem('dataCompany')
  if (productsArmazenados) {
    products.value = JSON.parse(productsArmazenados)
    filteredProducts.value = products.value
  }
}

function getCurrentDate() {
  // Retorna a data atual no formato YYYY-MM-DD para o input de data
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function resetMotivo() {
  // Reseta o reason quando o type de movimentação muda
  formData.value.reason = null
}

function resetForm() {
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

function validateAmount(amount) {
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

function onSubmit() {
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
    const movementsStored = localStorage.getItem('movements')
    let movements = []

    if (movementsStored) {
      movements = JSON.parse(movementsStored)
    }

    // Adiciona a nova movimentação
    movements.push(movement)

    // Salva no localStorage
    localStorage.setItem('movements', JSON.stringify(movements))

    // Atualiza o estoque do product
    updateStockProduct(movement)

    Notify.create({
      color: 'positive',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Movimentação registrada com sucesso!',
      position: 'top',
      timeout: 2000,
    })

    emit('dataUpdated')
    resetForm()
  } catch (error) {
    Notify.create({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: `Erro ao registrar movimentação: ${error.message}`,
      position: 'top',
    })
  } finally {
    Loading.hide()
  }
}

function updateStockProduct(movement) {
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
    localStorage.setItem('dataCompany', JSON.stringify(productsCopy))

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
