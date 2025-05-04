<template>
  <q-btn
    class="q-ma-xs"
    :color="isSuccess ? 'positive' : 'secondary'"
    :disable="isLoading"
    size="xl"
    @click="loadDemoData"
  >
    <div class="column items-center">
      <q-icon :name="isSuccess ? 'check_circle' : 'database'" />
      <div class="text-center text-caption">
        <span v-if="isLoading">Carregando...</span>
        <template v-else>
          <div>Carregar</div>
          <div>Dados de</div>
          <div>Demonstração</div>
        </template>
      </div>
    </div>
  </q-btn>
</template>
<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'

const isLoading = ref(false)
const isSuccess = ref(false)

// Pré preenchimento para os produtos
const exampleProducts = [
  {
    id: Date.now(),
    name: 'Notebook Dell Inspiron',
    description: 'Notebook com processador i7, 16GB RAM, 512GB SSD',
    amount: 90,
    price: 4599.9,
    code: '001-NB-DELL',
    category: 'electronics',
    brand: 'Dell',
    supplier: 'Dell Brasil',
    manufactureDate: '2025-03-01',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 1,
    name: 'Monitor LG 27"',
    description: 'Monitor LED IPS Full HD 27 polegadas',
    amount: 50,
    price: 1299.9,
    code: '002-MN-LG',
    category: 'electronics',
    brand: 'LG',
    supplier: 'LG electronics',
    manufactureDate: '2025-02-15',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 2,
    name: 'Smartphone Samsung Galaxy',
    description: 'Smartphone com tela AMOLED, 128GB',
    amount: 60,
    price: 2499.9,
    code: '003-SP-SAM',
    category: 'electronics',
    brand: 'Samsung',
    supplier: 'Samsung Brasil',
    manufactureDate: '2025-04-01',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 3,
    name: 'Cadeira de Escritório',
    description: 'Cadeira ergonômica com apoio lombar',
    amount: 52,
    price: 899.9,
    code: '004-CD-ERG',
    category: 'furniture',
    brand: 'ErgoPlus',
    supplier: 'furniture Corporativos Ltda',
    manufactureDate: '2025-01-20',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 4,
    name: 'Teclado Mecânico Gamer',
    description: 'Teclado mecânico RGB com switches blue',
    amount: 72,
    price: 349.9,
    code: '005-TC-MEC',
    category: 'electronics',
    brand: 'Redragon',
    supplier: 'ImportTech',
    manufactureDate: '2025-03-10',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 5,
    name: 'Mouse Sem Fio',
    description: 'Mouse wireless com sensor de precisão',
    amount: 78,
    price: 129.9,
    code: '006-MS-WRL',
    category: 'electronics',
    brand: 'Logitech',
    supplier: 'Logitech Brasil',
    manufactureDate: '2025-04-05',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 6,
    name: 'Headset Gamer',
    description: 'Headset com microfone e cancelamento de ruído',
    amount: 71,
    price: 299.9,
    code: '007-HS-GMR',
    category: 'electronics',
    brand: 'HyperX',
    supplier: 'Tech Imports',
    manufactureDate: '2025-03-15',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 7,
    name: 'Mesa de Escritório',
    description: 'Mesa em L com gavetas e suporte para CPU',
    amount: 35,
    price: 749.9,
    code: '008-MS-ESC',
    category: 'furniture',
    brand: 'OfficePro',
    supplier: 'furniture Corporativos Ltda',
    manufactureDate: '2025-02-10',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 8,
    name: 'Arroz Integral',
    description: 'Pacote de arroz integral 1kg',
    amount: 120,
    price: 8.9,
    code: '009-AL-INT',
    category: 'food',
    brand: 'Tio João',
    supplier: 'food S.A.',
    manufactureDate: '2025-03-05',
    expirationDate: '2026-03-05',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 9,
    name: 'Feijão Preto',
    description: 'Pacote de feijão preto 1kg',
    amount: 100,
    price: 7.5,
    code: '010-AL-FPJ',
    category: 'food',
    brand: 'Camil',
    supplier: 'Camil food',
    manufactureDate: '2025-02-20',
    expirationDate: '2026-02-20',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 10,
    name: 'Camiseta Básica',
    description: 'Camiseta de algodão tamanho M',
    amount: 200,
    price: 29.9,
    code: '011-VT-CBS',
    category: 'clothing',
    brand: 'Hering',
    supplier: 'Hering Brasil',
    manufactureDate: '2025-01-15',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 11,
    name: 'Calça Jeans',
    description: 'Calça jeans masculina tamanho 42',
    amount: 150,
    price: 89.9,
    code: '012-VT-CJN',
    category: 'clothing',
    brand: "Levi's",
    supplier: "Levi's Brasil",
    manufactureDate: '2025-02-10',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 12,
    name: 'Caneta Esferográfica',
    description: 'Caneta azul ponta fina',
    amount: 500,
    price: 1.5,
    code: '013-OT-CAN',
    category: 'others',
    brand: 'BIC',
    supplier: 'BIC Brasil',
    manufactureDate: '2025-03-01',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
  {
    id: Date.now() + 13,
    name: 'Caderno Universitário',
    description: 'Caderno 200 folhas capa dura',
    amount: 300,
    price: 15.9,
    code: '014-OT-CAD',
    category: 'others',
    brand: 'Tilibra',
    supplier: 'Tilibra S.A.',
    manufactureDate: '2025-02-25',
    expirationDate: '',
    currentDate: getCurrentDate(),
  },
]

// Dados de exemplo para movimentações
const exampleMovements = [
  {
    id: Date.now(),
    productId: exampleProducts[0].id,
    productCode: exampleProducts[0].code,
    productName: exampleProducts[0].name,
    type: 'Entrada',
    reason: 'Compra',
    amount: 20,
    date: '2025-04-15',
    responsible: 'João Silva',
    dateRegistration: new Date(2025, 3, 15, 9, 30).toISOString(),
  },
  {
    id: Date.now() + 1,
    productId: exampleProducts[1].id,
    productCode: exampleProducts[1].code,
    productName: exampleProducts[1].name,
    type: 'Entrada',
    reason: 'Compra',
    amount: 25,
    date: '2025-04-16',
    responsible: 'Maria Oliveira',
    dateRegistration: new Date(2025, 3, 16, 10, 15).toISOString(),
  },
  {
    id: Date.now() + 2,
    productId: exampleProducts[0].id,
    productCode: exampleProducts[0].code,
    productName: exampleProducts[0].name,
    type: 'Saída',
    reason: 'Venda',
    amount: 25,
    date: '2025-04-18',
    responsible: 'Carlos Santos',
    dateRegistration: new Date(2025, 3, 18, 14, 20).toISOString(),
  },
  {
    id: Date.now() + 3,
    productId: exampleProducts[2].id,
    productCode: exampleProducts[2].code,
    productName: exampleProducts[2].name,
    type: 'Entrada',
    reason: 'Compra',
    amount: 30,
    date: '2025-04-20',
    responsible: 'Ana Pereira',
    dateRegistration: new Date(2025, 3, 20, 11, 45).toISOString(),
  },
  {
    id: Date.now() + 4,
    productId: exampleProducts[3].id,
    productCode: exampleProducts[3].code,
    productName: exampleProducts[3].name,
    type: 'Entrada',
    reason: 'Compra',
    amount: 20,
    date: '2025-04-22',
    responsible: 'Roberto Almeida',
    dateRegistration: new Date(2025, 3, 22, 9, 0).toISOString(),
  },
  {
    id: Date.now() + 5,
    productId: exampleProducts[2].id,
    productCode: exampleProducts[2].code,
    productName: exampleProducts[2].name,
    type: 'Saída',
    reason: 'Venda',
    amount: 17,
    date: '2025-04-23',
    responsible: 'Fernanda Lima',
    dateRegistration: new Date(2025, 3, 23, 16, 30).toISOString(),
  },
  {
    id: Date.now() + 6,
    productId: exampleProducts[4].id,
    productCode: exampleProducts[4].code,
    productName: exampleProducts[4].name,
    type: 'Entrada',
    reason: 'Devolução',
    amount: 5,
    date: '2025-04-24',
    responsible: 'Lucas Costa',
    dateRegistration: new Date(2025, 3, 24, 13, 15).toISOString(),
  },
  {
    id: Date.now() + 7,
    productId: exampleProducts[5].id,
    productCode: exampleProducts[5].code,
    productName: exampleProducts[5].name,
    type: 'Entrada',
    reason: 'Compra',
    amount: 45,
    date: '2025-04-25',
    responsible: 'Amanda Souza',
    dateRegistration: new Date(2025, 3, 25, 10, 45).toISOString(),
  },
  {
    id: Date.now() + 8,
    productId: exampleProducts[6].id,
    productCode: exampleProducts[6].code,
    productName: exampleProducts[6].name,
    type: 'Entrada',
    reason: 'Compra',
    amount: 30,
    date: '2025-04-26',
    responsible: 'Paulo Mendes',
    dateRegistration: new Date(2025, 3, 26, 9, 30).toISOString(),
  },
  {
    id: Date.now() + 9,
    productId: exampleProducts[3].id,
    productCode: exampleProducts[3].code,
    productName: exampleProducts[3].name,
    type: 'Saída',
    reason: 'Venda',
    amount: 22,
    date: '2025-04-27',
    responsible: 'Juliana Freitas',
    dateRegistration: new Date(2025, 3, 27, 15, 0).toISOString(),
  },
  {
    id: Date.now() + 10,
    productId: exampleProducts[7].id,
    productCode: exampleProducts[7].code,
    productName: exampleProducts[7].name,
    type: 'Saída',
    reason: 'Venda',
    amount: 15,
    date: '2025-04-28',
    responsible: 'Marcelo Dias',
    dateRegistration: new Date(2025, 3, 28, 11, 20).toISOString(),
  },
]

function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function loadDemoData() {
  isLoading.value = true

  setTimeout(() => {
    try {
      // Salvar os produtos no localStorage
      localStorage.setItem('dataProducts', JSON.stringify(exampleProducts))

      // Salvar as movimentações no localStorage
      localStorage.setItem('dataMoviments', JSON.stringify(exampleMovements))

      isSuccess.value = true

      Notify.create({
        color: 'positive',
        textColor: 'white',
        icon: 'check_circle',
        message: `Dados de demonstração carregados! ${exampleProducts.length} produtos e ${exampleMovements.length} movimentações.`,
        position: 'top',
        timeout: 3000,
      })

      setTimeout(() => {
        isSuccess.value = false
      }, 3000)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)

      Notify.create({
        color: 'negative',
        textColor: 'white',
        icon: 'error',
        message: `Erro ao carregar dados: ${error.message}`,
        position: 'top',
        timeout: 3000,
      })
    } finally {
      isLoading.value = false
    }
  }, 800)
}
</script>
