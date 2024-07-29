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
    url: '/user/addDeliveryAddress',
    data,
  })
}

// 新增收货地址
export const updateAddressAPI = (data: AddressParams) => {
  return http({
    method: 'PUT',
    url: '/user/updateDeliveryAddress',
    data,
  })
}

// 根据ID查询地址信息
export const getAddressAPI = (id: string) => {
  return http<AddressItem>({
    method: 'GET',
    url: `/user/deliveryAddress?id=${id}`,
  })
}
