<script setup lang="ts">
// 定义 props
import { ref, watch } from 'vue'
import {
  cancelAppointmentAPI,
  deleteAppointmentAPI,
  getAppointmentListAPI,
} from '@/api/appointment'
import type { AppointmentItem } from '@/types/home'
import { onLoad, onShow } from '@dcloudio/uni-app'
import MoveLoading from '@/components/MoveLoading.vue'

const IS_AGREE = ref(1)
const IS_VISITED = ref(2)
const props = defineProps<{
  status: number
}>()
const title = ref('时间：')
const modalTitle = ref()
const uToastRef = ref()
const show = ref(false)
const uModal = ref()
// 预约列表
const appointmentList = ref<AppointmentItem[]>([])
// 获取预约列表
const getAppointmentList = async () => {
  const res = await getAppointmentListAPI(props.status)
  appointmentList.value = res.result
}
// 刷新动画是否显示
const isTriggered = ref(false)
// 下拉刷新
const onRefresherRefresh = async () => {
  isTriggered.value = true
  // 加载数据
  await getAppointmentList()
  // 关闭动画
  isTriggered.value = false
}
// 取消预约操作
const cancelAppointment = () => {
  modalTitle.value = '您确认要取消预约吗'
  show.value = true
}
// 删除预约操作
const deleteAppointment = () => {
  modalTitle.value = '您确认要删除预约吗'
  show.value = true
}
// 确认操作
const confirm = async (id: number, status: number) => {
  if (modalTitle.value === '您确认要取消预约吗') {
    const res = await cancelAppointmentAPI(id, status)
    if (res.code != '0') {
      return uToastRef.value.show({ message: res.msg ? res.msg : '取消失败', type: 'error' })
    }
    uToastRef.value.show({ message: res.msg ? res.msg : '取消成功', type: 'success' })
    // 获取预约列表
    await getAppointmentList()
    show.value = false
  }
  if (modalTitle.value === '您确认要删除预约吗') {
    const res = await deleteAppointmentAPI(id, status)
    if (res.code != '0') {
      return uToastRef.value.show({ message: res.msg ? res.msg : '删除失败', type: 'error' })
    }
    uToastRef.value.show({ message: res.msg ? res.msg : '删除成功', type: 'success' })
    // 获取预约列表
    await getAppointmentList()
    show.value = false
  }
}
const loadingStatus = ref(false)
// 加载数据
onShow(async () => {
  loadingStatus.value = true
  await Promise.all([getAppointmentList()])
  loadingStatus.value = false
})
// 监听 props.status 的变化
watch(
  () => props.status,
  () => {
    getAppointmentList()
  },
)
</script>

<template>
  <scroll-view
    refresher-enabled="true"
    scroll-y="true"
    class="scroll-view"
    @refresherrefresh="onRefresherRefresh"
    :refresher-triggered="isTriggered"
  >
    <view v-if="appointmentList.length > 0">
      <view v-for="item in appointmentList" :key="item.id">
        <up-card :title="title" :sub-title="item.time">
          <template #body>
            <view class="u-body-item">预约人：{{ item.name }}</view>
            <view class="u-body-item">联系电话：{{ item.phone }}</view>
            <view class="u-body-item">预约描述：{{ item.desc }}</view>
          </template>
          <template #foot>
            <view class="custom-style">
              <view v-show="item.status < IS_VISITED">
                <up-button type="primary" text="取消预约" @click="cancelAppointment"></up-button>
              </view>
              <view v-show="item.status > IS_AGREE">
                <up-button type="error" text="删除预约" @click="deleteAppointment"></up-button>
              </view>
            </view>
          </template>
        </up-card>
        <view>
          <up-modal
            :show="show"
            :title="modalTitle"
            @confirm="confirm(item.id, item.status)"
            @cancel="show = false"
            :showCancelButton="true"
            ref="uModal"
            :zoom="false"
          ></up-modal>
        </view>
      </view>
    </view>
    <view v-else class="blank">暂无预约信息</view>
    <!-- 底部占位空盒子 -->
    <view class="toolbar-height"></view>
  </scroll-view>
  <up-toast position="top" ref="uToastRef"></up-toast>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
</template>

<style scoped lang="scss">
:host {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f7f7f8;
}

// 滚动容器
.scroll-view {
  flex: 1;
}
// 底部占位空盒子
.toolbar-height {
  height: 100%;
}
.u-body-item {
  font-size: 32rpx;
  color: #333;
  padding: 20rpx 10rpx;
}

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}
.custom-style {
  margin-top: 8rpx;
  margin-right: 8rpx;
}
</style>
