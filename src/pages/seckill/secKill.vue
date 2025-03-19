<script setup lang="ts">
import coupons from '@/pages/seckill/coolc/coolc-coupon.vue'
import { ref } from 'vue'
import type { CouponItem } from '@/types/coupon'
import { onShow } from '@dcloudio/uni-app'
import { getCouponListAPI } from '@/api/coupons'
import MoveLoading from '@/components/MoveLoading.vue'
// 刷新动画是否显示
const isTriggered = ref(false)
const couponList = ref<CouponItem[]>([])
// 查询在售或可领取的优惠券
const getCouponList = async () => {
  // 调用api接口
  const res = await getCouponListAPI()
  couponList.value = res.result
  console.log(couponList)
}
const loadingStatus = ref(false)
onShow(async () => {
  loadingStatus.value = true
  await Promise.race([
    getCouponList().finally(() => {
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
  await getCouponList()
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
        theme="#ff6c00"
        color="#ffffff"
        solid="#ff6c00"
      ></coupons>
    </view>
    <up-empty
      class="coupon_box"
      mode="coupon"
      icon="http://cdn.uviewui.com/uview/empty/coupon.png"
      v-else
    ></up-empty>
    <!--  加载动画-->
    <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
  </scroll-view>
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
</style>
