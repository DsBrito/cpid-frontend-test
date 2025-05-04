<template>
  <q-card class="q-pa-md no-box-shadow no-border-radius">
    <div class="text-h5 q-mb-md">Cadastro de Produtos no Estoque</div>
    <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row q-col-gutter-sm">
        <!-- Nome do Produto -->
        <div class="col-12">
          <q-input
            v-model="formData.name"
            label="Nome do Produto *"
            filled
            :rules="[(val) => !!val || 'Nome é obrigatório']"
            ref="nameRef"
          />
        </div>

        <!-- Código do Produto -->
        <div class="col-12 col-md-4">
          <q-input v-model="formData.code" label="Código " filled disable readonly />
        </div>

        <!-- Quantidade do Produto -->
        <div class="col-12 col-md-4">
          <q-input
            v-model.number="formData.amount"
            label="Quantidade *"
            type="number"
            filled
            :rules="[
              (val) => (val !== null && val !== undefined) || 'Quantidade é obrigatória',
              (val) => val >= 1 || 'Quantidade deve ser maior ou igual a 1',
            ]"
          />
        </div>

        <!-- Preço do Produto -->
        <div class="col-12 col-md-4">
          <q-input
            v-model.number="formData.price"
            label="Preço *"
            type="number"
            filled
            prefix="R$"
            :rules="[
              (val) => (val !== null && val !== undefined) || 'Valor é obrigatório',
              (val) => val > 0 || 'Valor deve ser maior que 0',
            ]"
          />
        </div>

        <!-- Categoria do Produto -->
        <div class="col-12 col-md-4">
          <q-select
            v-model="formData.category"
            :options="categoryOptions"
            label="Categoria *"
            filled
            emit-value
            map-options
            :rules="[(val) => !!val || 'Categoria é obrigatória']"
          />
        </div>

        <!-- Marca do Produto -->
        <div class="col-12 col-md-4">
          <q-input v-model="formData.brand" label="Marca" filled />
        </div>

        <!-- Fornecedor do Produto -->
        <div class="col-12 col-md-4">
          <q-input v-model="formData.supplier" label="Fornecedor" filled />
        </div>

        <!-- Data de Corrente -->
        <div class="col-12 col-md-4">
          <q-input
            v-model="formData.currentDate"
            type="date"
            label="Data do Cadastro"
            filled
            disable
            readonly
          />
        </div>

        <!-- Data de Fabricação -->
        <div class="col-12 col-md-4">
          <q-input
            v-model="formData.manufactureDate"
            label="Data de Fabricação"
            type="date"
            filled
            :rules="[
              (val) =>
                !val ||
                !expirationDate ||
                new Date(val) < new Date(expirationDate) ||
                'Data de fabricação deve ser anterior à data de validade',
            ]"
          />
        </div>

        <!-- Data de Validade -->
        <div class="col-12 col-md-4">
          <q-input v-model="formData.expirationDate" label="Data de Validade" type="date" filled />
        </div>

        <!-- Descrição do Produto -->
        <div class="col-12">
          <q-input
            v-model="formData.description"
            label="Descrição"
            type="textarea"
            filled
            autogrow
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
import { addNewData } from '../../utils/product-storage'
import { ref } from 'vue'
import { Loading, QSpinnerGears } from 'quasar'
import { showNotification, getCurrentDate } from 'src/utils/utils-functions'

const emit = defineEmits(['dataUpdated'])
const nameRef = ref(null)

const formData = ref({
  name: '',
  description: '',
  amount: '',
  code: Date.now(),
  category: '',
  price: '',
  brand: '',
  supplier: '',
  expirationDate: '',
  manufactureDate: '',
  currentDate: getCurrentDate(),
})
// Opções para o select de categorias
const categoryOptions = [
  { label: 'Eletrônicos', value: 'electronics' },
  { label: 'Alimentos', value: 'food' },
  { label: 'Vestuário', value: 'clothing' },
  { label: 'Móveis', value: 'furniture' },
  { label: 'Outros', value: 'others' },
]

const onSubmit = () => {
  try {
    const data = {
      name: formData.value.name,
      description: formData.value.description,
      amount: formData.value.amount,
      price: formData.value.price,
      code: formData.value.code,
      category: formData.value.category,
      brand: formData.value.brand,
      supplier: formData.value.supplier,
      manufactureDate: formData.value.manufactureDate,
      expirationDate: formData.value.expirationDate,
      currentDate: formData.value.currentDate,
    }
    addNewData('dataProducts', data)
    emit('dataUpdated')
    Loading.show({
      message: 'Cadastrando produto...',
      spinner: QSpinnerGears,
      spinnerColor: 'white',
    })

    showNotification('positive', 'Produto cadastrado com sucesso!')

    onReset()
  } catch (error) {
    console.log('Erro ao cadastrar produto:', error)
    showNotification('negative', 'Erro ao cadastrar produto!')
  } finally {
    Loading.hide()
  }
}

const onReset = () => {
  formData.value = {
    name: '',
    description: '',
    amount: '',
    price: '',
    code: Date.now(),
    category: '',
    brand: '',
    supplier: '',
    expirationDate: '',
    manufactureDate: '',
    currentDate: getCurrentDate(),
  }

  // Foca o primeiro campo após ocorrer o reset
  if (nameRef.value) {
    nameRef.value.focus()
  }
}
</script>

<style scoped></style>
