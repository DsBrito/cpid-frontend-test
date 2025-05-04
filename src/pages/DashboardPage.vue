<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-md">Dashboard de Estoque</div>

    <div class="row q-col-gutter-md">
      <!-- Filtros -->
      <div class="col-12">
        <q-card class="q-pa-md">
          <div class="row q-col-gutter-md items-center">
            <div class="col-12 col-md-4">
              <q-select
                v-model="selectedProduct"
                :options="productOptions"
                label="Selecione um Produto"
                option-label="name"
                dense
                emit-value
                map-options
                clearable
                @update:model-value="loadChartData"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-select
                v-model="selectedCategory"
                :options="categoryOptions"
                label="Filtrar por Categoria"
                dense
                emit-value
                map-options
                clearable
                @update:model-value="loadChartData"
              />
            </div>
            <div class="col-12 col-md-4">
              <q-input
                v-model="dateRange"
                label="Período"
                mask="##/##/#### - ##/##/####"
                dense
                clearable
                @update:model-value="parseDateRange"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date
                        v-model="dateRange"
                        range
                        mask="DD/MM/YYYY"
                        @update:model-value="parseDateRange"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </q-card>
      </div>

      <!-- Cards de Resumo -->
      <div class="col-12 col-md-4">
        <q-card class="q-pa-md full-height">
          <div class="text-h6">Total de Produtos</div>
          <div class="text-h3 text-primary q-mt-sm">{{ totalProducts }}</div>
          <q-linear-progress :value="1" color="primary" class="q-mt-md" />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="q-pa-md full-height">
          <div class="text-h6">Total de Entradas</div>
          <div class="text-h3 text-positive q-mt-sm">{{ totalIn }}</div>
          <q-linear-progress
            :value="totalIn / (totalIn + totalOut || 1)"
            color="positive"
            class="q-mt-md"
          />
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="q-pa-md full-height">
          <div class="text-h6">Total de Saídas</div>
          <div class="text-h3 text-negative q-mt-sm">{{ totalOut }}</div>
          <q-linear-progress
            :value="totalOut / (totalIn + totalOut || 1)"
            color="negative"
            class="q-mt-md"
          />
        </q-card>
      </div>

      <!-- Primeiro gráfico - Estoque por Produto -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">Estoque por Produto</div>
          <div style="height: 300px">
            <e-chart :option="stockChartOption" autoresize />
          </div>
        </q-card>
      </div>

      <!-- Segundo gráfico - Entradas e Saídas -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">Entradas e Saídas</div>
          <div style="height: 300px">
            <e-chart :option="movementChartOption" autoresize />
          </div>
        </q-card>
      </div>

      <!-- Gráfico de linha - Histórico de movimentações -->
      <div class="col-12">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">Histórico de Movimentações</div>
          <div style="height: 300px">
            <e-chart :option="historyChartOption" autoresize />
          </div>
        </q-card>
      </div>

      <!-- Distribuição por categoria -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">Distribuição por Categoria</div>
          <div style="height: 300px">
            <e-chart :option="categoryChartOption" autoresize />
          </div>
        </q-card>
      </div>

      <!-- Top 5 produtos -->
      <div class="col-12 col-md-6">
        <q-card class="q-pa-md">
          <div class="text-h6 q-mb-md">Top 5 Produtos (Maior Movimentação)</div>
          <div style="height: 300px">
            <e-chart :option="topProductsChartOption" autoresize />
          </div>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import EChart from 'vue-echarts'

// Registrando os componentes necessários do ECharts
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

// Dados
const products = ref([])
const movements = ref([])
const selectedProduct = ref(null)
const selectedCategory = ref(null)
const dateRange = ref('')
const startDate = ref(null)
const endDate = ref(null)

// Contadores
const totalProducts = ref(0)
const totalIn = ref(0)
const totalOut = ref(0)

// Opções para o select de produtos
const productOptions = computed(() => {
  return products.value.map((product) => ({
    label: `${product.name} (${product.amount})`,
    value: product.id,
    name: product.name,
  }))
})

// Opções para o select de categorias
const categoryOptions = [
  { label: 'Eletrônicos', value: 'electronics' },
  { label: 'Alimentos', value: 'food' },
  { label: 'Vestuário', value: 'clothing' },
  { label: 'Móveis', value: 'furniture' },
  { label: 'Outros', value: 'others' },
]

