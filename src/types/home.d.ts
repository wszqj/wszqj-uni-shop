// 分页结果类型
export type PageResult<T> = {
  // 总记录数
  total: number
  // 每页条数
  pageSize: number
  // 总页数
  pages: number
  // 当前页数
  page: number
  // 当前页数据集合
  records: T[]
}
// 商品列表类型
export type GoodsListVO = {
  id: string
  name: string
  price: string
  picture: string
}
// 商品查询参数
export type GoodsListParams = {
  page?: number
  pageSize?: number
  name: string
}
// 轮播图类型
export type Advertisement = {
  /**
   * 序号
   */
  id: string
  /**
   * 图片
   */
  url: string

  /**
   * 创建时间
   */
  createdAt: string

  /**
   * 图片描述
   */
  des: string

  /**
   * 状态
   */
  status: number
}
export type AppointmentItem = {
  id: number
  name: string
  phone: string
  desc: string
  time: string
  status: number
}
// 基础实体类型
interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

// 商品分类类型
interface Category extends BaseEntity {
  name: string
  description: string
  icon: string
  parentId: number
}

// 品牌类型
interface Brand extends BaseEntity {
  name: string
  description: string
}

// 折扣类型
interface Discount extends BaseEntity {
  typeName: string
  beginAt: string
  endAt: string
}

// SKU 类型
interface Sku extends BaseEntity {
  goodsId: number
  attributes: string[] // 属性值数组
  price: number
  stock: number
  pictures: string // 图片 URL
}

// 规格属性类型
interface SpecAttribute {
  name: string // 属性值名称
}

// 规格类型
interface Spec {
  name: string // 规格名称，例如 "颜色" 或 "尺寸"
  attributes: SpecAttribute[] // 属性值列表
}

// 商品详细信息中的详细项类型
interface Detail {
  name: string // 详细项名称，例如 "产地"
  value: string // 详细项值，例如 "河南商丘"
}

// 商品详细信息类型
interface GoodsDetail {
  id: string
  name: string
  description: string
  mainVideos: string[] // 视频 URL 列表
  videoScale: number // 视频比例
  price: number
  oldPrice: number
  details: Detail[] // 详细项列表
  createdAt: string
  status: string
  category: Category // 分类信息
  brand: Brand // 品牌信息
  discount: Discount // 折扣信息
  skus: Sku[] // SKU 列表
  specs: Spec[] // 规格列表
}
