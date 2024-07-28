import { http } from '@/utils/http'
import type { LoginResult } from '@/types/member'

// 用户登录
export const loginAPI = (phone: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/user/login',
    data: { phone },
  })
}
