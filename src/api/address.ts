import type { AddressItem } from '@/types/address'
import { http } from '@/utils/http'

// 获取用户收货地址列表
export const getAddressListAPI = () => {
  return http<AddressItem[]>({
    method: 'GET',
    url: '/user/address',
  })
}
