export const baseImgUrl = 'http://localhost/dev-api'
// 计算商品的图片路径
export const getFullImageUrl = (src: string) => {
  return src.startsWith('http') ? src : baseImgUrl + src
}
