import { http } from '@/utils/http'
import type {
  Advertisement,
  GoodsDetail,
  GoodsListParams,
  GoodsListVO,
  PageResult,
} from '@/types/home'
import type { Appointment } from '@/types/appointment'

// 获取商品列表
export const getGoodsListAPI = (data?: GoodsListParams) => {
  return http<PageResult<GoodsListVO>>({
    method: 'GET',
    url: `/goods/like/list?
    page=${data?.page}
    &pageSize=${data?.pageSize}
    &name=${data?.name}
    &discountId=${data?.discountId}
    &brandName=${data?.brandName}
    &categoryName=${data?.categoryName}
    &discountName=${data?.discountName}`,
    data,
  })
}

// 根据商品ID获取商品详情
export const getGoodsDetailAPI = (id: number) => {
  return http<GoodsDetail>({
    method: 'GET',
    url: '/goods/detail',
    data: {
      id,
    },
  })
}

// 获取广告轮播图列表
export const getAdvertisementListAPI = () => {
  return http<Advertisement[]>({
    method: 'GET',
    url: '/advertisement/advertisement',
  })
}
