<script setup lang="ts">
// 读取页面参数
import { ref } from 'vue'
import type { CouponItem } from '@/types/coupon'
import coupons from '@/components/coolc/coolc-coupon.vue'
import { getCurrentUserCouponsAPI } from '@/api/coupons'
import { onShow } from '@dcloudio/uni-app'
import MoveLoading from '@/components/MoveLoading.vue'
// 刷新动画是否显示
const isTriggered = ref(false)
// 信息提示框的实例化对象
const uToastRef = ref()
// 优惠券列表
const couponList = ref<CouponItem[]>([])
// 获取当前操作用户的优惠券列表
const getCurrentUserCoupons = async () => {
  // 调用api
  const res = await getCurrentUserCouponsAPI()
  // 解析返回结果
  if (res.code != '0') {
    return uToastRef.value.show({ message: res.msg ? res.msg : '加载失败', type: 'error' })
  }
  couponList.value = res.result
}
// 获取页面参数
const query = defineProps<{
  type: string
}>()
const loadingStatus = ref(false)
// 页面显示时加载
onShow(async () => {
  loadingStatus.value = true
  await Promise.race([
    getCurrentUserCoupons().finally(() => {
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
// 下拉刷新
const onRefresherRefresh = async () => {
  isTriggered.value = true
  // 加载数据
  await getCurrentUserCoupons()
  // 关闭动画
  isTriggered.value = false
}
</script>

<template>
  <scroll-view
    refresher-enabled="true"
    scroll-y="true"
    class="scroll-view"
    @refresherrefresh="onRefresherRefresh"
    :refresher-triggered="isTriggered"
  >
    <view class="coupon_box" v-if="couponList.length > 0">
      <coupons
        v-for="(item, index) in couponList"
        :key="index"
        v-bind:item="item"
        :types="query.type"
        theme="#ff6c00"
        color="#ffffff"
        solid="#ff6c00"
      ></coupons>
    </view>
    <up-empty
      class="coupon_empty"
      mode="coupon"
      icon="http://cdn.uviewui.com/uview/empty/coupon.png"
      v-else
    ></up-empty>
  </scroll-view>
  <up-toast position="top" ref="uToastRef"></up-toast>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
</template>
<style lang="scss">
page {
  background: #ffffff;
}

.coupon_box {
  width: 100%;
  height: 100vh;
  display: table;
  padding: 6upx 26upx 26upx 26upx;
}

.coupon_empty {
  width: 100%;
  height: 100vh;
}
</style>
