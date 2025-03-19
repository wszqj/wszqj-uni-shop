<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import {
  deleteCartItemAPI,
  getCartListAPI,
  updateCartAllCheckedAPI,
  updateCartItemAPI,
} from '@/api/cart'
import { useMemberStore } from '@/stores'
import vkDataInputNumberBox from '@/components/vk-data-input-number-box/vk-data-input-number-box.vue'
import { baseImgUrl, getFullImageUrl } from '@/constants'
import MoveLoading from '@/components/MoveLoading.vue'
// 获取系统信息
const { safeAreaInsets } = uni.getSystemInfoSync()
const safeArea = ref<number>(safeAreaInsets!.bottom)
// 下拉刷新状态
const isTriggered = ref(false)
// 获取页面参数
const props = defineProps<{
  type: string
}>()
// 下拉刷新
const onPullDownRefresh = async () => {
  // 开启动画
  isTriggered.value = true
  // 加载购物车列表
  await getCartList()
  // 关闭动画
  isTriggered.value = false
}
// 用户信息
const memberStore = useMemberStore()
// 判断页面类型，决定安全区的底部间距
const updateSafeArea = () => {
  // 更新 safeArea 值
  safeArea.value = props.type === '2' ? safeAreaInsets!.bottom : 0
}
// 购物车列表
const shoppingCart = ref<CartItem[]>([])
// 获取购物车列表
const getCartList = async () => {
  const res = await getCartListAPI()
  shoppingCart.value = res.result
}

// 修改选中状态
const onChangeSelected = async (item: CartItem) => {
  // 取反状态
  item.itemStatus = !item.itemStatus
  // 更新后端数据
  await updateCartItemAPI(item)
}

// 修改商品的数量
const onChangeCount = async (item: CartItem) => {
  // 调用API
  await updateCartItemAPI(item)
}

// 删除商品
const onDeleteAddress = async (id: number) => {
  const res = await deleteCartItemAPI(id)
  if (res.code) {
    await uni.showToast({ icon: 'success', title: res.msg })
  } else {
    await uni.showToast({ icon: 'error', title: res.msg })
  }
  await getCartList()
}

// 全选
const onChangeSelectedAll = async () => {
  // 取反 全选状态
  const _isSelectedAll = !isSelectedAll.value
  //  修改前端数据, 取消全选：isSelectedAll：true 取反 false -> 所有元素全变为 false 原本是 false 依旧是 false
  //               全选：isSelectedAll：false 取反 true -> 所有元素全变为 true 原本是 true 依旧是 true
  shoppingCart.value.forEach((item) => {
    item.itemStatus = _isSelectedAll
  })
  // 后端数据更新
  await updateCartAllCheckedAPI(_isSelectedAll)
}

// 计算当前是否全选
const isSelectedAll = computed(() => {
  return shoppingCart.value.length && shoppingCart.value.every((v) => v.itemStatus)
})

// 计算商品被选中的数量
const selectedCount = computed(() => {
  return shoppingCart.value.filter((v) => v.itemStatus).length
})

// 计算商品总价值并保留两位小数 状态为选中状态
const totalPrice = computed(() => {
  // 计算总价格
  const total = shoppingCart.value
    // 过滤出选中状态的元素
    .filter((v) => v.itemStatus)
    .reduce((total, item) => {
      // 将 item.itemPrice 从字符串转换为数字
      const price = parseFloat(item.itemPrice)
      // item.itemCount 已经是整数，所以直接使用
      return total + price * item.itemCount
    }, 0) // 0 是初始值
  // 保留两位小数
  return total.toFixed(2)
})

// 去结算
const toBuy = () => {
  // 如果未选商品
  if (selectedCount.value < 1) {
    uni.showToast({ icon: 'none', title: '请先选择商品' })
    return
  }
  // 跳转支付页面
  uni.navigateTo({ url: '/pagesOrder/create/create' })
}
const loadingStatus = ref(false)
// 组件显示时触发，进行安全区更新
onShow(() => {
  updateSafeArea()
  Promise.race([
    getCartList().finally(() => {
      // 这里我们只关心是否响应
      if (!loadingStatus.value) {
        return
      }
      loadingStatus.value = false
    }),
  ])
  // 这里我们只关心是否响应
  if (!loadingStatus.value) {
    return
  }
  loadingStatus.value = false
})

