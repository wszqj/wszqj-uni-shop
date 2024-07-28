<template>
  123
  <div>
    <!--  SKU组件-->
    <vk-data-goods-sku-popup
      v-model="isShowSKU"
      :localdata="localData"
      :mode="mode"
      add-cart-background-color="#ffa868"
      buy-now-background-color="#27ba9b"
      ref="skuRef"
      :actived-style="{
        color: '#27ba9b',
        borderColor: '#27ba9b',
        backgroundColor: '#cbd1d1',
      }"
      @add-cart="addMemberCart"
      @buy-now="onBuyNow"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { localData } from './test/skuData'
import type { SkuPopupInstanceType } from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
// sku组件实例
const skuRef = ref<SkuPopupInstanceType>()
export default defineComponent({
  name: 'SkuComponent',
  setup() {
    const isShowSKU = ref(true)
    const mode = ref(1) // 或者 'buy-now', 根据需求

    const addMemberCart = (skuItem: any) => {
      console.log('Add to cart:', skuItem)
    }

    const onBuyNow = (skuItem: any) => {
      console.log('Buy now:', skuItem)
    }

    return {
      isShowSKU,
      localData,
      mode,
      addMemberCart,
      onBuyNow,
    }
  },
})
</script>