// Opções do gráfico de estoque por produto
const stockChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['Estoque Atual'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Estoque Atual',
      type: 'bar',
      data: [],
      itemStyle: {
        color: '#1976D2',
      },
    },
  ],
})

// Opções do gráfico de entradas e saídas
const movementChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  legend: {
    data: ['Entradas', 'Saídas'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Entradas',
      type: 'bar',
      stack: 'total',
      data: [],
      itemStyle: {
        color: '#21BA45',
      },
    },
    {
      name: 'Saídas',
      type: 'bar',
      stack: 'total',
      data: [],
      itemStyle: {
        color: '#C10015',
      },
    },
  ],
})

// Opções do gráfico de histórico de movimentações
const historyChartOption = ref({
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Entradas', 'Saídas', 'Balanço'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Entradas',
      type: 'line',
      data: [],
      itemStyle: {
        color: '#21BA45',
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(33, 186, 69, 0.6)',
          },
          {
            offset: 1,
            color: 'rgba(33, 186, 69, 0.1)',
          },
        ]),
      },
    },
    {
      name: 'Saídas',
      type: 'line',
      data: [],
      itemStyle: {
        color: '#C10015',
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(193, 0, 21, 0.6)',
          },
          {
            offset: 1,
            color: 'rgba(193, 0, 21, 0.1)',
          },
        ]),
      },
    },
    {
      name: 'Balanço',
      type: 'line',
      data: [],
      itemStyle: {
        color: '#1976D2',
      },
    },
  ],
})

// Opções do gráfico de distribuição por categoria
const categoryChartOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    left: 10,
    data: [],
  },
  series: [
    {
      name: 'Distribuição',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '16',
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: [],
    },
  ],
})

// Opções do gráfico de top 5 produtos
const topProductsChartOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
  },
  yAxis: {
    type: 'category',
    data: [],
  },
  series: [
    {
      name: 'Movimentações',
      type: 'bar',
      data: [],
      itemStyle: {
        color: function (params) {
          const colorList = ['#1976D2', '#21BA45', '#F2C037', '#C10015', '#9C27B0']
          return colorList[params.dataIndex % colorList.length]
        },
      },
    },
  ],
})

// Carregar dados de produtos e movimentações
const loadData = () => {
  // Carregar produtos do localStorage
  const productsData = localStorage.getItem('dataProducts')
  if (productsData) {
    products.value = JSON.parse(productsData)
    totalProducts.value = products.value.length
  }

  // Carregar movimentações do localStorage
  const movementsData = localStorage.getItem('dataMoviments')
  if (movementsData) {
    movements.value = JSON.parse(movementsData)
  }

  // Calcular totais de entrada e saída
  totalIn.value = movements.value.filter((mov) => mov.type === 'Entrada').length
  totalOut.value = movements.value.filter((mov) => mov.type === 'Saída').length

  // Carregar dados para os gráficos
  loadChartData()
}

// Função para filtrar movimentações com base nos filtros selecionados
const getFilteredMovements = () => {
  return movements.value.filter((mov) => {
    // Filtro por produto
    const productFilter = !selectedProduct.value || mov.productId === selectedProduct.value

    // Filtro por categoria (precisamos pegar a categoria do produto)
    let categoryFilter = true
    if (selectedCategory.value) {
      const product = products.value.find((p) => p.id === mov.productId)
      if (product) {
        categoryFilter = product.category === selectedCategory.value
      }
    }

    // Filtro por data
    let dateFilter = true
    if (startDate.value && endDate.value) {
      const movDate = new Date(mov.date)
      dateFilter = movDate >= startDate.value && movDate <= endDate.value
    }

    return productFilter && categoryFilter && dateFilter
  })
}