// 监听 props.type 的变化，以便在动态变化时也能更新
watch(
  () => props.type,
  () => {
    updateSafeArea()
  },
  { immediate: true }, // 确保在组件初始化时也会触发
)
</script>

<template>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
  <scroll-view
    refresher-enabled="true"
    :refresher-triggered="isTriggered"
    @refresherrefresh="onPullDownRefresh"
    :style="{ paddingBottom: safeArea + 'px' }"
    scroll-y="true"
    class="scroll-view"
  >
    <!-- 已登录: 显示购物车 -->
    <template v-if="memberStore?.profile">
      <!-- 购物车列表 -->
      <view class="cart-list" v-if="shoppingCart.length">
        <!-- 优惠提示 -->
        <view class="tips">
          <text class="label">满减</text>
          <text class="desc">满1件, 即可享受9折优惠</text>
        </view>
        <!-- 滑动操作分区 -->
        <uni-swipe-action>
          <!-- 滑动操作项 -->
          <uni-swipe-action-item v-for="item in shoppingCart" :key="item.itemId" class="cart-swipe">
            <!-- 商品信息 -->
            <view class="goods">
              <!-- 选中状态 -->
              <text
                class="checkbox"
                :class="{ checked: item.itemStatus }"
                @tap="onChangeSelected(item)"
              ></text>
              <navigator
                :url="`/pages/goods/goods?id=${item.goodsId}`"
                hover-class="none"
                class="navigator"
              >
                <image
                  mode="aspectFill"
                  class="picture"
                  :src="getFullImageUrl(item.itemImg)"
                ></image>
                <view class="meta">
                  <view class="name ellipsis">{{ item.goodsName }}</view>
                  <view class="attrsText ellipsis">{{ item.itemAttributeMsg }}</view>
                  <view class="price">{{ item.itemPrice }}</view>
                </view>
              </navigator>
              <!-- 商品数量 -->
              <view class="count">
                <vk-data-input-number-box
                  v-model="item.itemCount"
                  :min="1"
                  :max="item.itemStock"
                  :index="item.itemSkuId"
                  @change="onChangeCount(item)"
                />
              </view>
            </view>
            <!-- 右侧删除按钮 -->
            <template #right>
              <view class="cart-swipe-right">
                <button class="button delete-button" @tap="onDeleteAddress(item.itemId)">
                  删除
                </button>
              </view>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <!-- 购物车空状态 -->
      <view class="cart-blank" v-else>
        <image src="/static/images/blank_cart.png" class="image" />
        <text class="text">购物车还是空的，快来挑选好货吧</text>
        <navigator open-type="switchTab" url="/pages/index/index" hover-class="none">
          <button class="button">去首页看看</button>
        </navigator>
      </view>
      <!-- 吸底工具栏 -->
      <view class="toolbar" :style="{ paddingBottom: safeArea + 'px' }">
        <text class="all" :class="{ checked: isSelectedAll }" @tap="onChangeSelectedAll">全选</text>
        <text class="text">合计:</text>
        <text class="amount">{{ totalPrice }}</text>
        <view class="button-grounp">
          <view
            class="button payment-button"
            :class="{ disabled: selectedCount === 0 }"
            @tap="toBuy"
          >
            去结算({{ selectedCount }})
          </view>
        </view>
      </view>
    </template>
    <!-- 未登录: 提示登录 -->
    <view class="login-blank" v-else>
      <text class="text">登录后可查看购物车中的商品</text>
      <navigator url="/pages/login/login" hover-class="none">
        <button class="button">去登录</button>
      </navigator>
    </view>
    <!-- 底部占位空盒子 -->
    <view class="toolbar-height"></view>
  </scroll-view>
</template>

<style lang="scss">
// 根元素
:host {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f7f8;
}

// 滚动容器
.scroll-view {
  flex: 1;
}

