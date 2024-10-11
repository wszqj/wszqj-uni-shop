<script setup lang="ts">
import { defineProps, ref } from 'vue'
import type { CouponItem } from '@/types/coupon'
import { receiveCouponAPI } from '@/api/coupons'

// 信息提示框的实例化对象
const uToastRef = ref()

// 领取优惠券
const receiveCoupon = async (id: number) => {
  const res = await receiveCouponAPI(id)
  // 处理领取失败的情况
  if (res.code != '0') {
    return uToastRef.value.show({ message: res.msg ? res.msg : '领取失败', type: 'error' })
  }
  // 领取成功
  return uToastRef.value.show({ message: res.msg ? res.msg : '领取成功', type: 'success' })
}
// 使用优惠券
const useCoupon = async () => {
  return uni.navigateTo({ url: '/pages/hot/hot' })
}
defineProps<{
  item: CouponItem
  types?: string
  theme: string
  solid: string
  color: string
}>()
</script>
<template>
  <view class="coupon-item">
    <view class="coupon-money">
      <view class="nick">{{ item.sellerName }}使用</view>
      <view class="layof" :style="{ color: theme }">￥{{ item.money }}</view>
      <template v-if="types">
        <view class="time">{{ item.endTime }}前使用</view>
        <view class="tit">券号：{{ item.ticket }}</view>
      </template>
      <template v-else>
        <view class="time">{{ item.beginTime }}开始领取</view>
      </template>
      <view class="demand">{{ item.title }}</view>
    </view>
    <navigator
      class="get-btn"
      v-if="!types"
      :style="{ color: color, borderColor: color, backgroundColor: solid }"
      @tap="receiveCoupon(item.id)"
      >立即领取
    </navigator>
    <navigator
      class="get-btn"
      v-else
      :style="{ color: color, borderColor: color, backgroundColor: solid }"
      @tap="useCoupon"
      >立即使用
    </navigator>
    <up-toast position="top" ref="uToastRef"></up-toast>
  </view>
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

    .time {
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
