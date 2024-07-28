import { http } from '@/utils/http'

// 用户登录
export const loginAPI = (phone: string) => {
  return http({
    method: 'POST',
    url: '/user/login',
    data: {
      phone,
    },
  })
}