// 购物车列表
.cart-list {
  padding: 0 20rpx;

  // 优惠提示
  .tips {
    display: flex;
    align-items: center;
    line-height: 1;
    margin: 30rpx 10rpx;
    font-size: 26rpx;
    color: #666;

    .label {
      color: #fff;
      padding: 7rpx 15rpx 5rpx;
      border-radius: 4rpx;
      font-size: 24rpx;
      background-color: #27ba9b;
      margin-right: 10rpx;
    }
  }

  // 购物车商品
  .goods {
    display: flex;
    padding: 20rpx 20rpx 20rpx 80rpx;
    border-radius: 10rpx;
    background-color: #fff;
    position: relative;

    .navigator {
      display: flex;
    }

    .checkbox {
      position: absolute;
      top: 0;
      left: 0;

      display: flex;
      align-items: center;
      justify-content: center;
      width: 80rpx;
      height: 100%;

      &::before {
        content: '\e6cd';
        font-family: 'erabbit' !important;
        font-size: 40rpx;
        color: #444;
      }

      &.checked::before {
        content: '\e6cc';
        color: #27ba9b;
      }
    }

    .picture {
      width: 170rpx;
      height: 170rpx;
    }

    .meta {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
    }

    .name {
      height: 72rpx;
      font-size: 26rpx;
      color: #444;
    }

    .attrsText {
      line-height: 1.8;
      padding: 0 15rpx;
      font-size: 24rpx;
      align-self: flex-start;
      border-radius: 4rpx;
      color: #888;
      background-color: #f7f7f8;
    }

    .price {
      line-height: 1;
      font-size: 26rpx;
      margin-bottom: 2rpx;
      color: #ff605c;

      &::before {
        content: '￥';
        font-size: 80%;
      }
    }

    // 商品数量
    .count {
      position: absolute;
      bottom: 20rpx;
      right: 5rpx;

      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 220rpx;
      height: 48rpx;

      .text {
        height: 100%;
        padding: 0 20rpx;
        font-size: 32rpx;
        color: #444;
      }

      .input {
        height: 100%;
        text-align: center;
        border-radius: 4rpx;
        font-size: 24rpx;
        color: #444;
        background-color: #f6f6f6;
      }
    }
  }

  .cart-swipe {
    display: block;
    margin: 20rpx 0;
  }

  .cart-swipe-right {
    display: flex;
    height: 100%;

    .button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      padding: 6px;
      line-height: 1.5;
      color: #fff;
      font-size: 26rpx;
      border-radius: 0;
    }

    .delete-button {
      background-color: #ff605c;
    }
  }
}

// 空状态
.cart-blank,
.login-blank {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;

  .image {
    width: 400rpx;
    height: 281rpx;
  }

  .text {
    color: #444;
    font-size: 26rpx;
    margin: 20rpx 0;
  }

  .button {
    width: 240rpx !important;
    height: 60rpx;
    line-height: 60rpx;
    margin-top: 20rpx;
    font-size: 26rpx;
    border-radius: 60rpx;
    color: #fff;
    background-color: #27ba9b;
  }
}

// 吸底工具栏
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: var(--window-bottom);
  z-index: 1;

  height: 100rpx;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  border-top: 1rpx solid #ededed;
  border-bottom: 1rpx solid #ededed;
  background-color: #fff;
  box-sizing: content-box;

  .all {
    margin-left: 25rpx;
    font-size: 14px;
    color: #444;
    display: flex;
    align-items: center;
  }

  .all::before {
    font-family: 'erabbit' !important;
    content: '\e6cd';
    font-size: 40rpx;
    margin-right: 8rpx;
  }

  .checked::before {
    content: '\e6cc';
    color: #27ba9b;
  }

  .text {
    margin-right: 8rpx;
    margin-left: 32rpx;
    color: #444;
    font-size: 14px;
  }

  .amount {
    font-size: 20px;
    color: #ff605c;

    .decimal {
      font-size: 12px;
    }

    &::before {
      content: '￥';
      font-size: 12px;
    }
  }

  .button-grounp {
    margin-left: auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    line-height: 72rpx;
    font-size: 13px;
    color: #fff;

    .button {
      width: 240rpx;
      margin: 0 10rpx;
      border-radius: 72rpx;
    }

    .payment-button {
      background-color: #27ba9b;

      &.disabled {
        opacity: 0.6;
      }
    }
  }
}

// 底部占位空盒子
.toolbar-height {
  height: 100rpx;
}
</style>
