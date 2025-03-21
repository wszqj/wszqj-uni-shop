<script setup lang="ts">
// 导入所需模块和类型
import { computed, ref } from 'vue'
import { getGoodsDetailAPI } from '@/api/home'
import type { GoodsDetail } from '@/types/home'
import type {
  SkuPopupEvent,
  SkuPopupInstanceType,
  SkuPopupLocaldata,
} from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'
import { onShow } from '@dcloudio/uni-app'
import { baseImgUrl, getFullImageUrl } from '@/constants'
import { addShoppingCartItemAPI } from '@/api/cart'
import MoveLoading from '@/components/MoveLoading.vue'
// 获取系统信息
const { safeAreaInsets } = uni.getSystemInfoSync()

// 定义组件的 props
const props = defineProps<{
  id: number
}>()

// SKU 模式枚举
enum SkuMode {
  BOTH = 1,
  CART = 2,
  BUY = 3,
}

// 定义响应式数据
const currentIndex = ref(0)
const goodsDetail = ref<GoodsDetail | null>(null)
const popup = ref<{ open: (type?: string) => void; close: () => void } | null>(null)
const popupName = ref<'address' | 'service' | undefined>()
const isShowSKU = ref(false)
const localData = ref({} as SkuPopupLocaldata)
const mode = ref<SkuMode>(SkuMode.BOTH)
const skuRef = ref<SkuPopupInstanceType>()

// 处理点击图片预览
const onTapImage = (url: string) => {
  uni.previewImage({
    current: getFullImageUrl(url),
    urls: goodsDetail.value!.mainVideos,
  })
}

// 处理轮播图下标变化
const onChange: UniHelper.SwiperOnChange = (ev) => {
  currentIndex.value = ev.detail?.current || 0
}