// Carregar dados para os gráficos
const loadChartData = () => {
  // Estoque por Produto - Top 10 produtos por quantidade
  const topStockProducts = [...products.value].sort((a, b) => b.amount - a.amount).slice(0, 10)

  stockChartOption.value.xAxis.data = topStockProducts.map((p) => p.name)
  stockChartOption.value.series[0].data = topStockProducts.map((p) => p.amount)

  // Filtrar movimentações
  const filteredMovements = getFilteredMovements()

  // Agrupar movimentações por produto para o gráfico de entradas e saídas
  const productMovements = {}

  filteredMovements.forEach((mov) => {
    if (!productMovements[mov.productName]) {
      productMovements[mov.productName] = { in: 0, out: 0 }
    }

    if (mov.type === 'Entrada') {
      productMovements[mov.productName].in += mov.amount
    } else {
      productMovements[mov.productName].out += mov.amount
    }
  })

  // Preparar dados para o gráfico de entradas e saídas
  const productNames = Object.keys(productMovements).slice(0, 8) // Top 8 produtos
  movementChartOption.value.xAxis.data = productNames
  movementChartOption.value.series[0].data = productNames.map((name) => productMovements[name].in)
  movementChartOption.value.series[1].data = productNames.map((name) => productMovements[name].out)

  // Agrupar movimentações por data para o gráfico de histórico
  const movementsByDate = {}

  filteredMovements.forEach((mov) => {
    const date = mov.date
    if (!movementsByDate[date]) {
      movementsByDate[date] = { in: 0, out: 0 }
    }

    if (mov.type === 'Entrada') {
      movementsByDate[date].in += mov.amount
    } else {
      movementsByDate[date].out += mov.amount
    }
  })

  // Ordenar datas
  const dates = Object.keys(movementsByDate).sort()

  // Preparar dados para o gráfico de histórico
  historyChartOption.value.xAxis.data = dates
  historyChartOption.value.series[0].data = dates.map((date) => movementsByDate[date].in)
  historyChartOption.value.series[1].data = dates.map((date) => movementsByDate[date].out)
  historyChartOption.value.series[2].data = dates.map(
    (date) => movementsByDate[date].in - movementsByDate[date].out,
  )

  // Agrupar produtos por categoria para o gráfico de distribuição
  const categoryCounts = {
    electronics: 0,
    food: 0,
    clothing: 0,
    furniture: 0,
    others: 0,
  }

  products.value.forEach((product) => {
    if (categoryCounts[product.category] !== undefined) {
      categoryCounts[product.category] += product.amount
    }
  })

  // Preparar dados para o gráfico de distribuição por categoria
  categoryChartOption.value.legend.data = categoryOptions.map((cat) => cat.label)
  categoryChartOption.value.series[0].data = categoryOptions.map((cat) => ({
    name: cat.label,
    value: categoryCounts[cat.value] || 0,
  }))

  // Calcular top 5 produtos com mais movimentações
  const productTotalMovements = {}

  filteredMovements.forEach((mov) => {
    if (!productTotalMovements[mov.productName]) {
      productTotalMovements[mov.productName] = 0
    }
    productTotalMovements[mov.productName] += mov.amount
  })

  const topProducts = Object.entries(productTotalMovements)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Preparar dados para o gráfico de top 5 produtos
  topProductsChartOption.value.yAxis.data = topProducts.map((p) => p[0])
  topProductsChartOption.value.series[0].data = topProducts.map((p) => p[1])
}

// Processar o intervalo de datas selecionado
const parseDateRange = () => {
  if (dateRange.value) {
    const parts = dateRange.value.split(' - ')
    if (parts.length === 2) {
      // Formato DD/MM/YYYY
      const startParts = parts[0].split('/')
      const endParts = parts[1].split('/')

      if (startParts.length === 3 && endParts.length === 3) {
        startDate.value = new Date(
          parseInt(startParts[2]),
          parseInt(startParts[1]) - 1,
          parseInt(startParts[0]),
        )

        endDate.value = new Date(
          parseInt(endParts[2]),
          parseInt(endParts[1]) - 1,
          parseInt(endParts[0]),
        )

        // Recarregar dados dos gráficos com o novo filtro de data
        loadChartData()
      }
    }
  } else {
    // Limpar filtro de data
    startDate.value = null
    endDate.value = null
    loadChartData()
  }
}

// Observer para detectar mudanças no localStorage
const createStorageObserver = () => {
  window.addEventListener('storage', (event) => {
    if (event.key === 'dataProducts' || event.key === 'movements') {
      loadData()
    }
  })
}

// Inicialização
onMounted(() => {
  loadData()
  createStorageObserver()
})

// Observar mudanças nos filtros
watch([selectedProduct, selectedCategory], () => {
  loadChartData()
})
</script>

<style scoped></style>
