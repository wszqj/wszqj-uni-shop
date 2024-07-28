<script setup lang="ts">
// 获取屏幕边界到安全区域距离
import CustomNavbar from '@/pages/index/components/CustomNavbar.vue'
import HomeSwiper from '@/components/HomeSwiper.vue'
import CategoryPanel from '@/pages/index/components/CategoryPanel.vue'
import HotPanel from '@/pages/index/components/HotPanel.vue'
import HomeGuess from '@/components/HomeGuess.vue'
import { ref } from 'vue'
import type { HomeGuessInstance } from '@/types/component'
import type { Advertisement } from '@/types/home'
import { getAdvertisementListAPI } from '@/api/home'
import { onLoad } from '@dcloudio/uni-app'

// 刷新动画是否显示
const isTriggered = ref(false)
// 是否在加载中
const isLoading = ref(false)
// 猜你喜欢组件
const goodsRef = ref<HomeGuessInstance>()
// 滚动触底
const onScrolltolower = () => {
  goodsRef.value?.getMore()
}
// 下拉刷新
const onRefresherrefresh = async () => {
  isTriggered.value = true
  // 重置猜你喜欢组件数据
  goodsRef.value?.resetData()
  // 加载数据
  await Promise.all([
    getAdvertisementListAPI(),
    // getHomeCategoryData(),
    // getHotData(),
    goodsRef.value?.getMore(),
  ])
  // 关闭动画
  isTriggered.value = false
}
// 轮播图列表
const AdvertisementList = ref<Advertisement[]>([])
// 获取广告轮播图
const getAdvertisementList = async () => {
  let res = await getAdvertisementListAPI()
  AdvertisementList.value = res.result
}

// 页面加载
onLoad(async () => {
  isLoading.value = true
  await Promise.all([
    getAdvertisementList(),
    // getHomeCategoryData(),
    // getHotData(),
  ])
  isLoading.value = false
})
</script>

<template>
  <!--  自定义导航条-->
  <CustomNavbar />
  <scroll-view
    refresher-enabled="true"
    scroll-y="true"
    class="scroll-view"
    @refresherrefresh="onRefresherrefresh"
    :refresher-triggered="isTriggered"
    @scrolltolower="onScrolltolower"
  >
    <!--  自定义轮播图-->
    <HomeSwiper :list="AdvertisementList" />
    <!--  分类组件-->
    <CategoryPanel />
    <!--  热门推荐-->
    <HotPanel />
    <!--猜你喜欢-->
    <HomeGuess ref="goodsRef" />
  </scroll-view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scroll-view {
  flex: 1;
}
</style>
