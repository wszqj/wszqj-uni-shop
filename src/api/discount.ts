import { http } from '@/utils/http'
import type { discountActivityItem } from '@/types/discount'

// 获取所有进行中的活动
export const getAllDiscountActivityAPI = () => {
  return http<discountActivityItem[]>({
    method: 'GET',
    url: '/discount/all',
  })
}

// 根据活动ID查询活动信息
export const getDiscountByIdAPI = (id: number) => {
  return http<discountActivityItem>({
    method: 'GET',
    url: `/discount/discountVO?id=${id}`,
  })
}
