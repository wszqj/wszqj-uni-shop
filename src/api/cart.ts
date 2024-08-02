import { http } from '@/utils/http'

// 获取购物车列表
export const getCartListAPI = () => {
  return http<CartItem[]>({
    method: 'GET',
    url: '/cart/list',
  })
}
// 更新购物车单品
export const updateCartItemAPI = (data: CartItem) => {
  return http({
    method: 'PUT',
    url: '/cart/update',
    data,
  })
}

// 删除购物车单品
export const deleteCartItemAPI = (id: number) => {
  return http({
    method: 'DELETE',
    url: `/cart/delete?id=${id}`,
  })
}

// 修改全选状态
export const updateCartAllCheckedAPI = (status: boolean) => {
  return http({
    method: 'PUT',
    url: `/cart/updateAllChecked?status=${status}`,
  })
}

// 添加购物车商品
export const addShoppingCartItemAPI = (skuId: string, count: number) => {
  return http({
    method: 'PUT',
    url: `/cart/add?skuId=${skuId}&count=${count}`,
  })
}
