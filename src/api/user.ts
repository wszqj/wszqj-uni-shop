import { http } from '@/utils/http'
import type { LoginResult, ProfileDetail } from '@/types/member'

// 用户登录
export const loginAPI = (phone: string) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/user/login',
    data: { phone },
  })
}

// 更新用户头像
export const updateAvatarAPI = (avatar: string) => {
  return http({
    method: 'POST',
    url: '/user/avatar',
    data: { avatar },
  })
}

// 获取用户信息
export const getProfileDetailAPI = () => {
  return http<ProfileDetail>({
    method: 'GET',
    url: '/user/profile',
  })
}
