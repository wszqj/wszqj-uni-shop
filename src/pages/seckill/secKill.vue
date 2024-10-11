<script setup lang="ts">
import coupons from '@/pages/seckill/coolc/coolc-coupon.vue'
import { ref } from 'vue'
import type { CouponItem } from '@/types/coupon'
import { onShow } from '@dcloudio/uni-app'
import { getCouponListAPI } from '@/api/coupons'
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
onShow(() => {
  getCouponList()
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
  </scroll-view>
</template>
<up-empty mode="coupon" icon="http://cdn.uviewui.com/uview/empty/coupon.png" v-else></up-empty>
<style lang="scss">
page {
  background: #ffffff;
}

.coupon_box {
  width: 100%;
  height: 100%;
  display: table;
  padding: 6upx 26upx 26upx 26upx;
}

.other_type {
  width: 100%;
  height: 90upx;
  padding-top: 50upx;

  .text {
    width: 100%;
    border-top: 1px solid #eeeeee;
    display: block;
    text-align: center;
    position: relative;
  }

  .text span {
    width: 180upx;
    height: 40upx;
    line-height: 40upx;
    color: #999999;
    display: block;
    background: #ffffff;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -90upx;
    margin-top: -20upx;
    font-size: 28upx;
  }
}
</style>
