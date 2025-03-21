<script setup lang="ts">
// 收货地址列表
import type { AddressItem } from '@/types/address'
import { ref } from 'vue'
import { deleteAddressAPI, getAddressListAPI } from '@/api/address'
import { onShow } from '@dcloudio/uni-app'
import { useSelectedAddress } from '@/stores/modules/address'
import MoveLoading from '@/components/MoveLoading.vue'

const addressList = ref<AddressItem[]>([])
//获取用户收货地址列表
const getAddressList = async () => {
  const res = await getAddressListAPI()
  addressList.value = res.result
}

// 修改收货地址
const changeSelectedAddress = (item: AddressItem) => {
  // 获取 addressStore
  const addressStore = useSelectedAddress()
  // 修改
  addressStore.selectedAddress = item
}

// 删除地址
const onDeleteAddress = (id: string) => {
  // 弹窗二次确认
  uni.showModal({
    content: '确认删除地址？',
    success: async (res) => {
      if (res.confirm) {
        // 删除地址
        await deleteAddressAPI(id)
        // 获取最新地址列表
        await getAddressList()
      }
    },
  })
}
const loadingStatus = ref(false)
onShow(async () => {
  loadingStatus.value = true
  await Promise.race([
    getAddressList().finally(() => {
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
  <view class="viewport">
    <!-- 地址列表 -->
    <scroll-view class="scroll-view" scroll-y>
      <view v-if="addressList.length" class="address">
        <uni-swipe-action class="address-list">
          <!-- 收货地址项 -->
          <uni-swipe-action-item class="item" v-for="item in addressList" :key="item.id">
            <view class="item-content" @tap="changeSelectedAddress(item)">
              <view class="user">
                {{ item.consignee }}
                <text class="contact">{{ item.phone }}</text>
                <text v-if="item.status === 1" class="badge">默认</text>
              </view>
              <view class="locate">{{ item.fullLocation }} {{ item.consignee }}</view>
              <navigator
                class="edit"
                hover-class="none"
                :url="`/pagesMember/address-form/address-form?id=${item.id}`"
              >
                修改
              </navigator>
            </view>
            <!-- 右侧插槽 -->
            <template #right>
              <button @tap="onDeleteAddress(item.id)" class="delete-button">删除</button>
            </template>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <view v-else class="blank">暂无收货地址</view>
    </scroll-view>
    <!-- 添加按钮 -->
    <view class="add-btn">
      <navigator hover-class="none" url="/pagesMember/address-form/address-form">
        新建地址
      </navigator>
    </view>
  </view>
  <!--  加载动画-->
  <MoveLoading :loadingStatus="loadingStatus"></MoveLoading>
</template>

<style lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

/* 删除按钮 */
.delete-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 100%;
  font-size: 28rpx;
  color: #fff;
  border-radius: 0;
  padding: 0;
  background-color: #ff605c;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f4f4f4;

  .scroll-view {
    padding-top: 20rpx;
  }
}

.address {
  padding: 0 20rpx;
  margin: 0 20rpx;
  border-radius: 10rpx;
  background-color: #fff;

  .item-content {
    line-height: 1;
    padding: 40rpx 10rpx 38rpx;
    border-bottom: 1rpx solid #ddd;
    position: relative;

    .edit {
      position: absolute;
      top: 36rpx;
      right: 30rpx;
      padding: 2rpx 0 2rpx 20rpx;
      border-left: 1rpx solid #666;
      font-size: 26rpx;
      color: #666;
      line-height: 1;
    }
  }

  .item:last-child .item-content {
    border: none;
  }

  .user {
    font-size: 28rpx;
    margin-bottom: 20rpx;
    color: #333;

    .contact {
      color: #666;
    }

    .badge {
      display: inline-block;
      padding: 4rpx 10rpx 2rpx 14rpx;
      margin: 2rpx 0 0 10rpx;
      font-size: 26rpx;
      color: #27ba9b;
      border-radius: 6rpx;
      border: 1rpx solid #27ba9b;
    }
  }

  .locate {
    line-height: 1.6;
    font-size: 26rpx;
    color: #333;
  }
}

.blank {
  margin-top: 300rpx;
  text-align: center;
  font-size: 32rpx;
  color: #888;
}

.add-btn {
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  margin: 30rpx 20rpx;
  color: #fff;
  border-radius: 80rpx;
  font-size: 30rpx;
  background-color: #27ba9b;
}
</style>
