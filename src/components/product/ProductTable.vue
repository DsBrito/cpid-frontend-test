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
            <div v-if="col.name !== 'id' && col.name !== 'actions'" title="Clique para editar">
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
            <div v-else-if="col.name === 'id'">
              {{ props.row[col.field] }}
            </div>
            <div v-else-if="col.name === 'actions'">
              <q-btn
                color="negative"
                label="Excluir"
                dense
                @click="handleDelete('dataCompany', props.row.id)"
              />
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
import { ref, watch, computed } from 'vue'
import { getLocalStorage, deleteData } from '../../utils/product-storage'

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

const allColumns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'code', label: 'Código', field: 'code', align: 'left' },
  { name: 'name', label: 'Nome', field: 'name', align: 'left' },
  { name: 'price', label: 'Preço', field: 'price', align: 'right' },
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'amount', label: 'Quantidade', field: 'amount', align: 'right' },
  { name: 'category', label: 'Categoria', field: 'category', align: 'left' },
  { name: 'brand', label: 'Marca', field: 'brand', align: 'left' },
  { name: 'supplier', label: 'Fornecedor', field: 'supplier', align: 'left' },
  { name: 'expirationDate', label: 'Data Validade', field: 'expirationDate', align: 'left' },
  { name: 'manufactureDate', label: 'Data Fabricação', field: 'manufactureDate', align: 'left' },
  { name: 'currentDate', label: 'Data Cadastro', field: 'currentDate', align: 'left' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
]

const columnOptions = allColumns.map((col) => ({
  label: col.label,
  value: col.name,
}))

const visibleColumnNames = ref([
  'id',
  'name',
  'description',
  'amount',
  'price',
  'code',
  'category',
  'brand',
  'supplier',
  'expirationDate',
  'manufactureDate',
  'currentDate',
  'actions',
])
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
    }
    localStorage.setItem('dataCompany', JSON.stringify(rowsData.value))
    scope.set()
  }
}
const handleDelete = (key, id) => {
  deleteData(key, id)
  rowsData.value = getLocalStorage('dataCompany')
}
</script>