// 获取商品详情
const getGoodsDetail = async () => {
  try {
    const res = await getGoodsDetailAPI(props.id)
    goodsDetail.value = res.result
    localData.value = {
      _id: res.result.id,
      name: res.result.name,
      goods_thumb: getFullImageUrl(res.result.mainVideos[0]),
      spec_list: res.result.specs.map((v) => {
        return {
          name: v.name,
          list: v.attributes,
        }
      }),
      sku_list: res.result.skus.map((v) => ({
        _id: v.id,
        goods_id: res.result.id,
        goods_name: res.result.name,
        image: getFullImageUrl(v.pictures),
        price: v.price * 100,
        stock: v.stock,
        sku_name_arr: v.attributes,
      })),
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
  }
}

// 打开弹出层
const openPopup = (name: typeof popupName.value) => {
  popupName.value = name
  popup.value?.open()
}

// 处理 SKU 组件
const openSku = (val: SkuMode) => {
  // 修改模式
  mode.value = val
  // 显示sku
  isShowSKU.value = true
}

// 计算选中的 SKU 文本
const selectArrText = computed(() => {
  return skuRef.value?.selectArr?.join(' ').trim() || '请选择商品规格'
})

// 添加购物车
const addShoppingCartItem = async (ev: SkuPopupEvent) => {
  const res = await addShoppingCartItemAPI(ev._id, ev.buy_num)
  if (res.code == '0') {
    await uni.showToast({ icon: 'none', title: res.msg ? res.msg : '添加失败' })
  }
  // 成功提示
  await uni.showToast({ icon: 'none', title: res.msg ? res.msg : '添加成功' })
  // 隐藏sku组件
  isShowSKU.value = false
}
// 立即购买
const onBuyNow = (ev: SkuPopupEvent) => {
  uni.navigateTo({ url: `/pagesOrder/create/create?skuId=${ev._id}&count=${ev.buy_num}` })
  isShowSKU.value = false
}
const loadingStatus = ref(false)
// 组件显示时加载数据
onShow(async () => {
  loadingStatus.value = true
  await Promise.all([
    getGoodsDetail().finally(() => {
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
</script>

<template>
  <!--  SKU组件-->
  <vk-data-goods-sku-popup
    v-model="isShowSKU"
    :localdata="localData"
    :mode="mode"
    add-cart-background-color="#ffa868"
    buy-now-background-color="#27ba9b"
    ref="skuRef"
    :actived-style="{
      color: '#27ba9b',
      borderColor: '#27ba9b',
      backgroundColor: '#cbd1d1',
    }"
    @add-cart="addShoppingCartItem"
    @buy-now="onBuyNow"
  />
  <scroll-view scroll-y class="viewport">
    <!-- 基本信息 -->
    <view class="goods">
      <!-- 商品主图 -->
      <view class="preview">
        <swiper @change="onChange" circular>
          <swiper-item v-for="item in goodsDetail?.mainVideos" :key="item">
            <image mode="aspectFill" :src="getFullImageUrl(item)" @tap="onTapImage(item)" />
          </swiper-item>
        </swiper>
        <view class="indicator">
          <text class="current">{{ currentIndex + 1 }}</text>
          <text class="split">/</text>
          <text class="total">{{ goodsDetail?.mainVideos?.length }}</text>
        </view>
      </view>

      <!-- 商品简介 -->
      <view class="meta">
        <view class="price">
          <text class="symbol">¥</text>
          <text class="number">{{ goodsDetail?.price }}</text>
        </view>
        <view class="name ellipsis">{{ goodsDetail?.name }}</view>
        <view class="desc"> {{ goodsDetail?.description }}</view>
      </view>

      <!-- 操作面板 -->
      <view class="action">
        <view class="item arrow">
          <view @tap="openSku(SkuMode.BOTH)" class="item arrow">
            <text class="label">选择</text>
            <text class="text ellipsis"> {{ selectArrText }}</text>
          </view>
        </view>
        <view class="item arrow">
          <text class="label">送至</text>
          <text class="text ellipsis"> 请选择收获地址</text>
        </view>
        <view class="item arrow">
          <text class="label">服务</text>
          <text class="text ellipsis"> 无忧退 快速退款 免费包邮</text>
        </view>
      </view>
    </view>

    <!-- 商品详情 -->
    <view class="detail panel">
      <view class="title">
        <text>详情</text>
      </view>
      <view class="content">
        <view class="properties">
          <!-- 属性详情 -->
          <view class="item" v-for="item in goodsDetail?.details" :key="item?.name">
            <text class="label">{{ item?.name }}</text>
            <text class="value">{{ item?.value }}</text>
          </view>
        </view>
        <!-- 图片详情 -->
        <image
          mode="widthFix"
          src="https://yanxuan-item.nosdn.127.net/a8d266886d31f6eb0d7333c815769305.jpg"
        ></image>
        <image
          mode="widthFix"
          src="https://yanxuan-item.nosdn.127.net/a9bee1cb53d72e6cdcda210071cbd46a.jpg"
        ></image>
      </view>
    </view>
  </scroll-view>

  <!-- 用户操作 -->
  <view class="toolbar" :style="{ paddingBottom: safeAreaInsets?.bottom + 'px' }">
    <view class="icons">
      <button class="icons-button">
        <text class="icon-heart"></text>
        收藏
      </button>
      <button class="icons-button" open-type="contact">
        <text class="icon-handset"></text>
        客服
      </button>
      <navigator class="icons-button" :url="`/pages/cart/cartTwo`">
        <text class="icon-cart"></text>
        购物车
      </navigator>
    </view>
    <view class="buttons">
      <view class="addcart" @tap="openSku(SkuMode.CART)"> 加入购物车</view>
      <view class="buynow" @tap="openSku(SkuMode.BUY)"> 立即购买</view>
    </view>
  </view>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.viewport {
  background-color: #f4f4f4;
}

.panel {
  margin-top: 20rpx;
  background-color: #fff;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 90rpx;
    line-height: 1;
    padding: 30rpx 60rpx 30rpx 6rpx;
    position: relative;

    text {
      padding-left: 10rpx;
      font-size: 28rpx;
      color: #333;
      font-weight: 600;
      border-left: 4rpx solid #27ba9b;
    }

    navigator {
      font-size: 24rpx;
      color: #666;
    }
  }
}

.arrow {
  &::after {
    position: absolute;
    top: 50%;
    right: 30rpx;
    content: '\e6c2';
    color: #ccc;
    font-family: 'erabbit' !important;
    font-size: 32rpx;
    transform: translateY(-50%);
  }
}

/* 商品信息 */
.goods {
  background-color: #fff;

  .preview {
    height: 750rpx;
    position: relative;

    .image {
      width: 750rpx;
      height: 750rpx;
    }

    .indicator {
      height: 40rpx;
      padding: 0 24rpx;
      line-height: 40rpx;
      border-radius: 30rpx;
      color: #fff;
      font-family: Arial, Helvetica, sans-serif;
      background-color: rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 30rpx;
      right: 30rpx;

      .current {
        font-size: 26rpx;
      }

      .split {
        font-size: 24rpx;
        margin: 0 1rpx 0 2rpx;
      }

      .total {
        font-size: 24rpx;
      }
    }
  }

  .meta {
    position: relative;
    border-bottom: 1rpx solid #eaeaea;

    .price {
      height: 130rpx;
      padding: 25rpx 30rpx 0;
      color: #fff;
      font-size: 34rpx;
      box-sizing: border-box;
      background-color: #35c8a9;
    }

    .number {
      font-size: 56rpx;
    }

    .brand {
      width: 160rpx;
      height: 80rpx;
      overflow: hidden;
      position: absolute;
      top: 26rpx;
      right: 30rpx;
    }

    .name {
      max-height: 88rpx;
      line-height: 1.4;
      margin: 20rpx;
      font-size: 32rpx;
      color: #333;
    }

    .desc {
      line-height: 1;
      padding: 0 20rpx 30rpx;
      font-size: 24rpx;
      color: #cf4444;
    }
  }

  .action {
    padding-left: 20rpx;

    .item {
      height: 90rpx;
      padding-right: 60rpx;
      border-bottom: 1rpx solid #eaeaea;
      font-size: 26rpx;
      color: #333;
      position: relative;
      display: flex;
      align-items: center;

      &:last-child {
        border-bottom: 0 none;
      }
    }

    .label {
      width: 60rpx;
      color: #898b94;
      margin: 0 16rpx 0 10rpx;
    }

    .text {
      flex: 1;
      -webkit-line-clamp: 1;
    }
  }
}

/* 商品详情 */
.detail {
  padding-left: 20rpx;

  .content {
    margin-left: -20rpx;

    .image {
      width: 100%;
    }
  }

  .properties {
    padding: 0 20rpx;
    margin-bottom: 30rpx;

    .item {
      display: flex;
      line-height: 2;
      padding: 10rpx;
      font-size: 26rpx;
      color: #333;
      border-bottom: 1rpx dashed #ccc;
    }

    .label {
      width: 200rpx;
    }

    .value {
      flex: 1;
    }
  }
}

/* 同类推荐 */
.similar {
  .content {
    padding: 0 20rpx 200rpx;
    background-color: #f4f4f4;
    display: flex;
    flex-wrap: wrap;

    .goods {
      width: 340rpx;
      padding: 24rpx 20rpx 20rpx;
      margin: 20rpx 7rpx;
      border-radius: 10rpx;
      background-color: #fff;
    }

    .image {
      width: 300rpx;
      height: 260rpx;
    }

    .name {
      height: 80rpx;
      margin: 10rpx 0;
      font-size: 26rpx;
      color: #262626;
    }

    .price {
      line-height: 1;
      font-size: 20rpx;
      color: #cf4444;
    }

    .number {
      font-size: 26rpx;
      margin-left: 2rpx;
    }
  }

  navigator {
    &:nth-child(even) {
      margin-right: 0;
    }
  }
}

/* 底部工具栏 */
.toolbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-color: #fff;
  height: 100rpx;
  padding: 0 20rpx var(--window-bottom);
  border-top: 1rpx solid #eaeaea;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: content-box;

  .buttons {
    display: flex;

    & > view {
      width: 220rpx;
      text-align: center;
      line-height: 72rpx;
      font-size: 26rpx;
      color: #fff;
      border-radius: 72rpx;
    }

    .addcart {
      background-color: #ffa868;
    }

    .buynow,
    .payment {
      background-color: #27ba9b;
      margin-left: 20rpx;
    }
  }

  .icons {
    padding-right: 10rpx;
    display: flex;
    align-items: center;
    flex: 1;

    .icons-button {
      flex: 1;
      text-align: center;
      line-height: 1.4;
      padding: 0;
      margin: 0;
      border-radius: 0;
      font-size: 20rpx;
      color: #333;
      background-color: #fff;

      &::after {
        border: none;
      }
    }

    text {
      display: block;
      font-size: 34rpx;
    }
  }
}
</style>
