import { http } from '@/utils/http'
import type { OrderPreResult } from '@/types/order'

// 获取订单结算信息
export const getOrderPreAPI = () => {
  return http<OrderPreResult>({
    method: 'GET',
    url: '/order/pre',
  })
}
