<script setup lang="ts">
// 分页数据
import { onMounted, ref } from 'vue'
import type { GoodsListParams, GoodsListVO } from '@/types/home'
import { getGoodsListAPI } from '@/api/home'
import { getFullImageUrl } from '@/constants'
import MoveLoading from '@/components/MoveLoading.vue'
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
// 商品列表
const goodsList = ref<GoodsListVO[]>([])
// 是否加载完成
const finish = ref(false)
// 重置数据
const resetData = () => {
  pageParam.page = 1
  goodsList.value = []
  finish.value = false
}

// 获取商品列表数据
const getGoodsList = async (param?: GoodsListParams) => {
  // 判断是否存在参数，若存在则为商品搜索
  if (param?.brandName != null) {
    resetData()
    pageParam.brandName = param?.brandName
  }
  if (param?.categoryName != null) {
    resetData()
    pageParam.categoryName = param?.categoryName
  }
  if (param?.discountName != null) {
    resetData()
    pageParam.discountName = param?.discountName
  }
  if (param?.name != null) {
    resetData()
    pageParam.name = param?.name
  }
  // 结束判断
  if (finish.value) {
    return uni.showToast({
      icon: 'none',
      title: '没有更多数据了~',
    })
  }
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
// 页面加载时获取商品列表数据
onMounted(() => {
  Promise.all([
    getGoodsList().finally(() => {
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

// 暴露方法
defineExpose({
  getMore: getGoodsList,
  resetData,
})
</script>

<template>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
  <!-- 商品列表 -->
  <view class="caption">
    <text class="text">商品列表</text>
  </view>
  <view class="guess">
    <navigator
      class="guess-item"
      v-for="goods in goodsList"
      :key="goods.id"
      :url="`/pages/goods/goods?id=${goods.id}`"
    >
      <image class="image" mode="aspectFill" :src="getFullImageUrl(goods.picture)"></image>
      <view class="name"> {{ goods.name }}</view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ goods.price }}</text>
      </view>
    </navigator>
  </view>
  <view class="loading-text"> {{ finish ? '没有更多数据了~' : '正在加载...' }}</view>
</template>

<style lang="scss">
:host {
  display: block;
}

/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;

  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;

  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }

  .image {
    width: 304rpx;
    height: 304rpx;
  }

  .name {
    height: 75rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price {
    line-height: 1;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }

  .small {
    font-size: 80%;
  }
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>
