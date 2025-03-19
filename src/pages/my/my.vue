<script setup lang="ts">
// 获取屏幕边界到安全区域距离
import HomeGuess from '@/components/HomeGuess.vue'
import { useMemberStore } from '@/stores'
import { userGuessList } from '@/composables'

const baseImgUrl = 'http://localhost:8081'

const { safeAreaInsets } = uni.getSystemInfoSync()
const store = useMemberStore()
// 调用猜你喜欢组合式函数
const { guessRef, onScrolltolower } = userGuessList()
</script>

<template>
  <scroll-view @scrolltolower="onScrolltolower" class="viewport" scroll-y enable-back-to-top>
    <!-- 个人资料 -->
    <view class="profile" :style="{ paddingTop: safeAreaInsets!.top + 'px' }">
      <!-- 情况1：已登录 -->
      <view class="overview" v-if="store?.profile">
        <navigator url="/pagesMember/profile/profile" hover-class="none">
          <image class="avatar" mode="aspectFill" :src="baseImgUrl + store.profile?.avatar"></image>
        </navigator>
        <view class="meta">
          <view class="nickname"> {{ store.profile?.nickname || store.profile?.account }}</view>
          <navigator class="extra" url="/pagesMember/profile/profile" hover-class="none">
            <text class="update">更新头像昵称</text>
          </navigator>
        </view>
      </view>
      <!-- 情况2：未登录 -->
      <view class="overview" v-else>
        <navigator url="/pages/login/login" hover-class="none">
          <image
            class="avatar gray"
            mode="aspectFill"
            src="http://yjy-xiaotuxian-dev.oss-cn-beijing.aliyuncs.com/picture/2021-04-06/db628d42-88a7-46e7-abb8-659448c33081.png"
          ></image>
        </navigator>
        <view class="meta">
          <navigator url="/pages/login/login" hover-class="none" class="nickname">
            未登录
          </navigator>
          <view class="extra">
            <text class="tips">点击登录账号</text>
          </view>
        </view>
      </view>
      <navigator class="settings" url="/pagesMember/settings/settings" hover-class="none">
        设置
      </navigator>
    </view>
    <!-- 我的订单 -->
    <view class="orders">
      <view class="title"> 个人中心 </view>
      <view class="section">
        <navigator class="contact" :url="`/pagesOrder/list/list?type=0`" hover-class="none">
          <div class="order-icon"></div>
          订单
        </navigator>
        <navigator
          class="contact"
          :url="`/pagesMember/myCoupon/myCoupon?type=1`"
          hover-class="none"
        >
          <div class="coupon-icon"></div>
          优惠
        </navigator>
        <navigator class="contact" :url="`/pagesMember/appointment/appointment`" hover-class="none">
          <div class="appointment-icon"></div>
          预约
        </navigator>
      </view>
    </view>
    <!-- 商品列表 -->
    <view class="guess">
      <HomeGuess ref="guessRef" />
    </view>
  </scroll-view>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
  background-color: #f7f7f8;
}

.viewport {
  height: 100%;
  background-repeat: no-repeat;
  background-image: url(@/static/images/my_bg.png);
  background-size: 100% 350rpx;
}

/* 用户信息 */
.profile {
  margin-top: 20rpx;
  position: relative;

  .overview {
    display: flex;
    height: 120rpx;
    padding: 0 36rpx;
    color: #fff;
  }

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .gray {
    filter: grayscale(100%);
  }

  .meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    line-height: 30rpx;
    padding: 16rpx 0;
    margin-left: 20rpx;
  }

  .nickname {
    max-width: 350rpx;
    margin-bottom: 16rpx;
    font-size: 30rpx;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .extra {
    display: flex;
    font-size: 20rpx;
  }

  .tips {
    font-size: 22rpx;
  }

  .update {
    padding: 3rpx 10rpx 1rpx;
    color: rgba(255, 255, 255, 0.8);
    border: 1rpx solid rgba(255, 255, 255, 0.8);
    margin-right: 10rpx;
    border-radius: 30rpx;
  }

  .settings {
    position: absolute;
    bottom: 0;
    right: 40rpx;
    font-size: 30rpx;
    color: #fff;
  }
}

/* 我的 */
.orders {
  position: relative;
  z-index: 99;
  padding: 30rpx;
  margin: 50rpx 20rpx 0;
  background-color: #fff;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 6rpx rgba(240, 240, 240, 0.6);

  .title {
    height: 40rpx;
    line-height: 40rpx;
    font-size: 28rpx;
    color: #1e1e1e;

    .navigator {
      font-size: 24rpx;
      color: #939393;
      float: right;
    }
  }

  .section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 40rpx 20rpx 10rpx;

    .navigator,
    .contact {
      text-align: center;
      font-size: 24rpx;
      color: #333;

      &::before {
        display: block;
        font-size: 60rpx;
        color: #ff9545;
      }
    }

    .contact {
      padding: 0;
      margin: 0;
      border: 0;
      background-color: transparent;
      line-height: inherit;
    }
  }
}

.order-icon {
  margin-top: 0;
  width: 60rpx;
  height: 60rpx;
  background-image: url('../../static/images/order_icon.png');
  background-size: 60rpx 60rpx; /* 设置背景图尺寸 */
  background-repeat: no-repeat; /* 防止背景图重复 */
  background-position: center; /* 居中显示背景图 */
}

.coupon-icon {
  margin-top: 0;
  width: 60rpx;
  height: 60rpx;
  background-image: url('../../static/images/coupon_icon.png');
  background-size: 60rpx 60rpx; /* 设置背景图尺寸 */
  background-repeat: no-repeat; /* 防止背景图重复 */
  background-position: center; /* 居中显示背景图 */
}

.appointment-icon {
  margin-top: 0;
  width: 60rpx;
  height: 60rpx;
  background-image: url('../../static/images/appointment_icon.png');
  background-size: 60rpx 60rpx; /* 设置背景图尺寸 */
  background-repeat: no-repeat; /* 防止背景图重复 */
  background-position: center; /* 居中显示背景图 */
}

/* 猜你喜欢 */
.guess {
  background-color: #f7f7f8;
  margin-top: 20rpx;
}
</style>
