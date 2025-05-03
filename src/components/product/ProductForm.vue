<template>
  <q-card class="q-pa-md no-box-shadow no-border-radius">
    <div class="text-h5 q-mb-md">Cadastro de Produtos no Estoque</div>
    <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row q-col-gutter-sm">
        <div class="col-12">
          <q-input
            v-model="formData.name"
            label="Nome do Produto *"
            filled
            :rules="[(val) => !!val || 'Nome é obrigatório']"
            ref="nameRef"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-input v-model="formData.code" label="Código " filled disable readonly />
        </div>

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

        <div class="col-12 col-md-4">
          <q-input
            v-model.number="formData.price"
            label="Valor *"
            type="number"
            filled
            prefix="R$"
            :rules="[
              (val) => (val !== null && val !== undefined) || 'Valor é obrigatório',
              (val) => val > 0 || 'Valor deve ser maior que 0',
            ]"
          />
        </div>

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
        <div class="col-12 col-md-4">
          <q-input v-model="formData.brand" label="Marca" filled />
        </div>

        <div class="col-12 col-md-4">
          <q-input v-model="formData.supplier" label="Fornecedor" filled />
        </div>
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

        <div class="col-12 col-md-4">
          <q-input v-model="formData.expirationDate" label="Data de Validade" type="date" filled />
        </div>

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
import { Loading, Notify, QSpinnerGears } from 'quasar'

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
    addNewData('dataCompany', data)
    emit('dataUpdated')
    Loading.show({
      message: 'Cadastrando produto...',
      spinner: QSpinnerGears,
      spinnerColor: 'white',
    })
    // Mostra mensagem de sucesso
    Notify.create({
      color: 'positive',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Produto cadastrado com sucesso!',
      position: 'top',
      timeout: 2000,
    })

    onReset()
  } catch (error) {
    Notify.create({
      color: 'negative',
      textColor: 'white',
      icon: 'error',
      message: `Erro ao cadastrar produto: ${error.message}`,
      position: 'top',
    })
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

function getCurrentDate() {
  // Retorna a data atual no formato YYYY-MM-DD para o input de data
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>

<style scoped></style>
