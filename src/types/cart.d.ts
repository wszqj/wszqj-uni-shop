// 定义 Discount 类型
interface Discount {
  /**
   * 主键，自增
   */
  id: number

  /**
   * 折扣类型，不能为空
   */
  typeName: string

  /**
   * 开始时间，不能为空
   */
  beginAt: string // ISO 8601 格式的日期时间字符串

  /**
   * 结束时间，不能为空
   */
  endAt: string // ISO 8601 格式的日期时间字符串

  /**
   * 创建时间，默认当前时间
   */
  createdAt: string // ISO 8601 格式的日期时间字符串

  /**
   * 更新时间，默认当前时间，更新时自动设置
   */
  updatedAt: string // ISO 8601 格式的日期时间字符串
}

// 定义 ShoppingCartItemVO 类型
interface CartItem {
  /**
   * 元素ID
   */
  itemId: number

  /**
   * 商品ID
   */
  goodsId: number

  /**
   * 商品SKU ID
   */
  itemSkuId: number

  /**
   * 商品规格信息
   */
  itemAttributeMsg: string

  /**
   * 商品名称
   */
  goodsName: string

  /**
   * 商品图片
   */
  itemImg: string

  /**
   * 商品单价
   */
  itemPrice: string // 使用 number 类型，因为 TypeScript 中没有 BigDecimal

  /**
   * 购买数量
   */
  itemCount: number

  /**
   * 商品库存
   */
  itemStock: number

  /**
   * 商品描述
   */
  goodsDesc: string

  /**
   * 折扣信息
   */
  goodsDiscount: Discount

  /**
   * 是否被选中
   */
  itemStatus: boolean
}
