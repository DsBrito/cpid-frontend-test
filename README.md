# Sistema de Controle de Estoque

Este projeto foi desenvolvido como parte de um teste de habilidades em front-end, utilizando Vue.js e Quasar Framework.

## Funcionalidades Principais

1. **Gerenciamento de Produtos**

   - Adicionar, editar e remover produtos.
   - Informações do produto: código, nome, descrição, preço e quantidade inicial em estoque.

2. **Controle de Movimentação de Estoque**

   - Registro de entradas (compras, devoluções).
   - Registro de saídas (vendas, vencimentos).
   - Atualização automática do estoque.

3. **Dashboard Interativa**
   - Visualização gráfica das movimentações de estoque.
   - Análise detalhada por produto.

## Tecnologias Utilizadas

- **Vue.js 3**: Framework progressivo para construção de interfaces de usuário.
- **Quasar Framework**: Framework para desenvolvimento de aplicações responsivas e de alta performance.
- **LocalStorage**: Persistência de dados diretamente no navegador.

## Como Executar o Projeto

### Pré-requisitos

- **Node.js** (versão 16 ou superior).
- **npm** (gerenciador de pacotes do Node.js).

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/DsBrito/cpid-frontend-test.git
   ```

2. Instale as dependências:

   ```bash
   cd cpid-frontend-test
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse a aplicação no navegador (Ele irá abrir na porta 9000 ou alguma próxima):

   ```bash
   http://localhost:9000/
   ```

## Estrutura do Projeto

```bash
src/
├── assets/
│   └── files/
│       └── ...
│   └── img/
│       └── ...
├── components/
│   └── home/
│       ├── deleteLocalStorage.vue
│       ├── loadLocalStorage.vue
│       └── NavigationState.vue
│   └── movement/
│       ├── MovementForm.vue
│       └── MovementTable.vue
│   └── product/
│       ├── ProductForm.vue
│       └── ProductTable.vue
├── layouts/
│   ├── MainLayout.vue
│   └── NoLayout.vue
├── pages/
│   ├── DashboardPage.vue
│   ├── ErrorNotFound.vue
│   ├── HomePage.vue
│   ├── MovementPage.vue
│   └──ProductPage.vue
├── router/
│   └── routes.js
├── utils/
│   ├── product-storage.js
└── └── utils-functions.js
```

## Persistência de Dados

Os dados são armazenados no **localStorage** do navegador com as seguintes chaves:

- **dataProducts**: Lista de produtos cadastrados.
- **dataMoviments**: Histórico de movimentações de estoque.

> **Dica**: Para visualizar os dados armazenados, acesse o DevTools do navegador (F12) e navegue até a aba **Application > Local Storage**.

## Links Utilizados

- **[Material Icons](https://fonts.google.com/icons)**: Biblioteca de ícones para usar com o Google Fonts.
- **[Vue](https://echarts.apache.org/examples/en/)**: Framework Javascript de código aberto.
- **[Quasar](https://quasar.dev/)**: Framework para Vue.js que facilita o desenvolvimento de aplicações responsivas com uma única base de código.
- **[ECharts (Apache)](https://echarts.apache.org/examples/en/)**: Biblioteca de gráficos interativos para visualização de dados, compatível com Vue.js.
