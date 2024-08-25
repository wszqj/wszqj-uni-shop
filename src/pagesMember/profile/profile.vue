<script setup lang="ts">
// 获取屏幕边界到安全区域距离
import { useMemberStore } from '@/stores'
import type { Gender, ProfileDetail, ProfileParams } from '@/types/member'
import { ref } from 'vue'
import { getProfileDetailAPI, updateProfileAPI } from '@/api/user'
import { onLoad } from '@dcloudio/uni-app'

const baseImgUrl = 'http://localhost:8081'
const { safeAreaInsets } = uni.getSystemInfoSync()
// 用户信息
const store = useMemberStore()
// 用户信息，初始化用于用户信息的修改
const profile = ref({} as ProfileDetail)

// 更新用户头像
const onAvatarChange = () => {
  // 显示选择图片的提示
  uni.showLoading({ title: '正在选择图片...' })

  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    success: (res) => {
      // 关闭加载提示
      uni.hideLoading()

      if (res.tempFiles.length === 0) {
        uni.showToast({ icon: 'none', title: '未选择图片' })
        return
      }
      // 本地路径
      const { tempFilePath } = res.tempFiles[0]
      // 显示上传进度提示
      uni.showLoading({ title: '上传中...' })

      uni.uploadFile({
        url: '/common/upload',
        name: 'file',
        filePath: tempFilePath,
        success: (res) => {
          // 关闭加载提示
          uni.hideLoading()

          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data)

              if (data.code === '0') {
                const avatar = data.result

                // 确保 profile 和 store.profile 非空
                if (profile.value && store.profile) {
                  // 更新头像数据
                  profile.value.avatar = avatar
                  store.profile.avatar = avatar

                  uni.showToast({ icon: 'success', title: '上传成功' })
                } else {
                  uni.showToast({ icon: 'none', title: '更新头像失败' })
                }
              } else {
                uni.showToast({ icon: 'error', title: data.msg || '上传失败' })
              }
            } catch (e) {
              uni.showToast({ icon: 'error', title: '解析响应数据失败' })
              console.error('解析响应数据失败:', e)
            }
          } else {
            uni.showToast({ icon: 'error', title: '上传失败' })
          }
        },
        fail: (err) => {
          // 关闭加载提示
          uni.hideLoading()

          uni.showToast({ icon: 'error', title: '网络错误，请重试' })
          console.error('上传失败:', err)
        },
      })
    },
    fail: (err) => {
      uni.hideLoading()

      uni.showToast({ icon: 'error', title: '选择图片失败，请重试' })
      console.error('选择图片失败:', err)
    },
  })
}

// 查询用户信息
const getProfileDetail = async () => {
  // 获取用户信息
  const res = await getProfileDetailAPI()
  // 数据回显
  profile.value = res.result
  console.log(profile.value)
}
// 更新用户年龄
const onBirthdayChange: UniHelper.DatePickerOnChange = (ev) => {
  profile.value.birthday = ev.detail.value
}
// 更新城市信息
const onFullLocationChange: UniHelper.RegionPickerOnChange = (ev) => {
  // 更新前端数据
  profile.value.fullLocation = ev.detail.value.join(' ')
}
// 更新用户性别
const onGenderChange: UniHelper.RadioGroupOnChange = (ev) => {
  profile.value.gender = ev.detail.value as Gender
  console.log(ev.detail.value as Gender)
}
// 修改参数
const profileParams = ref<ProfileParams>()

// 提交修改
const onSubmit = async () => {
  // 准备请求参数
  const { nickname, gender, birthday, fullLocation } = profile.value
  if (!fullLocation) {
    uni.showToast({ icon: 'none', title: '完整地址不能为空' })
    return
  }
  profileParams.value = {
    nickname,
    gender,
    birthday,
    fullLocation,
  }
  // 调用接口
  const res = await updateProfileAPI(profileParams.value)
  if (res.code !== '0') {
    return uni.showToast({
      icon: 'none',
      title: res.msg && res.msg.length ? res.msg : '更新失败',
    })
  }
  // 更新用户信息
  const pr = store.profile
  pr.nickname = res.result.nickname
  store.setProfile(pr)
  // 显示成功消息
  uni.showToast({
    icon: 'success',
    title: '更新成功',
  })
  // 延迟返回上一页
  setTimeout(() => {
    uni.navigateBack()
  }, 300)
}

