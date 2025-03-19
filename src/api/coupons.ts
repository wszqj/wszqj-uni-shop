import { http } from '@/utils/http'
import type { CouponItem, CouponQuery } from '@/types/coupon'
// 查询在售或可领取的优惠券
export const getCouponListAPI = () => {
  return http<CouponItem[]>({
    method: 'GET',
    url: '/coupon/list',
  })
}

// 领取优惠券
export const receiveCouponAPI = (data: CouponQuery) => {
  return http({
    method: 'POST',
    url: `/coupon/receive`,
    data,
  })
}

// 获取当前用户已领取的优惠券列表
export const getCurrentUserCouponsAPI = () => {
  return http<CouponItem[]>({
    method: 'GET',
    url: `/coupon`,
  })
}
