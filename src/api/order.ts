import { http } from '@/utils/http'
import type { OrderPreResult } from '@/types/order'

// 获取订单结算信息
export const getOrderPreAPI = () => {
  return http<OrderPreResult>({
    method: 'GET',
    url: '/order/pre',
  })
}
// 立即购买
export const buyNowAPI = (skuId: string, count: string) => {
  return http<OrderPreResult>({
    method: 'GET',
    url: `/order/buyNow?skuId=${skuId}&count=${count}`,
  })
}
// 再次购买
export const getOrderPreAgainAPI = (orderId: string) => {
  return http<OrderPreResult>({
    method: 'GET',
    url: `/order/pre/again?orderId=${orderId}`,
  })
}
