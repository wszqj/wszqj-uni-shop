<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getShopInfoAPI } from '@/api/shopInfo'
import type { ShopInfo } from '@/types/shopInfo'
import { baseImgUrl } from '@/constants'
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
// 加载信息
onMounted(() => {
  getShopInfo()
})
</script>
<template>
  <view>
    <up-notice-bar :text="shopInfo.notice"></up-notice-bar>
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
            <up-text text="导航" type="primary" align="right"></up-text>
          </view>
          <view class="u-body-item u-flex">
            <up-copy :content="shopInfo.phone">
              手机：
              <up-text :text="shopInfo.phone" type="info" align="left"></up-text>
            </up-copy>
            <up-text text="呼叫" type="primary" align="right"></up-text>
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
        :image="baseImgUrl + item"
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
