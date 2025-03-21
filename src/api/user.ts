import { http } from '@/utils/http'
import type { LoginParams, LoginResult, ProfileDetail, ProfileParams } from '@/types/member'

// 用户登录
export const loginAPI = (data: LoginParams) => {
  return http<LoginResult>({
    method: 'POST',
    url: '/user/login',
    data,
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

// 修改个人信息
export const updateProfileAPI = (data: ProfileParams) => {
  return http<ProfileDetail>({
    method: 'PUT',
    url: '/user/update',
    data,
  })
}
