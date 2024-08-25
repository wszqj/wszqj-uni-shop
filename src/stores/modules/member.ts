import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useMemberStore = defineStore(
  'member',
  () => {
    // 用户信息
    const profile = ref<any>()

    // 保存用户信息，登录时使用
    const setProfile = (val: any) => {
      profile.value = val
    }

    // 清理用户信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }

    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
  },
  // TODO: 持久化
  {
    persist: true,
  },
)
