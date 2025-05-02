<template>
  <q-card class="q-pa-md no-box-shadow no-border-radius">
    <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model="name"
            label="Nome do Produto *"
            filled
            :rules="[(val) => !!val || 'Nome é obrigatório']"
            ref="nameRef"
          />
        </div>

        <div class="col-12 col-md-6">
          <q-input
            v-model="code"
            label="Código *"
            filled
            :rules="[(val) => !!val || 'Código é obrigatório']"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-input
            v-model.number="quantity"
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
            v-model.number="price"
            label="Valor *"
            type="number"
            filled
            prefix="R$"
            :rules="[
              (val) => (val !== null && val !== undefined) || 'Valor é obrigatório',
              (val) => val > 0 || 'Valor deve ser maior que 0',
            ]"
            @update:model-value="updatePrice"
          />
        </div>

        <div class="col-12 col-md-4">
          <q-select
            v-model="category"
            :options="categoryOptions"
            label="Categoria *"
            filled
            emit-value
            map-options
            :rules="[(val) => !!val || 'Categoria é obrigatória']"
          />
        </div>

        <!-- Informações adicionais -->
        <div class="col-12 col-md-6">
          <q-input v-model="brand" label="Marca" filled />
        </div>

        <div class="col-12 col-md-6">
          <q-input v-model="supplier" label="Fornecedor" filled />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="manufactureDate"
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

        <div class="col-12 col-md-6">
          <q-input v-model="expirationDate" label="Data de Validade" type="date" filled />
        </div>

        <div class="col-12">
          <q-input v-model="description" label="Descrição" type="textarea" filled autogrow />
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div class="row justify-end q-gutter-sm">
        <q-btn label="Limpar" type="reset" color="grey-7" flat icon="clear_all" />
        <q-btn label="Salvar" type="submit" color="primary" icon="save" :loading="saving" />
      </div>
    </q-form>
  </q-card>
</template>

<script setup>
import { addNewData } from '../../utils/product-storage'
import { ref, defineEmits } from 'vue'
import { Loading, Notify } from 'quasar'

const emit = defineEmits(['dataUpdated'])
const nameRef = ref(null)

const name = ref('')
const description = ref('')
const quantity = ref('')
const code = ref('')
const category = ref('')
const price = ref('')
const brand = ref('')
const supplier = ref('')
const expirationDate = ref('')
const manufactureDate = ref('')

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
      name: name.value,
      description: description.value,
      quantity: quantity.value,
      price: price.value,
      code: code.value,
      category: category.value,
      brand: brand.value,
      supplier: supplier.value,
      manufactureDate: manufactureDate.value,
      expirationDate: expirationDate.value,
    }
    addNewData('dataCompany', data)
    emit('dataUpdated')

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
  name.value = ''
  description.value = ''
  quantity.value = ''
  price.value = ''
  code.value = ''
  category.value = ''
  brand.value = ''
  supplier.value = ''
  expirationDate.value = ''
  manufactureDate.value = ''

  // Foca o primeiro campo após ocorrer o reset
  if (nameRef.value) {
    nameRef.value.focus()
  }
}
</script>

<style scoped></style>
