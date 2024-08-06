import { http } from '@/utils/http'
import type {
  OrderCreateParams,
  OrderListParams,
  OrderListResult,
  OrderPreResult,
  OrderResult,
} from '@/types/order'

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

// 提交订单
export const createOrderAPI = (data: OrderCreateParams) => {
  return http<string>({
    method: 'POST',
    url: '/order/create',
    data,
  })
}

// 获取订单列表
export const getOrderListAPI = (query: OrderListParams) => {
  return http<OrderListResult>({
    method: 'GET',
    url: `/order/list?page=${query.page}&pageSize=${query.pageSize}&orderState=${query.orderState}`,
  })
}
// 获取订单详情
export const getOrderDetailAPI = (id: string) => {
  return http<OrderResult>({
    method: 'GET',
    url: `/order/detail?id=${id}`,
  })
}

// 模拟支付
export const payOrderAPI = (id: string) => {
  return http({
    method: 'POST',
    url: `/order/pay?id=${id}`,
  })
}
// 删除订单
export const deleteOrderAPI = (id: string) => {
  return http({
    method: 'DELETE',
    url: `/order/delete?id=${id}`,
  })
}
