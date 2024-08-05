<script setup lang="ts">
import { userGuessList } from '@/composables'
import HomeGuess from '@/components/HomeGuess.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 获取页面参数
const query = defineProps<{
  id: string
}>()
// 跳转的url动态指定
const url = ref<string>('')
// 切割id
const splitId = () => {
  try {
    const ids = query.id.split(',')
    const secondId = ids.length > 1 ? ids[1] : null
    if (secondId) {
      url.value = `/pagesOrder/list/list`
    } else {
      url.value = `/pagesOrder/detail/detail?id=${query.id}`
    }
  } catch (error) {
    // 处理可能出现的任何错误
    uni.showToast({ icon: 'none', title: '加载失败' })
    url.value = `/pagesOrder/list/list`
  }
}

// 页面加载时执行
onLoad(() => {
  splitId()
})
// 猜你喜欢
const { guessRef, onScrolltolower } = userGuessList()
</script>

<template>
  <scroll-view class="viewport" scroll-y @scrolltolower="onScrolltolower">
    <!-- 订单状态 -->
    <view class="overview">
      <view class="status icon-checked">支付成功</view>
      <view class="buttons">
        <navigator
          hover-class="none"
          class="button navigator"
          url="/pages/index/index"
          open-type="switchTab"
        >
          返回首页
        </navigator>
        <navigator hover-class="none" class="button navigator" :url="url" open-type="redirect">
          查看订单
        </navigator>
      </view>
    </view>

    <!-- 猜你喜欢 -->
    <HomeGuess ref="guessRef" />
  </scroll-view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.viewport {
  background-color: #f7f7f8;
}

.overview {
  line-height: 1;
  padding: 50rpx 0;
  color: #fff;
  background-color: #27ba9b;

  .status {
    font-size: 36rpx;
    font-weight: 500;
    text-align: center;
  }

  .status::before {
    display: block;
    font-size: 110rpx;
    margin-bottom: 20rpx;
  }

  .buttons {
    height: 60rpx;
    line-height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60rpx;
  }

  .button {
    text-align: center;
    margin: 0 10rpx;
    font-size: 28rpx;
    color: #fff;

    &:first-child {
      width: 200rpx;
      border-radius: 64rpx;
      border: 1rpx solid #fff;
    }
  }
}
</style>
