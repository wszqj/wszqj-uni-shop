<script setup lang="ts">
import type { OrderItem, OrderListParams, PaymentSlipParams } from '@/types/order'
import { onMounted, ref, watch } from 'vue'
import { OrderState, orderStateList } from '@/api/constants'
import {
  applyPaymentSlipAPI,
  deleteOrderAPI,
  getOrderDetailAPI,
  getOrderListAPI,
  payOrderAPI,
} from '@/api/order'
import { baseImgUrl } from '@/constants'
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

// 定义 props
const props = defineProps<{
  orderState: number
}>()

// 请求参数
const queryParams: OrderListParams = {
  page: 1,
  pageSize: 5,
  orderState: props.orderState,
}
// 是否已经加载完全
const finish = ref(false)

// 获取订单列表
const orderList = ref<OrderItem[]>([])
// 请求数据函数
const getMemberOrderData = async () => {
  // 如果已经加载完成或者请求中，则不发起请求
  if (finish.value) return
  try {
    const res = await getOrderListAPI(queryParams)
    // 如果是第一页，直接替换数据
    if (queryParams.page === 1) {
      orderList.value = res.result.records
    } else {
      // 如果不是第一页，追加数据
      orderList.value.push(...res.result.records)
    }
    // 更新加载状态
    finish.value = res.result.pages <= queryParams.page
  } catch (error) {
    // 可以增加错误处理逻辑
    console.error('获取订单列表失败', error)
  }
}

// 监听 props.orderState 的变化
watch(
  () => props.orderState,
  (newOrderState) => {
    console.log('监听到了~~~')
    // 更新请求参数
    queryParams.orderState = newOrderState
    queryParams.page = 1
    finish.value = false
    // 清空订单列表并重新请求数据
    orderList.value = []
  },
)

// 滚动触底事件
const onScrolltolower = async () => {
  if (finish.value) {
    return uni.showToast({
      icon: 'none',
      title: '没有更多数据了~',
    })
  }
  // 调用api
  const res = await getOrderListAPI(queryParams)
  // 如果是第一页，直接替换数据
  if (queryParams.page === 1) {
    orderList.value = res.result.records
  } else {
    // 如果不是第一页，追加数据
    orderList.value.push(...res.result.records)
  }
  // 更新加载状态
  finish.value = res.result.pages <= queryParams.page
  queryParams.page++
}

// 初始化数据
onMounted(() => {
  getMemberOrderData()
})

// 订单支付
const onOrderPay = async (orderId: string) => {
  // 获取订单详情
  const orderRes = await getOrderDetailAPI(orderId)
  // 准备请求参数
  const params: PaymentSlipParams = {
    paymentNo: orderId,
    paymentType: 1,
    orderId: orderId,
    amount: orderRes.result.payMoney,
    paymentStatus: 1,
  }
  // 生成支付交易单
  const applyRes = await applyPaymentSlipAPI(params)
  if (applyRes.code !== '0') {
    return uni.showToast({
      icon: 'none',
      title: applyRes.msg || '支付失败，请重试',
    })
  }
  // 模拟支付确认对话框
  uni.showModal({
    content: `确认付款 ￥ ${orderRes.result.payMoney.toFixed(2)} 元`,
    success: async (res) => {
      if (res.confirm) {
        // 尝试模拟支付
        const payRes = await payOrderAPI(applyRes.result, orderId, 1)
        if (payRes.code !== '0') {
          return uni.showToast({
            icon: 'none',
            title: payRes.msg || '支付失败，请重试',
          })
        }
        // 跳转到订单支付详情页面并关闭当前页面
        uni.redirectTo({ url: `/pagesOrder/payment/payment?id=${orderId}` })
      } else if (res.cancel) {
        // 用户取消支付，跳转到订单列表页面
        uni.redirectTo({ url: `/pagesOrder/list/list` })
      }
    },
  })
}

// 删除订单
const onOrderDelete = (orderId: string) => {
  uni.showModal({
    content: '确认删除该订单吗？',
    success: async (res) => {
      if (res.confirm) {
        const res = await deleteOrderAPI(orderId)
        if (res.code !== '0') {
          return uni.showToast({
            icon: 'none',
            title: res.msg || '删除失败，请重试',
          })
        }
        // 删除成功后，重新获取订单列表
        await getMemberOrderData()
      }
    },
  })
}
</script>

