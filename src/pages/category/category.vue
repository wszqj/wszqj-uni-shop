<script setup lang="ts">
// 商品分类列表
import { computed, ref } from 'vue'
import type { CategoryTopItem } from '@/types/category'
import { getCategoryListAPI } from '@/api/category'
import { onLoad } from '@dcloudio/uni-app'
import PageSkeleton from '@/pages/category/component/PageSkeleton.vue'
import { baseImgUrl, getFullImageUrl } from '@/constants'
import MoveLoading from '@/components/MoveLoading.vue'

const categoryList = ref<CategoryTopItem[]>([])
const activeIndex = ref(0)

// 获取商品分类数据
const getCategoryList = async () => {
  const res = await getCategoryListAPI()
  categoryList.value = res.result
  console.log(categoryList.value)
}
// 刷新动画是否显示
const isTriggered = ref(false)
const loadingStatus = ref(false)
// 页面加载
onLoad(async () => {
  loadingStatus.value = true
  await Promise.all([
    getCategoryList().finally(() => {
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

// 提取当前二级分类数据
const subCategoryList = computed(() => {
  return categoryList.value[activeIndex.value]?.children || []
})

// 下拉刷新
const onRefresherRefresh = async () => {
  isTriggered.value = true
  // 加载数据
  await getCategoryList()
  // 关闭动画
  isTriggered.value = false
}
</script>

<template>
  <view class="viewport" v-if="categoryList">
    <!-- 搜索框 -->
    <view class="search">
      <view class="input">
        <text class="icon-search">沙发</text>
      </view>
    </view>
    <scroll-view
      refresher-enabled="true"
      scroll-y="true"
      class="scroll-view"
      @refresherrefresh="onRefresherRefresh"
      :refresher-triggered="isTriggered"
    >
      <!-- 分类 -->
      <view v-if="categoryList" class="categories">
        <!-- 左侧：一级分类 -->
        <scroll-view class="primary" scroll-y="true">
          <view
            v-for="(item, index) in categoryList"
            :key="item.id"
            class="item"
            :class="{ active: index === activeIndex }"
            @tap="activeIndex = index"
          >
            <text class="name"> {{ item.name }}</text>
          </view>
        </scroll-view>
        <!-- 右侧：二级分类 -->
        <scroll-view class="secondary" scroll-y="true">
          <!-- 内容区域 -->
          <view class="panel" v-for="item in subCategoryList" :key="item.id">
            <view class="title">
              <text class="name">{{ item.name }}</text>
              <navigator class="more" hover-class="none">全部</navigator>
            </view>
            <view class="section">
              <navigator
                v-for="goods in item.goods"
                :key="goods.id"
                class="goods"
                hover-class="none"
                :url="`/pages/goods/goods?id=${goods.id}`"
              >
                <image class="image" :src="getFullImageUrl(goods.picture)"></image>
                <view class="name ellipsis">{{ goods.name }}</view>
                <view class="price">
                  <text class="symbol">¥</text>
                  <text class="number">{{ goods.price }}</text>
                </view>
              </navigator>
            </view>
          </view>
        </scroll-view>
      </view>
      <view v-else class="blank">暂无商品数据</view>
    </scroll-view>
  </view>
  <!-- 骨架屏 -->
  <PageSkeleton v-else />
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search {
  padding: 0 30rpx 20rpx;
  background-color: #fff;

  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64rpx;
    padding-left: 26rpx;
    color: #8b8b8b;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: #f3f4f4;
  }
}

.icon-search {
  &::before {
    margin-right: 10rpx;
  }
}

/* 分类 */
.categories {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}

/* 一级分类 */
.primary {
  overflow: hidden;
  width: 180rpx;
  flex: none;
  background-color: #f6f6f6;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96rpx;
    font-size: 26rpx;
    color: #595c63;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 42rpx;
      bottom: 0;
      width: 96rpx;
      border-top: 1rpx solid #e3e4e7;
    }
  }

  .active {
    background-color: #fff;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 8rpx;
      height: 100%;
      background-color: #27ba9b;
    }
  }
}

.primary .item:last-child::after,
.primary .active::after {
  display: none;
}

/* 二级分类 */
.secondary {
  background-color: #fff;

  .carousel {
    height: 200rpx;
    margin: 0 30rpx 20rpx;
    border-radius: 4rpx;
    overflow: hidden;
  }

  .panel {
    margin: 0 30rpx 0rpx;
  }

  .title {
    height: 60rpx;
    line-height: 60rpx;
    color: #333;
    font-size: 28rpx;
    border-bottom: 1rpx solid #f7f7f8;

    .more {
      float: right;
      padding-left: 20rpx;
      font-size: 24rpx;
      color: #999;
    }
  }

  .more {
    &::after {
      font-family: 'erabbit' !important;
      content: '\e6c2';
    }
  }

  .section {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 0;

    .goods {
      width: 150rpx;
      margin: 0rpx 30rpx 20rpx 0;

      &:nth-child(3n) {
        margin-right: 0;
      }

      image {
        width: 150rpx;
        height: 150rpx;
      }

      .name {
        padding: 5rpx;
        font-size: 22rpx;
        color: #333;
      }

      .price {
        padding: 5rpx;
        font-size: 18rpx;
        color: #cf4444;
      }

      .number {
        font-size: 24rpx;
        margin-left: 2rpx;
      }
    }
  }
}
</style>
