<template>
  <a v-if="isExternal" :href="link" target="_blank" class="no-decoration" @click="handleClick">
    <q-item clickable>
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </a>

  <div v-else-if="isFunction" class="no-decoration" @click="handleClick">
    <q-item clickable>
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </div>

  <router-link v-else :to="link" class="no-decoration">
    <q-item clickable>
      <q-item-section v-if="icon" avatar>
        <q-icon :name="icon" />
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ title }}</q-item-label>
        <q-item-label caption>{{ caption }}</q-item-label>
      </q-item-section>
    </q-item>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  caption: {
    type: String,
    default: '',
  },
  link: [String, Object, Function],
  icon: {
    type: String,
    default: '',
  },
})

const isExternal = computed(() => {
  return typeof props.link === 'string' && props.link.startsWith('http')
})

const isFunction = computed(() => typeof props.link === 'function')

const handleClick = (event) => {
  if (isFunction.value) {
    event.preventDefault()
    props.link()
  }
}
</script>

<style scoped>
.no-decoration {
  text-decoration: none;
  color: inherit;
}
</style>