<template>
  <scroll-view @scrolltolower="onScrolltolower" scroll-y="true" class="orders">
    <view class="card" v-for="order in orderList" :key="order.orderId">
      <!-- 订单信息 -->
      <view class="status">
        <text class="date">{{ order.createAt }}</text>
        <!-- 订单状态文字 -->
        <text>{{ orderStateList[order.orderState].text }}</text>
        <!-- 待评价/已完成/已取消 状态: 展示删除订单 -->
        <text
          v-if="order.orderState >= OrderState.DaiPingJia"
          class="icon-delete"
          @tap="onOrderDelete(order.orderId)"
        >
          删除订单
        </text>
      </view>
      <!-- 商品信息，点击商品跳转到订单详情，不是商品详情 -->
      <navigator
        class="goods"
        :url="`/pagesOrder/detail/detail?id=${order.orderId}`"
        hover-class="none"
      >
        <view class="cover">
          <image mode="aspectFit" :src="baseImgUrl + order.skuImg"></image>
        </view>
        <view class="meta">
          <view class="name ellipsis">{{ order.skuName }}</view>
          <view class="type">{{ order.skuAttrsText }}</view>
        </view>
      </navigator>
      <!-- 支付信息 -->
      <view class="payment">
        <text class="quantity">共{{ order.count }}件商品</text>
        <text>实付</text>
        <text class="amount">
          <text class="symbol">¥</text>
          {{ order.totalPrice }}
        </text>
      </view>
      <!-- 订单操作按钮 -->
      <view class="action">
        <!-- 待付款状态：显示去支付按钮 -->
        <template v-if="order.orderState === OrderState.DaiFuKuan">
          <view class="button primary" @tap="onOrderPay(order.orderId)">去支付</view>
        </template>
        <template v-else>
          <navigator
            class="button secondary"
            :url="`/pagesOrder/create/create?orderId=${order.orderId}`"
            hover-class="none"
          >
            再次购买
          </navigator>
          <!-- 待收货状态: 展示确认收货 -->
          <view v-if="order.orderState === OrderState.DaiShouHuo" class="button primary"
            >确认收货
          </view>
        </template>
      </view>
    </view>
    <!-- 底部提示文字 -->
    <view class="loading-text" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
      {{ finish || orderList.length === 0 ? '没有更多数据~' : '正在加载...' }}
    </view>
  </scroll-view>
</template>
<style lang="scss">
// 订单列表
.orders {
  .card {
    min-height: 100rpx;
    padding: 20rpx;
    margin: 20rpx 20rpx 0;
    border-radius: 10rpx;
    background-color: #fff;

    &:last-child {
      padding-bottom: 40rpx;
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 15rpx;

    .date {
      color: #666;
      flex: 1;
    }

    .primary {
      color: #ff9240;
    }

    .icon-delete {
      line-height: 1;
      margin-left: 10rpx;
      padding-left: 10rpx;
      border-left: 1rpx solid #e3e3e3;
    }
  }

  .goods {
    display: flex;
    margin-bottom: 20rpx;

    .cover {
      width: 170rpx;
      height: 170rpx;
      margin-right: 20rpx;
      border-radius: 10rpx;
      overflow: hidden;
      position: relative;
    }

    .quantity {
      position: absolute;
      bottom: 0;
      right: 0;
      line-height: 1;
      padding: 6rpx 4rpx 6rpx 8rpx;
      font-size: 24rpx;
      color: #fff;
      border-radius: 10rpx 0 0 0;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .type {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 10rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .more {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #333;
    }
  }

  .payment {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    line-height: 1;
    padding: 20rpx 0;
    text-align: right;
    color: #999;
    font-size: 28rpx;
    border-bottom: 1rpx solid #eee;

    .quantity {
      font-size: 24rpx;
      margin-right: 16rpx;
    }

    .amount {
      color: #444;
      margin-left: 6rpx;
    }

    .symbol {
      font-size: 20rpx;
    }
  }

  .action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 20rpx;

    .button {
      width: 180rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 20rpx;
      border-radius: 60rpx;
      border: 1rpx solid #ccc;
      font-size: 26rpx;
      color: #444;
    }

    .secondary {
      color: #27ba9b;
      border-color: #27ba9b;
    }

    .primary {
      color: #fff;
      background-color: #27ba9b;
    }
  }

  .loading-text {
    text-align: center;
    font-size: 28rpx;
    color: #666;
    padding: 20rpx 0;
  }
}
</style>
