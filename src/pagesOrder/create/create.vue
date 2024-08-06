<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  buyNowAPI,
  createOrderAPI,
  getOrderPreAgainAPI,
  getOrderPreAPI,
  payOrderAPI,
} from '@/api/order'
import { onLoad } from '@dcloudio/uni-app'
import type { OrderPreResult } from '@/types/order'
import { useSelectedAddress } from '@/stores/modules/address'
import { baseImgUrl } from '@/constants'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 订单备注
const buyerMessage = ref('')
// 配送时间
const deliveryList = ref([
  { type: 1, text: '时间不限 (周一至周日)' },
  { type: 2, text: '工作日送 (周一至周五)' },
  { type: 3, text: '周末配送 (周六至周日)' },
])
// 当前配送时间下标
const activeIndex = ref(0)
// 当前配送时间
const activeDelivery = computed(() => deliveryList.value[activeIndex.value])
// 修改配送时间
const onChangeDelivery: UniHelper.SelectorPickerOnChange = (ev) => {
  activeIndex.value = ev.detail.value
}

// 页面参数
const query = defineProps<{
  skuId?: string
  count?: string
  orderId?: string
}>()

// 预支付交易单
const orderPre = ref<OrderPreResult>()
// 生成预支付订单
const getOrderPre = async () => {
  if (query?.count && query?.skuId) {
    // 立即购买
    const res = await buyNowAPI(query.skuId, query.count)
    orderPre.value = res.result
  } else if (query?.orderId) {
    // 再次购买
    const res = await getOrderPreAgainAPI(query.orderId)
    orderPre.value = res.result
  } else {
    // 获取预支付订单
    const res = await getOrderPreAPI()
    orderPre.value = res.result
  }
}
// 获取收货地址
const addressStore = useSelectedAddress()
// 计算默认地址
const selectedAddress = computed(() => {
  return addressStore.selectedAddress || orderPre.value?.userAddresses!.find((v) => v.status == 1)!
})

// 创建订单
const createOrder = async () => {
  // 检查是否选择了收货地址
  if (!selectedAddress.value?.id) {
    return uni.showToast({ icon: 'none', title: '请选择收货地址' })
  }

  // 创建订单 API 调用
  const createOrderResponse = await createOrderAPI({
    addressId: selectedAddress.value.id,
    buyMsg: buyerMessage.value,
    deliveryTimeType: activeDelivery.value.type,
    goods: orderPre.value!.goods.map((item) => ({ count: item.count, skuId: item.skuId })),
    payChannel: 2,
    payType: 1,
  })

  // 错误处理
  if (createOrderResponse.code !== '0') {
    return uni.showToast({
      icon: 'none',
      title: createOrderResponse.msg || '创建订单失败',
    })
  }
  // 获取订单 ID
  const orderId = createOrderResponse.result
  // 模拟支付确认对话框
  uni.showModal({
    content: `确认付款 ￥${orderPre.value?.summary.totalPayPrice.toFixed(2)}元`,
    success: async (res) => {
      if (res.confirm) {
        try {
          // 模拟支付成功
          await payOrderAPI(orderId)
          // 跳转到订单支付详情页面并关闭当前页面
          uni.redirectTo({ url: `/pagesOrder/payment/payment?id=${orderId}` })
        } catch (error) {
          uni.showToast({ icon: 'none', title: '支付失败，请重试' })
        }
      } else if (res.cancel) {
        // 用户取消支付，跳转到订单列表页面
        uni.redirectTo({ url: `/pagesOrder/list/list` })
      }
    },
  })
}

// 加载数据
onLoad(() => {
  getOrderPre()
})
</script>

