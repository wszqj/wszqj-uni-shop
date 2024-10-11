export type CouponItem = {
  // 优惠券ID
  id: number // 或者使用特定的类型，如 number | null | undefined，根据具体需求
  // 店铺名称
  sellerName: string
  // 可低金额
  money: number // 如果需要精确处理，可以考虑使用 decimal.js 或 big.js
  // 可以使用的最小金额
  minMoney: number // 同上
  // 券码
  ticket: string
  // 标题
  title: string
  // 过期时间
  endTime: string // 符合 yyyy-MM-dd HH:mm:ss 格式的字符串
  // 开抢时间
  beginTime: string
  // 优惠券状态
  status: number
}
