<script setup lang="ts">
// 这里可以写你的 TS 逻辑代码
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
    <!-- 联系老板按钮，独立处理 -->
    <view class="contact-item">
      <button open-type="contact" class="button-content">
        <image class="icon" src="../../static/images/home_contact.png" mode="aspectFit"></image>
        <text class="text">联系老板</text>
      </button>
    </view>
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

  /* 保证 button 和其他 navigator 样式一致 */
  .button-content {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 150rpx;
    box-sizing: border-box;
    border: none; /* 去掉默认边框 */
    background: transparent; /* 背景透明，避免影响点击区域 */
    padding: 0; /* 去掉内边距，保持一致 */
    cursor: pointer; /* 添加手指点击样式 */
    line-height: 1; /* 设定行高确保垂直居中 */
  }

  /* 调整 icon 和 text 的对齐 */
  .button-content .icon {
    width: 90rpx;
    height: 90rpx;
    margin-bottom: 8rpx; /* 适当调整图标与文本之间的间距 */
  }

  .button-content .text {
    font-size: 26rpx;
    color: #666;
  }

  /* 联系老板按钮的样式独立出来 */
  .contact-item {
    width: 150rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }
}
</style>
