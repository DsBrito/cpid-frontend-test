export const ROUTE_NAMES = {
  home: 'home',
  product: 'product',
  movement: 'movement',
}

export const ROTAS = {
  home: {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: ROUTE_NAMES.home,
        component: () => import('../pages/HomePage.vue'),
      },
      {
        path: 'product',
        name: ROUTE_NAMES.product,
        component: () => import('../pages/ProductPage.vue'),
      },
      {
        path: 'movement',
        name: ROUTE_NAMES.movement,
        component: () => import('../pages/MovementPage.vue'),
      },
    ],
  },
}

function isRouteRecord(obj) {
  return typeof obj === 'object' && obj !== null && 'path' in obj && 'component' in obj
}

const findRouteRecords = (obj) => {
  if (isRouteRecord(obj)) {
    return [obj]
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.values(obj).flatMap(findRouteRecords)
  }
  return []
}

const records = findRouteRecords(ROTAS)

const routes = [
  ...records,

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/ErrorNotFound.vue'),
  },
]

export default routes
