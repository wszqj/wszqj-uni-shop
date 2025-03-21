<script setup lang="ts">
//模拟登录
import { loginAPI } from '@/api/user'
import { useMemberStore } from '@/stores'
import type { LoginParams, LoginResult } from '@/types/member'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
// 临时登录凭证
const code = ref('')
// 获取临时登录凭证
onLoad(async () => {
  const res = await wx.login()
  code.value = res.code
})
// 登录参数
const loginParams = ref<LoginParams>({} as LoginParams)

// 调用微信接口登录
const loginByWx = async () => {
  loginParams.value.type = 'wx'
  loginParams.value.code = code.value
  // 调用接口
  let res = await loginAPI(loginParams.value)
  loginSuccess(res.result)
}

// 调用模拟接口登录
const loginSimulation = async () => {
  loginParams.value.type = 'simulation'
  loginParams.value.phone = '16696520022'
  // 调用接口
  let res = await loginAPI(loginParams.value)
  loginSuccess(res.result)
}

// 登录成功，保存会员信息
const loginSuccess = (profile: LoginResult) => {
  const memberStore = useMemberStore()
  // 保存会员信息
  memberStore.setProfile(profile)
  // 提示
  uni.showToast({ icon: 'success', title: '登陆成功' })
  //  延迟任务
  setTimeout(() => {
    // 返回上一页
    uni.navigateBack()
  }, 500)
}
</script>

<template>
  <view class="viewport">
    <view class="logo">
      <image src="../../static/images/home_logo2.png"></image>
    </view>
    <view class="login">
      <!-- 小程序端授权登录 -->
      <button class="button phone" @tap="loginByWx()">
        <text class="icon icon-phone"></text>
        微信授权登录
      </button>
      <view class="extra">
        <view class="caption">
          <text>其他登录方式</text>
        </view>
        <view class="options">
          <!-- 通用模拟登录 -->
          <button @tap="loginSimulation()">
            <text class="icon icon-phone">模拟快捷登录</text>
          </button>
        </view>
      </view>
      <view class="tips">登录/注册即视为你同意《服务条款》和《巨豪家具隐私协议》</view>
    </view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20rpx 40rpx;
}

.logo {
  flex: 1;
  text-align: center;

  image {
    width: 345rpx;
    height: 265rpx;
    margin-top: 15vh;
  }
}

.login {
  display: flex;
  flex-direction: column;
  height: 60vh;
  padding: 40rpx 20rpx 20rpx;

  .input {
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    border: 1px solid #ddd;
    padding-left: 30rpx;
    margin-bottom: 20rpx;
  }

  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80rpx;
    font-size: 28rpx;
    border-radius: 72rpx;
    color: #fff;

    .icon {
      font-size: 40rpx;
      margin-right: 6rpx;
    }
  }

  .phone {
    background-color: #28bb9c;
  }

  .wechat {
    background-color: #06c05f;
  }

  .extra {
    flex: 1;
    padding: 70rpx 70rpx 0;

    .caption {
      width: 440rpx;
      line-height: 1;
      border-top: 1rpx solid #ddd;
      font-size: 26rpx;
      color: #999;
      position: relative;

      text {
        transform: translate(-40%);
        background-color: #fff;
        position: absolute;
        top: -12rpx;
        left: 50%;
      }
    }

    .options {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 70rpx;

      button {
        padding: 0;
        background-color: transparent;
      }
    }

    .icon {
      font-size: 24rpx;
      color: #444;
      display: flex;
      flex-direction: column;
      align-items: center;

      &::before {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80rpx;
        height: 80rpx;
        margin-bottom: 6rpx;
        font-size: 40rpx;
        border: 1rpx solid #444;
        border-radius: 50%;
      }
    }

    .icon-weixin::before {
      border-color: #06c05f;
      color: #06c05f;
    }
  }
}

.tips {
  position: absolute;
  bottom: 80rpx;
  left: 20rpx;
  right: 20rpx;
  font-size: 22rpx;
  color: #999;
  text-align: center;
}
</style>
