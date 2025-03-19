<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getShopInfoAPI } from '@/api/shopInfo'
import type { ShopInfo } from '@/types/shopInfo'
import { baseImgUrl, getFullImageUrl } from '@/constants'
import MoveLoading from '@/components/MoveLoading.vue'
import { onShow } from '@dcloudio/uni-app'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 店铺信息
const shopInfo = ref<ShopInfo>({} as ShopInfo)
// 获取店铺信息
const getShopInfo = async () => {
  const res = await getShopInfoAPI()
  shopInfo.value = res.result
  // 图片解析
  shopInfo.value.images = JSON.parse(shopInfo.value.images)
  console.log(shopInfo.value)
}
// 唤起手机拨号
const callPhone = () => {
  // 唤起手机拨号
  wx.makePhoneCall({
    phoneNumber: shopInfo.value.phone,
  })
}
// 唤起腾讯地图
const getMap = async () => {
  // 请求用户位置权限
  const authResult = await uni.authorize({
    scope: 'scope.userLocation',
  })
  if (authResult) {
    // 如果授权成功，打开地图
    uni.openLocation({
      latitude: 34.538148,
      longitude: 115.197911,
      name: '巨豪家具装饰有限公司',
      success: (openLocationRes) => {
        console.log('地图打开成功', openLocationRes)
        return uni.showToast({ icon: 'success', title: '地图查询成功' })
        // 注意：这里的res是uni.authorize的回调参数，不是uni.openLocation的
        // 如果您需要打印uni.openLocation的结果，应该使用上面的openLocationRes
      },
      fail: (err) => {
        console.error('地图打开失败', err)
        return uni.showToast({ icon: 'error', title: '地图查询失败' })
      },
    })
  } else {
    console.log('用户未授权位置信息')
    return uni.showToast({ icon: 'error', title: '用户未授权位置信息' })
  }
}
// 是否在刷新中
const isTriggered = ref(false)
// 下拉刷新
const onRefresherRefresh = async () => {
  isTriggered.value = true
  // 重新加载数据
  await Promise.all([getShopInfo()])
  isTriggered.value = false
}
const loadingStatus = ref(false)
// 加载信息
onShow(async () => {
  loadingStatus.value = true
  await Promise.race([
    getShopInfo().finally(() => {
      if (!loadingStatus.value) {
        return
      }
      loadingStatus.value = false
    }),
  ])
  if (!loadingStatus.value) {
    return
  }
  loadingStatus.value = false
})
</script>
<template>
  <scroll-view
    refresher-enabled="true"
    scroll-y="true"
    class="scroll-view"
    @refresherrefresh="onRefresherRefresh"
    :refresher-triggered="isTriggered"
  >
    <view>
      <up-notice-bar :text="shopInfo.notice" mode="closable"></up-notice-bar>
    </view>
    <view v-if="shopInfo">
      <up-card
        :title="shopInfo.shopDesc"
        :sub-title="shopInfo.name"
        :thumb="shopInfo.logoIcon"
        :border="true"
      >
        <template #body>
          <view class="">
            <view class="u-body-item u-flex">
              <up-copy :content="shopInfo.address">
                地址：
                <up-text :text="shopInfo.address" type="info" align="left"></up-text>
              </up-copy>
              <up-text text="导航" type="primary" align="right" @tap="getMap"></up-text>
            </view>
            <view class="u-body-item u-flex">
              <up-copy :content="shopInfo.phone">
                手机：
                <up-text :text="shopInfo.phone" type="info" align="left"></up-text>
              </up-copy>
              <up-text text="呼叫" type="primary" align="right" @tap="callPhone"></up-text>
            </view>
          </view>
        </template>
      </up-card>
      <up-text text="店铺图片" bold="bold" type="primary" size="20" align="center"></up-text>
      <up-divider text="分割线" :dot="true"></up-divider>
      <view style="margin-top: 10rpx">
        <up-lazy-load
          v-for="item in shopInfo.images"
          :key="item"
          :image="getFullImageUrl(item)"
          border-radius="20"
        ></up-lazy-load>
      </view>
      <up-divider
        :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
        text="没有更多了"
      ></up-divider>
    </view>
    <view v-else>
      <up-divider text="暂无店铺信息"></up-divider>
    </view>
    <!--  加载动画-->
    <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
  </scroll-view>
</template>
<style scoped lang="scss">
.u-card-wrap {
  padding: 1px;
}

.u-body-item {
  font-size: 32rpx;
  color: #333;
  padding: 20rpx 10rpx;
}
</style>
