<script setup lang="ts">
import { ref } from 'vue'
import type { Advertisement } from '@/types/home'
const activeIndex = ref(0)
import { baseImgUrl } from '@/constants'
// 轮播图列表
let props = defineProps<{
  list: Advertisement[]
}>()

// 大图预览
const onTapImage = (url: string) => {
  uni.previewImage({
    current: baseImgUrl + url,
    urls: props.list.map((item) => {
      return baseImgUrl + item.url
    }),
  })
}

// 当swiper 下标发生变化时触发
const onChange: UniHelper.SwiperOnChange = (ev) => {
  // ! 非空断言，主观上排除掉空值情况
  activeIndex.value = ev.detail!.current
}
</script>

<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator url="/pages/index/index" hover-class="none" class="navigator">
          <image
            mode="aspectFill"
            class="image"
            :src="baseImgUrl + item.url"
            @tap="onTapImage(item.url)"
          ></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 指示点 -->
    <view class="indicator">
      <text
        v-for="(item, index) in list"
        :key="item"
        class="dot"
        :class="{ active: index === activeIndex }"
      ></text>
    </view>
  </view>
</template>

<style lang="scss">
:host {
  display: block;
  height: 280rpx;
}

/* 轮播图 */
.carousel {
  height: 100%;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;

  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;
    display: flex;
    justify-content: center;

    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      border-radius: 6rpx;
      background-color: rgba(255, 255, 255, 0.4);
    }

    .active {
      background-color: #fff;
    }
  }

  .navigator,
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>
