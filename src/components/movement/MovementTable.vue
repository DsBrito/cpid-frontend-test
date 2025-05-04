<template>
  <div>
    <div class="row justify-between items-center q-mb-md">
      <q-input v-model="filter" dense placeholder="Buscar..." class="q-ml-md" style="width: 200px">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <div class="row q-gutter-sm">
        <q-select
          v-model="typeFiltro"
          :options="['Todos', 'Entrada', 'Saída']"
          label="Tipo"
          dense
          options-dense
          style="width: 150px"
        />

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
    </div>

    <q-table
      :rows="filteredMovements"
      :columns="visibleColumns"
      row-key="id"
      :filter="filter"
      v-model:pagination="pagination"
      :loading="loading"
      :bordered="true"
      :dense="true"
    >
      <template v-slot:body="props">
        <q-tr :props="props" :class="getRowColor(props.row.type)">
          <q-td v-for="col in visibleColumns" :key="col.name" :props="props">
            <template v-if="col.name === 'type'">
              <q-badge :color="props.row.type === 'Entrada' ? 'positive' : 'negative'">
                {{ props.row.type }}
              </q-badge>
            </template>
            <template v-else-if="col.name === 'date' || col.name === 'dateRegistration'">
              {{ formatDate(props.row[col.field]) }}
            </template>
            <template v-else-if="col.name === 'amount'">
              <span :class="props.row.type === 'Entrada' ? 'text-positive' : 'text-negative'">
                {{ props.row.type === 'Entrada' ? '+' : '-' }}{{ props.row[col.field] }}
              </span>
            </template>
            <template v-else>
              {{ props.row[col.field] }}
            </template>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:no-data="{ icon, filter }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span> Nenhuma movimentação encontrada </span>
          <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
        </div>
      </template>

      <template v-slot:bottom>
        <div class="row items-center justify-between full-width">
          <div>Total de movimentações: {{ filteredMovements.length }}</div>
          <q-pagination
            v-model="pagination.page"
            :max="Math.ceil(filteredMovements.length / pagination.rowsPerPage)"
            :direction-links="true"
            :boundary-links="true"
            color="primary"
            size="sm"
            v-if="filteredMovements.length > pagination.rowsPerPage"
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
import { ref, computed, onMounted, watch } from 'vue'

const loading = ref(false)
const filter = ref('')
const typeFiltro = ref('Todos')
const pagination = ref({
  sortBy: 'dataRegistro',
  descending: true,
  page: 1,
  rowsPerPage: 10,
})

const movements = ref([])

// Definição das colunas
const allColumns = [
  { name: 'productId', label: 'ID', field: 'id', sortable: true, align: 'left' },
  { name: 'productName', label: 'Produto', field: 'productName', sortable: true, align: 'left' },
  { name: 'productCode', label: 'Código', field: 'productCode', sortable: true, align: 'left' },
  { name: 'type', label: 'Tipo', field: 'type', sortable: true, align: 'center' },
  { name: 'reason', label: 'Motivo', field: 'reason', sortable: true, align: 'left' },
  { name: 'amount', label: 'Quantidade', field: 'amount', sortable: true, align: 'right' },
  { name: 'date', label: 'Data da Movimentação', field: 'date', sortable: true, align: 'left' },
  {
    name: 'responsible',
    label: 'Responsável',
    field: 'responsible',
    sortable: true,
    align: 'left',
  },
  {
    name: 'dateRegistration',
    label: 'Data de Registro',
    field: 'dateRegistration',
    sortable: true,
    align: 'left',
  },
]

// Opções para seleção de colunas visíveis
const columnOptions = allColumns.map((col) => ({
  label: col.label,
  value: col.name,
}))

// Colunas visíveis inicialmente
const visibleColumnNames = ref([
  'productName',
  'productCode',
  'type',
  'reason',
  'amount',
  'date',
  'responsible',
])

// Colunas visíveis filtradas com base na seleção do usuário
const visibleColumns = computed(() =>
  allColumns.filter((col) => visibleColumnNames.value.includes(col.name)),
)

// Filtrar movimentações com base no type selecionado
const filteredMovements = computed(() => {
  let result = movements.value

  if (typeFiltro.value !== 'Todos') {
    result = result.filter((m) => m.type === typeFiltro.value)
  }

  return result
})

// Formatar date
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleString('pt-BR')
  } catch {
    return dateString
  }
}

// Definir cor da linha com base no type de movimentação
const getRowColor = (type) => {
  return type === 'Entrada' ? 'bg-green-1' : 'bg-red-1'
}

// Carregar movimentações do localStorage
const loadMovements = () => {
  loading.value = true
  try {
    const movementsStored = localStorage.getItem('dataMoviments')
    if (movementsStored) {
      movements.value = JSON.parse(movementsStored)
    }
  } catch (error) {
    console.error('Erro ao carregar movimentações:', error)
  } finally {
    setTimeout(() => {
      loading.value = false
    }, 200)
  }
}

// Observer para detectar mudanças no localStorage
const createStorageObserver = () => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'movements') {
      loadMovements()
    }
  })

  // Workaround para detectar mudanças no mesmo navegador/aba
  // const originalSetItem = localStorage.setItem
  // localStorage.setItem = function (key) {
  //   const event = new Event('storage')
  //   event.key = key
  //   originalSetItem.apply(this, arguments)
  //   window.dispatchEvent(event)
  // }
}

// Inicialização
onMounted(() => {
  loadMovements()
  createStorageObserver()
})

// Re-carregar dados quando o filtro de type mudar
watch(typeFiltro, () => {
  pagination.value.page = 1
})
</script>

<style scoped></style>
