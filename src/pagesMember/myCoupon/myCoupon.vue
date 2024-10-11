<script setup lang="ts">
// 读取页面参数
import { ref } from 'vue'
import type { CouponItem } from '@/types/coupon'
import coupons from '@/components/coolc/coolc-coupon.vue'
import { getCurrentUserCouponsAPI } from '@/api/coupons'
import { onShow } from '@dcloudio/uni-app'
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
// 页面显示时加载
onShow(() => {
  getCurrentUserCoupons()
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
  </scroll-view>
  <up-toast position="top" ref="uToastRef"></up-toast>
</template>

<style lang="scss">
.coupon-item {
  width: 100%;
  height: auto;
  display: table;
  border-radius: 10upx;
  padding: 0 20upx;
  margin-top: 22upx;
  border: 1px solid #eeeeee;
  position: relative;

  .coupon-money {
    width: 465upx;
    height: auto;
    display: table;
    float: left;
    padding: 26upx 0;
    border-style: none dotted none none;
    border-color: #eeeeee;

    .nick {
      width: 100%;
      height: 50upx;
      line-height: 30upx;
      font-size: 24upx;
      color: #999999;
    }

    .tit {
      width: 100%;
      height: 50upx;
      line-height: 50upx;
      font-size: 24upx;
      color: #999999;
    }

    .demand {
      width: 100%;
      height: 30upx;
      line-height: 30upx;
      font-size: 24upx;
      color: #999999;
    }

    .layof {
      width: 100%;
      height: 48upx;
      line-height: 30upx;
      font-size: 44upx;
      color: #ff9000;
      font-weight: bold;
    }

    .end_time {
      width: 100%;
      height: 30upx;
      line-height: 30upx;
      font-size: 24upx;
      color: #999999;
    }
  }

  .get-btn {
    width: 146upx;
    height: 52upx;
    line-height: 50upx;
    position: absolute;
    top: 50%;
    right: 26upx;
    margin-top: -26upx;
    text-align: center;
    border-radius: 60upx;
    color: #ff9000;
    border: 1px solid #ff9000;
    font-size: 24upx;
    float: right;
  }
}

.coupon-item:after {
  width: 40upx;
  height: 20upx;
  position: absolute;
  left: 460upx;
  top: -1px;
  border-radius: 0 0 40upx 40upx;
  content: '';
  display: block;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-top: 0px;
}

.coupon-item:before {
  width: 40upx;
  height: 20upx;
  position: absolute;
  left: 460upx;
  bottom: -1px;
  border-radius: 40upx 40upx 0 0;
  content: '';
  display: block;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-bottom: 0px;
}
</style>
