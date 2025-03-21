/** 封装通用信息 */
type BaseProfile = {
  /** 用户ID */
  id: number
  /** 头像  */
  avatar: string
  /** 账户名  */
  account: string
  /** 昵称 */
  nickname?: string
}

/** 小程序登录 登录用户信息 */
export type LoginResult = BaseProfile & {
  /** 用户ID */
  id: number
  /** 头像  */
  avatar: string
  /** 账户名  */
  account: string
  /** 昵称 */
  nickname?: string
  /** 手机号 */
  mobile: string
  /** 登录凭证 */
  token: string
}
/** 小程序登录参数 */
export type LoginParams = {
  // 临时登录凭证
  code: string
  // 登录方式
  type: string
  // 手机号
  phone: string
}

/** 个人信息 用户详情信息 */
export type ProfileDetail = BaseProfile & {
  /** 性别 */
  gender?: Gender
  /** 生日 */
  birthday?: string
  /** 省市区 */
  fullLocation?: string
}
/** 性别 */
export type Gender = '女性' | '男性'

// 修改个人信息 请求参数
export type ProfileParams = Pick<ProfileDetail, 'nickname' | 'gender' | 'birthday'> & {
  /** 省市区 */
  fullLocation: string
}
