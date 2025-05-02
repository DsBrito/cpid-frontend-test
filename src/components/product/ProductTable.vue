<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <q-input v-model="filter" dense placeholder="Buscar..." class="q-ml-md" style="width: 200px">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select
        v-model="visibleColumnNames"
        multiple
        :options="columnOptions"
        label="Colunas Visíveis"
        style="min-width: 200px"
        dense
        options-dense
        emit-value
        map-options
        :display-value="visibleColumnNames.length ? 'Colunas selecionadas' : ''"
      />
    </div>

    <q-table
      :rows="rowsData"
      :columns="visibleColumns"
      row-key="id"
      :filter="filter"
      v-model:pagination="pagination"
      :loading="loading"
      :bordered="true"
      :dense="true"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in visibleColumns" :key="col.name" :props="props">
            <div v-if="col.name !== 'id'" title="Clique para editar">
              <template v-if="col.name === 'price' || col.name === 'value'">
                R$ {{ Number(props.row[col.field]).toFixed(2) }}
              </template>
              <template v-else-if="isDateField(col.name)">
                {{ formatDate(props.row[col.field]) }}
              </template>
              <template v-else-if="col.name === 'category'">
                {{ getCategoryLabel(props.row[col.field]) }}
              </template>
              <template v-else>
                {{ props.row[col.field] }}
              </template>
              <q-popup-edit v-model="props.row[col.field]" v-slot="scope">
                <q-input
                  v-model="scope.value"
                  dense
                  autofocus
                  counter
                  @keyup.enter="editar(props.row.id, col.field, scope.value, scope)"
                />
              </q-popup-edit>
            </div>
            <div v-else>
              {{ props.row[col.field] }}
            </div>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:no-data="{ icon, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span> Bem, isso é triste... Não há dados disponíveis </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>

      <template v-slot:bottom>
        <div class="row items-center justify-between full-width">
          <div>Total de produtos: {{ rowsData.length }}</div>
          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(filteredRowsCount / pagination.rowsPerPage)"
            :direction-links="true"
            :boundary-links="true"
            color="primary"
            size="sm"
            v-if="rowsData.length > pagination.rowsPerPage"
          />
          <q-select
            v-model="pagination.rowsPerPage"
            :options="[5, 10, 20, 50, 100]"
            label="Por página"
            dense
            options-dense
            emit-value
            map-options
            style="min-width: 120px"
          />
        </div>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { ref, defineProps, watch, computed } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
})

const loading = ref(false)
const filter = ref('')
const pagination = ref({
  sortBy: 'name',
  descending: false,
  page: 1,
  rowsPerPage: 10,
})

const filteredRowsCount = computed(() => {
  if (!filter.value) {
    return rowsData.value.length
  }
  return rowsData.value.filter((row) => {
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(filter.value.toLowerCase()),
    )
  }).length
})

const dataModel = {
  id: '',
  name: '',
  description: '',
  quantity: 0,
  price: 0,
  code: '',
  category: '',
  brand: '',
  supplier: '',
  expirationDate: '',
  manufactureDate: '',
}

const fieldLabels = {
  id: 'ID',
  name: 'Nome',
  description: 'Descrição',
  quantity: 'Quantidade',
  price: 'Preço',
  value: 'Valor',
  code: 'Código',
  category: 'Categoria',
  brand: 'Marca',
  supplier: 'Fornecedor',
  expirationDate: 'Validade',
  manufactureDate: 'Fabricação',
}

const allColumns = Object.keys(dataModel).map((key) => ({
  name: key,
  label: fieldLabels[key] || key,
  align: 'left',
  field: key,
  sortable: true,
}))

const columnOptions = allColumns.map((col) => ({
  label: col.label,
  value: col.name,
}))

const visibleColumnNames = ref(allColumns.map((col) => col.name))

const visibleColumns = computed(() =>
  allColumns.filter((col) => visibleColumnNames.value.includes(col.name)),
)

const rowsData = ref([])

watch(
  () => props.rows,
  (newVal) => {
    loading.value = true
    rowsData.value = newVal
    setTimeout(() => {
      loading.value = false
    }, 200)
  },
  { immediate: true },
)

const isDateField = (fieldName) => {
  return fieldName === 'manufactureDate' || fieldName === 'expirationDate'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  } catch {
    return dateString
  }
}

const categoryOptions = [
  { label: 'Eletrônicos', value: 'electronics' },
  { label: 'Alimentos', value: 'food' },
  { label: 'Vestuário', value: 'clothing' },
  { label: 'Móveis', value: 'furniture' },
  { label: 'Outros', value: 'others' },
]

const getCategoryLabel = (value) => {
  const category = categoryOptions.find((cat) => cat.value === value)
  return category ? category.label : value
}

const editar = (id, field, value, scope) => {
  const index = rowsData.value.findIndex((row) => row.id === id)
  if (index !== -1) {
    rowsData.value[index][field] = value
    if (field === 'price') {
      rowsData.value[index].value = value
    } else if (field === 'value') {
      rowsData.value[index].price = value
    }
    localStorage.setItem('dataCompany', JSON.stringify(rowsData.value))
    scope.set()
  }
}
</script>
