import { http } from '@/utils/http'
import type {
  Advertisement,
  GoodsDetail,
  GoodsListParams,
  GoodsListVO,
  PageResult,
} from '@/types/home'

// 获取商品列表
export const getGoodsListAPI = (data?: GoodsListParams) => {
  return http<PageResult<GoodsListVO>>({
    method: 'GET',
    url: '/home/list',
    data,
  })
}

// 根据商品ID获取商品详情
export const getGoodsDetailAPI = (id: number) => {
  return http<GoodsDetail>({
    method: 'GET',
    url: '/home/detail',
    data: {
      id,
    },
  })
}

// 获取广告轮播图列表
export const getAdvertisementListAPI = () => {
  return http<Advertisement[]>({
    method: 'GET',
    url: '/home/advertisement',
  })
}
