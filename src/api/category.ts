import { http } from '@/utils/http'
import type { CategoryTopItem } from '@/types/category'

// 获取分类列表
export const getCategoryListAPI = () => {
  return http<CategoryTopItem[]>({
    method: 'GET',
    url: '/category/list',
  })
}
