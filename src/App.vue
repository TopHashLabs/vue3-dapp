<script setup lang="ts">
import { ref, provide } from 'vue'
import { useWeb3 } from '@/composables/useWeb3'
import { shorten } from './helpers/utils'

const { login, web3, switchNetwork, isRightChain } = useWeb3()

provide('web3', web3)

const loading = ref(false)

async function handleLogin() {
  loading.value = true
  await login('injected')
  loading.value = false
}
</script>

<template>
  <div class="container">
    <BaseButton @click="handleLogin" :loading="loading"
      >Connect Wallet</BaseButton
    >
    <BaseButton v-if="!isRightChain" @click="switchNetwork" :loading="loading"
      >Switch Network</BaseButton
    >
    <div>
      <h1>
        Connected with: <span>{{ shorten(web3.account) }}</span>
      </h1>
    </div>
  </div>
</template>

<style></style>
