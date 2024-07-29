import type { AddressItem, AddressParams } from '@/types/address'
import { http } from '@/utils/http'

// 获取用户收货地址列表
export const getAddressListAPI = () => {
  return http<AddressItem[]>({
    method: 'GET',
    url: '/user/address',
  })
}

// 新增收货地址
export const addAddressAPI = (data: AddressParams) => {
  return http({
    method: 'POST',
    url: '/user/add',
    data,
  })
}

// 新增收货地址
export const updateAddressAPI = (data: AddressParams) => {
  return http({
    method: 'PUT',
    url: '/user/update',
    data,
  })
}
