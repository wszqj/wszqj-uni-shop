import { ref } from 'vue'
import type { HomeGuessInstance } from '@/types/component'

export const userGuessList = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<HomeGuessInstance>()
  // 获取滚动触底分页数据
  const onScrolltolower = () => {
    guessRef.value?.getMore()
  }
  // 返回封装的ref和函数
  return { guessRef, onScrolltolower }
}
