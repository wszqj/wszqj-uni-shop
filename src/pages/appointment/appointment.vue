<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Appointment } from '@/types/appointment'
import { makeAnAppointmentAPI } from '@/api/appointment'
import { useMemberStore } from '@/stores'

const show = ref(false)
const value = ref(null)
const uToastRef = ref()
const minTime = ref(new Date().getTime()) // 初始化为当前时间
const title = ref('请填写预约信息')
const welcomeText = ref('巨豪家具，欢迎您')
const form = ref<Appointment>({} as Appointment)

// 确认选择的日期
const confirm = (e) => {
  show.value = false
  const date = new Date(e.value)

  // 格式化时间
  form.value.time =
    date.getFullYear() +
    '-' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + date.getDate()).slice(-2) +
    ' ' +
    ('0' + date.getHours()).slice(-2) +
    ':' +
    ('0' + date.getMinutes()).slice(-2) +
    ':' +
    ('0' + date.getSeconds()).slice(-2)
}

const isValidPhoneNumber = (phoneNumber: string) => {
  // 定义一个正则表达式来匹配手机号
  const regex = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/

  // 使用if语句和RegExp的test方法来检查手机号是否有效
  if (regex.test(phoneNumber)) {
    return true // 手机号有效
  } else {
    return false // 手机号无效
  }
}
const formRef = ref()
// 提交预约信息
const submit = async () => {
  if (!form.value.name) {
    return uToastRef.value.show({ message: '请输入姓名', type: 'error' })
  }
  if (!form.value.phone) {
    return uToastRef.value.show({ message: '请输入手机号', type: 'error' })
  }
  if (!isValidPhoneNumber(form.value.phone)) {
    return uToastRef.value.show({ message: '手机号格式不正确', type: 'error' })
  }
  if (!form.value.time) {
    return uToastRef.value.show({ message: '请选择预约时间', type: 'error' })
  }
  if (!form.value.desc) {
    return uToastRef.value.show({ message: '请输入预约内容', type: 'error' })
  }
  // 调用api
  const res = await makeAnAppointmentAPI(form.value)
  if (res.code != '0') {
    return uToastRef.value.show({ message: '操作失败请稍后重试', type: 'error' })
  }
  uToastRef.value.show({ message: '预约成功', type: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 1000)
}
// 判断是否登录
onMounted(() => {
  const store = useMemberStore()
  if (!store?.profile) {
    uToastRef.value.show({ message: '请先登录', type: 'error' })
    setTimeout(() => {
      uni.navigateTo({ url: '/pages/login/login' })
    }, 500)
  }
})
</script>

<template>
  <view>
    <up-notice-bar :text="welcomeText" mode="closable"></up-notice-bar>
  </view>
  <up-card :title="title" :border="true">
    <template #body>
      <view class="u-body-item u-flex u-col-between u-p-t-0">
        <up-form :model="form" labelWidth="85" labelPosition="left" ref="formRef">
          <up-form-item label="姓名：">
            <up-input v-model="form.name" placeholder="请输入姓名"></up-input>
          </up-form-item>
          <up-form-item label="手机号：">
            <up-input v-model="form.phone" placeholder="请输入手机号"></up-input>
          </up-form-item>
          <up-form-item label="预约内容：">
            <up-textarea v-model="form.desc" placeholder="请输入预约内容"></up-textarea>
          </up-form-item>
          <up-form-item label="日期：">
            <up-datetime-picker
              hasInput
              :show="show"
              v-model="value"
              mode="datetime"
              :minDate="minTime"
              @cancel="show = false"
              @confirm="confirm"
            ></up-datetime-picker>
            <template #right>
              <up-button class="custom-style" type="primary" :plain="true" @click="show = true"
                >选择
              </up-button>
            </template>
          </up-form-item>
        </up-form>
      </view>
    </template>
    <template #foot>
      <up-button style="width: 40px; height: 20px; margin-top: 10px" type="success" @click="submit"
        >确认
      </up-button>
    </template>
  </up-card>
  <up-toast position="top" ref="uToastRef"></up-toast>
</template>

<style scoped lang="scss">
.u-card-wrap {
  padding: 1px;
}

.u-body-item {
  font-size: 32rpx;
  color: #333;
  padding: 10rpx 10rpx;
}
</style>
