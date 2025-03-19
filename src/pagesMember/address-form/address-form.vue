<script setup lang="ts">
import { ref } from 'vue'
import { addAddressAPI, getAddressAPI, updateAddressAPI } from '@/api/address'
import { onShow } from '@dcloudio/uni-app'
import MoveLoading from '@/components/MoveLoading.vue'
// 表单组件实例
const formRef = ref()
const isDefault = ref(false)
// 表单数据
const form = ref({
  id: '',
  consignee: '', // 收货人
  phone: '', // 联系方式
  fullLocation: '', // 省市区(前端展示)
  address: '', // 详细地址
  status: 0, // 是否默认 (0: 否, 1: 是)
})
/*// 默认地址修改
const onSwitchChange: UniHelper.SwitchOnChange = (ev) => {
  form.value.status = ev.detail.value ? 1 : 0
}*/
// 默认地址修改
const onSwitchChange = (status: boolean) => {
  isDefault.value = status
  form.value.status = status ? 1 : 0
}
// 校验规则
const rules = {
  consignee: {
    rules: [{ required: true, errorMessage: '请输入收货人姓名' }],
  },
  phone: {
    rules: [
      { required: true, errorMessage: '请输入联系方式' },
      {
        pattern: /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
        errorMessage: '手机号格式不正确',
      },
    ],
  },
  fullLocation: {
    rules: [{ required: true, errorMessage: '请选择所在地区' }],
  },
  address: {
    rules: [{ required: true, errorMessage: '请输入详细地址' }],
  },
  status: {
    rules: [{ required: true, errorMessage: '请选择是否默认' }],
  },
}
// 获取页面参数
const query = defineProps<{
  id: string
}>()

// 获取修改之后的地址信息
const regionChange: UniHelper.RegionPickerOnChange = (ev) => {
  //  前端展示数据
  form.value.fullLocation = ev.detail.value.join(' ')
}

// 提交表单
const onSubmit = async () => {
  try {
    // 表单校验
    await formRef.value?.validate?.()
  } catch {
    // 如果表单校验未通过，处理并显示校验错误信息
    return uni.showToast({ icon: 'none', title: '请将信息完善' })
  }
  if (query.id) {
    // 添加数据
    form.value.id = query.id
    // 修改地址
    const res = await updateAddressAPI(form.value)
    if (res.code === '1' && res.msg) {
      // 后端返回的错误信息
      uni.showToast({ icon: 'none', title: res.msg })
      return // 如果有错误信息，不继续执行后续代码
    }
    uni.showToast({ icon: 'success', title: '修改成功' })
  } else {
    // 新增地址
    const res = await addAddressAPI(form.value)
    if (res.code === '1' && res.msg) {
      // 后端返回的错误信息
      uni.showToast({ icon: 'none', title: res.msg })
      return // 如果有错误信息，不继续执行后续代码
    }
    // 成功信息
    uni.showToast({ icon: 'success', title: '添加成功' })
  }
  // 返回上一页
  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}

// 回显数据
const getAddressInfo = async () => {
  if (query.id) {
    // 获取地址信息
    const res = await getAddressAPI(query.id)
    // 赋值
    form.value = res.result
    isDefault.value = form.value.status == 1
  }
}
const loadingStatus = ref(false)
// 加载数据
onShow(async () => {
  loadingStatus.value = true
  await Promise.race([
    getAddressInfo().finally(() => {
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
</script>

<template>
  <view class="content">
    <form :rules="rules" :model="form" ref="formRef">
      <!-- 表单内容 -->
      <view class="form-item">
        <text class="label">收货人</text>
        <input class="input" placeholder="请填写收货人姓名" v-model="form.consignee" />
      </view>
      <view class="form-item">
        <text class="label">手机号码</text>
        <input class="input" placeholder="请填写收货人手机号码" v-model="form.phone" />
      </view>
      <view class="form-item">
        <text class="label">所在地区</text>
        <picker
          class="picker"
          mode="region"
          :value="form.fullLocation.split(' ')"
          @change="regionChange"
        >
          <view v-if="form?.fullLocation">{{ form.fullLocation }}</view>
          <view v-else class="placeholder">请选择省/市/区(县)</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">详细地址</text>
        <input class="input" placeholder="街道、楼牌号等信息" v-model="form.address" />
      </view>
      <view class="form-item">
        <label class="label">设为默认地址</label>
        <up-switch
          @change="onSwitchChange(isDefault)"
          class="switch"
          activeColor="#27ba9b"
          v-model="isDefault"
        />
      </view>
    </form>
  </view>
  <!-- 提交按钮 -->
  <button class="button" @tap="onSubmit">保存并使用</button>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
</template>

<style lang="scss">
page {
  background-color: #f4f4f4;
}

.content {
  margin: 20rpx 20rpx 0;
  padding: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .form-item,
  .uni-forms-item {
    display: flex;
    align-items: center;
    min-height: 96rpx;
    padding: 25rpx 10rpx 40rpx;
    background-color: #fff;
    font-size: 28rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;
    margin-bottom: 0;

    // 调整 uni-forms 样式
    .uni-forms-item__content {
      display: flex;
    }

    .uni-forms-item__error {
      margin-left: 200rpx;
    }

    &:last-child {
      border: none;
    }

    .label {
      width: 200rpx;
      color: #333;
    }

    .input {
      flex: 1;
      display: block;
      height: 46rpx;
    }

    .switch {
      position: absolute;
      right: -20rpx;
      transform: scale(0.8);
    }

    .picker {
      flex: 1;
    }

    .placeholder {
      color: #808080;
    }
  }
}

.button {
  height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