// 数据回显
onLoad(() => {
  getProfileDetail()
})
</script>

<template>
  <view class="viewport">
    <!-- 导航栏 -->
    <view class="navbar" :style="{ paddingTop: safeAreaInsets?.top + 'px' }">
      <navigator open-type="navigateBack" class="back icon-left" hover-class="none"></navigator>
      <view class="title">个人信息</view>
    </view>
    <!-- 头像 -->
    <view class="avatar">
      <view class="avatar-content">
        <image class="image" :src="baseImgUrl + profile?.avatar" mode="aspectFill" />
        <text class="text" @tap="onAvatarChange">点击修改头像</text>
      </view>
    </view>
    <!-- 表单 -->
    <view class="form">
      <!-- 表单内容 -->
      <view class="form-content">
        <view class="form-item">
          <text class="label">账号</text>
          <text class="account">{{ profile?.account }}</text>
        </view>
        <view class="form-item">
          <text class="label">昵称</text>
          <input class="input" type="text" placeholder="请填写昵称" v-model="profile!.nickname" />
        </view>
        <view class="form-item">
          <text class="label">性别</text>
          <radio-group @change="onGenderChange">
            <label class="radio">
              <radio value="男性" color="#27ba9b" :checked="profile?.gender === '男性'" />
              男
            </label>
            <label class="radio">
              <radio value="女性" color="#27ba9b" :checked="profile?.gender === '女性'" />
              女
            </label>
          </radio-group>
        </view>
        <view class="form-item">
          <text class="label">生日</text>
          <picker
            class="picker"
            :value="profile?.birthday"
            mode="date"
            start="1900-01-01"
            :end="new Date()"
            @change="onBirthdayChange"
          >
            <view v-if="profile?.birthday">{{ profile?.birthday }}</view>
            <view class="placeholder" v-else>请选择日期</view>
          </picker>
        </view>
        <view class="form-item">
          <text class="label">城市</text>
          <picker
            @change="onFullLocationChange"
            class="picker"
            mode="region"
            :value="profile?.fullLocation?.split(' ')"
          >
            <view v-if="profile?.fullLocation">{{ profile?.fullLocation }}</view>
            <view class="placeholder" v-else>请选择城市</view>
          </picker>
        </view>
      </view>
      <!-- 提交按钮 -->
      <button class="form-button" @tap="onSubmit">保 存</button>
    </view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #00c8a4;
  background-size: auto 420rpx;
  background-repeat: no-repeat;
}

// 导航栏
.navbar {
  position: relative;

  .title {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
    color: #fff;
  }

  .back {
    position: absolute;
    height: 40px;
    width: 40px;
    left: 0;
    font-size: 20px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

// 头像
.avatar {
  text-align: center;
  width: 100%;
  height: 260rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    background-color: #eee;
  }

  .text {
    display: block;
    padding-top: 20rpx;
    line-height: 1;
    font-size: 26rpx;
    color: #fff;
  }
}

// 表单
.form {
  background-color: #f4f4f4;

  &-content {
    margin: 20rpx 20rpx 0;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  &-item {
    display: flex;
    height: 96rpx;
    line-height: 46rpx;
    padding: 25rpx 10rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;

    &:last-child {
      border: none;
    }

    .label {
      width: 180rpx;
      color: #333;
    }

    .account {
      color: #666;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .radio {
      margin-right: 20rpx;
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }

  &-button {
    height: 80rpx;
    text-align: center;
    line-height: 80rpx;
    margin: 30rpx 20rpx;
    color: #fff;
    border-radius: 80rpx;
    font-size: 30rpx;
    background-color: #27ba9b;
  }
}
</style>
