<script setup lang="ts">
import { computed } from 'vue'
import type { Advertisement } from '@/types/home'

import { baseImgUrl } from '@/constants'
// 轮播图列表
let props = defineProps<{
  list: Advertisement[]
}>()
const ADList = computed(() => {
  return props.list.map((item) => {
    return baseImgUrl + item.url
  })
})
// 同时显示的滑块数量
const items = ADList.value.length - 1
</script>

<template>
  <view class="carousel">
    <u-swiper
      :list="ADList"
      previousMargin="30"
      nextMargin="30"
      circular
      :displayMultipleItems="items"
      height="150"
      :autoplay="true"
      radius="5"
      bgColor="#ffffff"
    ></u-swiper>
  </view>
</template>

<style lang="scss">
:host {
  display: block;
  height: 300rpx;
}

/* 轮播图 */
.carousel {
  margin-top: 10rpx;
  height: 100%;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;
}
</style>
