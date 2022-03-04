import { computed, reactive } from 'vue'
import { Web3Provider } from '@ethersproject/providers'
import { getInstance } from '@snapshot-labs/lock/plugins/vue3'
import networks from '@/helpers/networks.json'
import { formatUnits } from '@ethersproject/units'
import { useLocalStorage } from '@/composables/useLocalStorage'

let auth
const defaultNetwork = Object.keys(networks)[0]
const { setStorageItem, getStorageItem } = useLocalStorage()
const defaultChainId = 1

const state = reactive({
  account: '',
  network: networks[defaultNetwork],
  authLoading: false,
  profile: null,
  walletConnectType: null,
  isTrezor: false,
  isRightChain: true,
  isConnected: getStorageItem('isConnected') ?? false

})

export function useWeb3() {
  async function login(connector = 'injected') {
    state.isTrezor = connector === 'trezor'
    auth = getInstance()
    state.authLoading = true
    await auth.login(connector)
    if (auth.provider.value) {
      auth.web3 = new Web3Provider(auth.provider.value, 'any')
      await loadProvider()
    }
    state.authLoading = false
  }

  function logout() {
    auth = getInstance()
    auth.logout()
    state.account = ''
    state.profile = null
    state.isTrezor = false
    setStorageItem('isConnected', false)
    state.isConnected = false
  }

  async function loadProvider() {
    try {
      if (
        auth.provider.value.removeAllListeners &&
        !auth.provider.value.isTorus
      )
        auth.provider.value.removeAllListeners()
      if (auth.provider.value.on) {
        auth.provider.value.on('chainChanged', async (chainId) => {
          handleChainChanged(parseInt(formatUnits(chainId, 0)))
        })
        auth.provider.value.on('accountsChanged', async (accounts) => {
          if (accounts.length !== 0) {
            state.account = accounts[0]
            await login()
          } else {
            await logout()
          }
        })
      }
      console.log('Provider', auth.provider.value)
      let network, accounts
      try {
        const connector = auth.provider.value?.connectorName
        if (connector === 'gnosis') {
          const { chainId: safeChainId, safeAddress } = auth.web3.provider.safe
          network = { chainId: safeChainId }
          accounts = [safeAddress]
        } else {
          [network, accounts] = await Promise.all([
            auth.web3.getNetwork(),
            auth.web3.listAccounts()
          ])
        }
      } catch (e) {
        console.log(e)
      }
      console.log('Network', network)
      console.log('Accounts', accounts)
      handleChainChanged(network.chainId)
      const acc = accounts.length > 0 ? accounts[0] : null

      state.account = acc
      state.walletConnectType = auth.provider.value?.wc?.peerMeta?.name || null
      setStorageItem('isConnected', true)
      state.isConnected = true
    } catch (e) {
      state.account = ''
      state.profile = null
      return Promise.reject(e)
    }
  }

  function handleChainChanged(chainId: number) {
    if (!networks[chainId]) {
      networks[chainId] = {
        ...networks[defaultNetwork],
        chainId,
        name: 'Unknown',
        network: 'unknown',
        unknown: true
      }
    }
    state.network = networks[chainId]
    console.log(chainId)
    state.isRightChain = chainId === defaultChainId ? true : false
  }

  async function switchNetwork() {
    if (window.ethereum) {
      let hexString = Number(defaultNetwork).toString(16)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x' + hexString }],
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  return {
    login,
    logout,
    loadProvider,
    handleChainChanged,
    switchNetwork,
    web3: computed(() => state),
    web3Account: computed(() => state.account),
    isRightChain: computed(() => state.isRightChain),
    isConnected: computed(() => state.isConnected)
  }
}
