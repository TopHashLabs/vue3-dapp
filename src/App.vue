<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import { useWeb3 } from '@/composables/useWeb3'
import { shorten } from './helpers/utils'
import { useLocalStorage } from '@/composables/useLocalStorage'

const { login, web3, web3Account, switchNetwork, isRightChain, isConnected } = useWeb3()

provide('web3', web3)

const loading = ref(false)

async function handleLogin() {
  loading.value = true
  await login('injected')
  loading.value = false
}

async function switchChain() {
  loading.value = true
  await switchNetwork()
  loading.value = false
}

if(isConnected.value) {
  handleLogin()
}
</script>

<template>
  <div class="h-full w-full fixed flex justify-center items-center">
    <BaseButton v-if="!isConnected" @click="handleLogin" :loading="loading"
      >Connect Wallet</BaseButton
    >
    <BaseButton v-else-if="!isRightChain" @click="switchChain" :loading="loading"
      >Switch Network</BaseButton
    >
    <div class=" flex flex-col space-y-2 justify-center" v-else>
      <h1 class="border-2 border-gray-500 rounded-xl p-2">
        Connected with: <span>{{ shorten(web3Account) }}</span>
      </h1>
      <BaseButton @click="switchChain" :loading="loading"
      >Mint</BaseButton
    >
    </div>
  </div>
</template>

<style></style>
