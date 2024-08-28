import { http } from '@/utils/http'
import type { ShopInfo } from '@/types/shopInfo'

export const getShopInfoAPI = () => {
  return http<ShopInfo>({
    method: 'GET',
    url: '/shopInfo/info',
  })
}