<template>
  <scroll-view scroll-y class="viewport">
    <!-- 收货地址 -->
    <navigator
      v-if="selectedAddress"
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="user"> {{ selectedAddress.consignee }} {{ selectedAddress.phone }}</view>
      <view class="address"> {{ selectedAddress.fullLocation }} {{ selectedAddress.address }}</view>
      <text class="icon icon-right"></text>
    </navigator>
    <navigator
      v-else
      class="shipment"
      hover-class="none"
      url="/pagesMember/address/address?from=order"
    >
      <view class="address"> 请选择收货地址</view>
      <text class="icon icon-right"></text>
    </navigator>

    <!-- 商品信息 -->
    <view class="goods">
      <navigator
        v-for="goods in orderPre?.goods"
        :key="goods.skuId"
        :url="`/pages/goods/goods?id=${goods.id}`"
        class="item"
        hover-class="none"
      >
        <image class="picture" :src="baseImgUrl + goods.image" />
        <view class="meta">
          <view class="name ellipsis"> {{ goods.name }}</view>
          <view class="attrs">{{ goods.attrsText }}</view>
          <view class="prices">
            <view class="pay-price symbol">{{ goods.price }}</view>
            <view class="price symbol">{{ goods.payPrice }}</view>
          </view>
          <view class="count">x{{ goods.count }}</view>
        </view>
      </navigator>
    </view>

    <!-- 配送及支付方式 -->
    <view class="related">
      <view class="item">
        <text class="text">配送时间</text>
        <picker :range="deliveryList" range-key="text" @change="onChangeDelivery">
          <view class="icon-fonts picker">{{ activeDelivery.text }}</view>
        </picker>
      </view>
      <view class="item">
        <text class="text">订单备注</text>
        <input
          class="input"
          :cursor-spacing="30"
          placeholder="选题，建议留言前先与商家沟通确认"
          v-model="buyerMessage"
        />
      </view>
    </view>

    <!-- 支付金额 -->
    <view class="settlement">
      <view class="item">
        <text class="text">商品总价:</text>
        <text class="number symbol">{{ orderPre?.summary.totalPayPrice.toFixed(2) }}</text>
      </view>
      <view class="item">
        <text class="text">运费:</text>
        <text class="number symbol">{{ orderPre?.summary.postFee }}</text>
      </view>
    </view>
  </scroll-view>

  <!-- 吸底工具栏 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="total-pay symbol">
      <text class="number">{{ orderPre?.summary.totalPayPrice.toFixed(2) }}</text>
    </view>
    <view
      class="button"
      :class="{ disabled: selectedAddress ? '' : 'disabled' }"
      @tap="createOrder"
    >
      提交订单
    </view>
  </view>
</template>

<style lang="scss">
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background-color: #f4f4f4;
}

.symbol::before {
  content: '¥';
  font-size: 80%;
  margin-right: 5rpx;
}

.shipment {
  margin: 20rpx;
  padding: 30rpx 30rpx 30rpx 84rpx;
  font-size: 26rpx;
  border-radius: 10rpx;
  background: url(https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/images/locate.png)
    20rpx center / 50rpx no-repeat #fff;
  position: relative;

  .icon {
    font-size: 36rpx;
    color: #333;
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20rpx;
  }

  .user {
    color: #333;
    margin-bottom: 5rpx;
  }

  .address {
    color: #666;
  }
}

.goods {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    padding: 30rpx 0;
    border-top: 1rpx solid #eee;

    &:first-child {
      border-top: none;
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .name {
      height: 80rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrs {
      line-height: 1.8;
      padding: 0 15rpx;
      margin-top: 6rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .prices {
      display: flex;
      align-items: baseline;
      margin-top: 6rpx;
      font-size: 28rpx;

      .pay-price {
        margin-right: 10rpx;
        color: #cf4444;
      }

      .price {
        font-size: 24rpx;
        color: #999;
        text-decoration: line-through;
      }
    }

    .count {
      position: absolute;
      bottom: 0;
      right: 0;
      font-size: 26rpx;
      color: #444;
    }
  }
}

.related {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .input {
    flex: 1;
    text-align: right;
    margin: 20rpx 0;
    padding-right: 20rpx;
    font-size: 26rpx;
    color: #999;
  }

  .item .text {
    width: 125rpx;
  }

  .picker {
    color: #666;
  }

  .picker::after {
    content: '\e6c2';
  }
}

/* 结算清单 */
.settlement {
  margin: 20rpx;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    font-size: 26rpx;
    color: #333;
  }

  .danger {
    color: #cf4444;
  }
}

/* 吸底工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: calc(var(--window-bottom));
  z-index: 1;

  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx;
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .total-pay {
    font-size: 40rpx;
    color: #cf4444;

    .decimal {
      font-size: 75%;
    }
  }

  .button {
    width: 220rpx;
    text-align: center;
    line-height: 72rpx;
    font-size: 26rpx;
    color: #fff;
    border-radius: 72rpx;
    background-color: #27ba9b;
  }

  .disabled {
    opacity: 0.6;
  }
}
</style>
