<script setup lang="ts">
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
</script>

<template>
  <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
    <!-- logo文字 -->
    <view class="logo">
      <text class="logo-font">巨豪家具</text>
      <text class="logo-text">一站式购物 · 服务一流</text>
    </view>
    <!-- 搜索条 -->
    <view class="search">
      <input class="search-input" placeholder="搜索商品" />
      <text class="icon-search"></text>
    </view>
  </view>
</template>

<style lang="scss">
.logo-font {
  font-size: 50rpx;
  color: #fff;
  font-family: '微软雅黑', serif;
}

/* 自定义导航条 */
.navbar {
  background-image: url(@/static/images/navigator_bg3.png);
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    padding-top: 20rpx;

    .logo-text {
      flex: 1;
      line-height: 28rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 26rpx;
    }
  }

  .search {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10rpx 0 26rpx;
    height: 64rpx;
    margin: 16rpx 20rpx;
    color: #fff;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .icon-search {
    &::before {
      margin-right: 10rpx;
    }
  }

  .icon-scan {
    font-size: 30rpx;
    padding: 15rpx;
  }
}
</style>
