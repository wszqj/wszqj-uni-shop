<script setup lang="ts">
//
</script>

<template>
  <view class="category">
    <navigator class="category-item" hover-class="none" url="/pages/secKill/secKill">
      <image class="icon" src="../../static/images/home_secKill.png"></image>
      <text class="text">秒杀优惠</text>
    </navigator>
    <navigator class="category-item" hover-class="none" url="/pages/prize/prize">
      <image class="icon" src="../../static/images/home_prize.png"></image>
      <text class="text">抽奖活动</text>
    </navigator>
    <navigator class="category-item" hover-class="none" url="/pages/appointment/appointment">
      <image class="icon" src="../../static/images/home_appointment.png"></image>
      <text class="text">预约进店</text>
    </navigator>
    <navigator class="category-item" hover-class="none" url="/pages/shop/shop">
      <image class="icon" src="../../static/images/home_shop.png"></image>
      <text class="text">店铺信息</text>
    </navigator>
    <navigator class="category-item" hover-class="none" url="/pages/contact/contact">
      <image class="icon" src="../../static/images/home_contact.png"></image>
      <text class="text">联系老板</text>
    </navigator>
  </view>
</template>

<style lang="scss">
/* 前台类目 */
.category {
  margin: 20rpx 0 0;
  padding: 10rpx 0;
  display: flex;
  flex-wrap: wrap;
  min-height: 164rpx;

  .category-item {
    width: 150rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;

    .icon {
      width: 90rpx;
      height: 90rpx;
    }
    .text {
      font-size: 26rpx;
      color: #666;
    }
  }
}
</style>
