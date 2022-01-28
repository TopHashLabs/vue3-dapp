<template>
  <component :is="rootTag" class="p-2 bg-blue-500 text-white rounded-md">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const rootTag = computed(() => 'button')
</script>

<style></style>
