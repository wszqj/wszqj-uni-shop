<script setup lang="ts">
import { ref } from 'vue'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const title = ref('一站式购物，服务一流')
const subTitle = ref('巨豪家具')
const welcomeText = ref('巨豪家具，欢迎您')

const thumb = ref(
  'https://img12.360buyimg.com/n7/jfs/t1/102191/19/9072/330688/5e0af7cfE17698872/c91c00d713bf729a.jpg',
)

// 店铺图片列表
const list = ref([
  {
    src: 'https://gtd.alicdn.com/sns_logo/i1/TB124_3NXXXXXasXVXXSutbFXXX.jpg_240x240xz.jpg',
  },
  {
    src: 'https://gtd.alicdn.com/sns_logo/i7/TB1IWtgQFXXXXcmXFXXSutbFXXX.jpg_240x240xz.jpg',
  },
  {
    src: 'https://gtd.alicdn.com/sns_logo/i1/TB1_f_PLXXXXXbVXpXXSutbFXXX.jpg_240x240xz.jpg',
  },
])
</script>
<template>
  <view>
    <up-notice-bar :text="welcomeText"></up-notice-bar>
  </view>
  <up-card :title="title" :sub-title="subTitle" :thumb="thumb" :border="true">
    <template #body>
      <view class="">
        <view class="u-body-item u-flex">
          <up-copy content="北京市东城区东华门街道">
            <up-text text="地址：北京市东城区东华门街道" type="info" align="left"></up-text>
          </up-copy>
          <up-text text="导航" type="primary" align="right"></up-text>
        </view>
        <view class="u-body-item u-flex">
          <up-copy content="16666666666">
            <up-text text="手机：16666666666" type="info" align="left"></up-text>
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
      v-for="(item, index) in list"
      :key="index"
      :image="item.src"
      border-radius="20"
    ></up-lazy-load>
  </view>
  <up-divider
    :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }"
    text="没有更多了"
  ></up-divider>
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
