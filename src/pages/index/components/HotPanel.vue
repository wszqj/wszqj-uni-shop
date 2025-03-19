<script setup lang="ts">
import type { discountActivityItem } from '@/types/discount'
import { baseImgUrl, getFullImageUrl } from '@/constants'

// 轮播图列表
let props = defineProps<{
  list: discountActivityItem[]
}>()
</script>

<template>
  <!-- 推荐专区 -->
  <view class="panel hot">
    <view v-show="props.list" v-for="discount in props.list" :key="discount.id" class="item">
      <view class="title">
        <text class="title-text">{{ discount.typeName }}</text>
        <text class="title-desc">{{ discount.title }}</text>
      </view>
      <navigator
        hover-class="none"
        :url="`/pages/activity/activity?id=${discount.id}`"
        class="cards"
      >
        <!-- 仅仅展示前两张图片-->
        <image
          v-if="discount.mainVideos[0]"
          class="image"
          mode="aspectFit"
          :src="getFullImageUrl(discount.mainVideos[0])"
        ></image>
        <image
          v-if="discount.mainVideos[1]"
          class="image"
          mode="aspectFit"
          :src="getFullImageUrl(discount.mainVideos[1])"
        ></image>
      </navigator>
    </view>
  </view>
</template>

<style lang="scss">
/* 热门推荐 */
.hot {
  display: flex;
  flex-wrap: wrap;
  min-height: 254rpx;
  margin: 20rpx 20rpx 0;
  border-radius: 10rpx;
  background-color: #fff;

  .title {
    display: flex;
    align-items: center;
    padding: 24rpx 24rpx 0;
    font-size: 32rpx;
    color: #262626;
    position: relative;

    .title-desc {
      font-size: 24rpx;
      color: #7f7f7f;
      margin-left: 18rpx;
    }
  }

  .item {
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 254rpx;
    border-right: 1rpx solid #eee;
    border-top: 1rpx solid #eee;

    .title {
      justify-content: start;
    }

    &:nth-child(2n) {
      border-right: 0 none;
    }

    &:nth-child(-n + 2) {
      border-top: 0 none;
    }

    .image {
      width: 150rpx;
      height: 150rpx;
    }
  }

  .cards {
    flex: 1;
    padding: 15rpx 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
