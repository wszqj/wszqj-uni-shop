<script setup lang="ts">
import { getDiscountByIdAPI } from '@/api/discount'
import { ref } from 'vue'
import type { discountActivityItem } from '@/types/discount'
import { onLoad } from '@dcloudio/uni-app'
import HomeSwiper from '@/components/HomeSwiper.vue'
import type { Advertisement, GoodsListParams, GoodsListVO } from '@/types/home'
import { getGoodsListAPI } from '@/api/home'
import { getFullImageUrl } from '@/constants'
import MoveLoading from '@/components/MoveLoading.vue'

// 获取页面参数
const props = defineProps<{
  id: number
}>()

// 分页参数
const pageParam: Required<GoodsListParams> = {
  page: 1,
  pageSize: 10,
  name: '',
  discountId: '',
  brandName: '',
  categoryName: '',
  discountName: '',
}

// 折扣活动信息
const discount = ref<discountActivityItem>({} as discountActivityItem)
// 折扣活动宣传图片
const advertisements = ref<Advertisement[]>([])
// 获取折扣活动信息
const getDiscountById = async () => {
  const res = await getDiscountByIdAPI(props.id)
  discount.value = res.result
  // 使用 map 方法将 string[] 转换为 Advertisement[]
  advertisements.value = discount.value.mainVideos.map((videoUrl: string) => ({
    url: videoUrl,
  }))
}

// 商品列表
const goodsList = ref<GoodsListVO[]>([])
// 是否加载完成
const finish = ref(false)

// 根据折扣信息获取该活动下的所有商品数据
const getGoodsList = async () => {
  // 结束判断
  if (finish.value === true) {
    return uni.showToast({
      icon: 'none',
      title: '没有更多数据了~',
    })
  }
  // 将当前活动的id赋值于查询参数
  pageParam.discountId = props.id.toString()
  // 调用获取商品列表数据
  let res = await getGoodsListAPI(pageParam)
  // 将返回的数据拆开并追加进结果数据
  goodsList.value.push(...res.result.records)
  // 分页条件
  if (res.result.pages > pageParam.page) {
    // 页码累加
    pageParam.page++
  } else {
    finish.value = true
  }
}
const loadingStatus = ref(false)
// 页面显示时加载数据
onLoad(async () => {
  // 开启过渡动画
  loadingStatus.value = true
  await Promise.race([
    getDiscountById().finally(() => {
      // 这里我们只关心是否响应
      if (!loadingStatus.value) {
        return
      }
      // 关闭过渡动画
      loadingStatus.value = false
    }),
    getGoodsList().finally(() => {
      // 这里我们只关心是否响应
      if (!loadingStatus.value) {
        return
      }
      // 关闭过渡动画
      loadingStatus.value = false
    }),
  ])
  // 这里我们只关心是否响应
  if (!loadingStatus.value) {
    return
  }
  // 关闭过渡动画
  loadingStatus.value = false
})
</script>

<template>
  <!-- 推荐封面图 -->
  <HomeSwiper :list="advertisements" />
  <view v-if="discount" class="viewport">
    <!-- 推荐选项 -->
    <view class="tabs">
      <text class="text active">{{ discount.typeName }}</text>
    </view>
    <!-- 推荐列表 -->
    <scroll-view scroll-y="true" class="scroll-view" @scrolltolower="getGoodsList">
      <view class="goods">
        <navigator
          hover-class="none"
          class="navigator"
          v-for="goods in goodsList"
          :key="goods"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="getFullImageUrl(goods.picture)"></image>
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text"> {{ finish ? '没有更多数据了~' : '正在加载...' }}</view>
    </scroll-view>
  </view>
  <view v-else class="blank">暂无商品数据</view>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;
  position: relative;
}

.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}

.scroll-view {
  flex: 1;
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;

  .text {
    margin: 0 20rpx;
    position: relative;
  }

  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}

.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;

  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .thumb {
    width: 305rpx;
    height: 305rpx;
  }

  .name {
    height: 88rpx;
    font-size: 26rpx;
  }

  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }

  .symbol {
    font-size: 70%;
  }

  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>
