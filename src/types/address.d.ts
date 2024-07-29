/** 添加收货地址: 请求参数 */
export type AddressParams = {
  /** 收货人姓名 */
  consignee: string
  /** 联系方式 */
  phone: string
  /** 详细地址 */
  address: string
  /** 默认地址，1为是，0为否 */
  status: number
}

/** 收货地址项 */
export type AddressItem = AddressParams & {
  /** 收货地址 id */
  id: string
  /** 省市区 */
  fullLocation: string
}
