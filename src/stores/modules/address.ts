import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AddressItem } from '@/types/address'

export const useSelectedAddress = defineStore('address', () => {
  const selectedAddress = ref<AddressItem>()

  const changeSelectedAddress = (val: AddressItem) => {
    selectedAddress.value = val
  }

  const clearSelectedAddress = () => {
    selectedAddress.value = undefined
  }
  return {
    selectedAddress,
    changeSelectedAddress,
    clearSelectedAddress,
  }
})
