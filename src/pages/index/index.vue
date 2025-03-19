<script setup lang="ts">
// 获取屏幕边界到安全区域距离
import HomeSwiper from '@/components/HomeSwiper.vue'
import QuickPanel from '@/pages/index/components/QuickPanel.vue'
import HotPanel from '@/pages/index/components/HotPanel.vue'
import HomeGuess from '@/components/HomeGuess.vue'
import { onMounted, ref } from 'vue'
import type { HomeGuessInstance } from '@/types/component'
import type { Advertisement, GoodsListParams } from '@/types/home'
import { getAdvertisementListAPI } from '@/api/home'
import type { discountActivityItem } from '@/types/discount'
import { getAllDiscountActivityAPI } from '@/api/discount'
import MoveLoading from '@/components/MoveLoading.vue'

const { safeAreaInsets } = uni.getSystemInfoSync()
// 刷新动画是否显示
const isTriggered = ref(false)
// 是否在加载中
const loadingStatus = ref(false)
// 猜你喜欢组件
const goodsRef = ref<HomeGuessInstance>()
// 滚动触底
const onScrollToLower = () => {
  // 判断是否有搜索的内容
  /*  if (searchContent.value != null) {
    goodsQueryParam.value.brandName = searchContent.value
    goodsQueryParam.value.name = searchContent.value
    goodsRef.value?.getMore(goodsQueryParam.value)
  } else {
    goodsRef.value?.getMore()
  }*/
  // TODO
  goodsRef.value?.getMore()
}
// 下拉刷新
const onRefresherRefresh = async () => {
  isTriggered.value = true
  // 重置猜你喜欢组件数据
  goodsRef.value?.resetData()
  // 加载数据
  await Promise.all([
    getAdvertisementListAPI(),
    getAllDiscountActivity(),
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
// 折扣活动列表
const discountActivityList = ref<discountActivityItem[]>([])
// 获取折扣活动列表
const getAllDiscountActivity = async () => {
  // 调用api获取折扣活动列表
  const res = await getAllDiscountActivityAPI()
  discountActivityList.value = res.result
}
// 页面加载
onMounted(async () => {
  loadingStatus.value = true
  // 使用 Promise.race 来监听第一个完成的 Promise
  await Promise.race([
    getAdvertisementList().finally(() => {
      // 无论 Promise 是成功还是失败，都执行此回调
      // 这里我们只需要关心它是否完成，不关心结果
      if (!loadingStatus.value) {
        // 防止重复设置
        return
      }
      loadingStatus.value = false // 第一个完成，设置 loadingStatus 为 false
    }),
    getAllDiscountActivity().finally(() => {
      // 同上，无论 Promise 是成功还是失败，都执行此回调
      if (!loadingStatus.value) {
        // 防止重复设置
        return
      }
      loadingStatus.value = false // 第二个完成（如果第一个没完成的话），也设置 loadingStatus 为 false
    }),
  ])
  // 防止重复设置`
  if (!loadingStatus.value) {
    // 防止重复设置
    return
  }
  loadingStatus.value = false
})
// 商品查询参数
const goodsQueryParam = ref<GoodsListParams>({} as GoodsListParams)
// 搜索的内容
const searchContent = ref(null)
// 搜索商品
const searchGoods = () => {
  // 判断是否有搜索的内容
  if (searchContent.value != null) {
    goodsQueryParam.value.brandName = searchContent.value
    goodsQueryParam.value.categoryName = searchContent.value
    goodsQueryParam.value.discountName = searchContent.value
    goodsQueryParam.value.name = searchContent.value
    goodsRef.value?.getMore(goodsQueryParam.value)
  } else {
    goodsRef.value?.getMore()
  }
}
</script>

<template>
  <!--  自定义导航条-->
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <text class="logo-font">巨豪家具</text>
      <text class="logo-text">一站式购物 · 服务一流</text>
    </view>
    <!-- 搜索条 -->
    <view class="search">
      <input v-model="searchContent" class="search-input" placeholder="搜索商品" />
      <text @tap="searchGoods" class="icon-search" style="width: 20px; height: auto"></text>
    </view>
  </view>
  <!--  <CustomNavbar />-->
  <scroll-view
    refresher-enabled="true"
    scroll-y="true"
    class="scroll-view"
    @refresherrefresh="onRefresherRefresh"
    :refresher-triggered="isTriggered"
    @scrolltolower="onScrollToLower"
  >
    <!--  自定义轮播图-->
    <HomeSwiper :list="AdvertisementList" />
    <!--  组件-->
    <QuickPanel />
    <!--  热门推荐-->
    <HotPanel :list="discountActivityList" />
    <!--猜你喜欢-->
    <HomeGuess ref="goodsRef" />
  </scroll-view>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
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

.logo-font {
  font-size: 50rpx;
  color: #fff;
  font-family: '微软雅黑', serif;
}

/* 自定义导航条 */
.navbar {
  background-image: url(@/static/images/navigator_bg3.png);
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    padding-top: 20rpx;

    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }

  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }
}
</style>
