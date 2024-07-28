import type { SkuPopupLocaldata } from '@/components/vk-data-goods-sku-popup/vk-data-goods-sku-popup'

export const localData: SkuPopupLocaldata = {
  _id: '101',
  name: 'T恤',
  goods_thumb: '/images/tshirt.jpg',
  spec_list: [
    { name: '颜色', list: [{ name: '红色' }, { name: '蓝色' }] },
    { name: '尺寸', list: [{ name: 'M' }, { name: 'L' }] },
  ],
  sku_list: [
    {
      _id: '1',
      goods_id: '101',
      goods_name: 'T恤',
      image: '/images/tshirt-red-m.jpg',
      price: 2999, // 注意：乘以 100
      sku_name_arr: ['红色', 'M'],
      stock: 100,
    },
    {
      _id: '2',
      goods_id: '101',
      goods_name: 'T恤',
      image: '/images/tshirt-red-l.jpg',
      price: 2999,
      sku_name_arr: ['红色', 'L'],
      stock: 50,
    },
    {
      _id: '3',
      goods_id: '101',
      goods_name: 'T恤',
      image: '/images/tshirt-blue-m.jpg',
      price: 2999,
      sku_name_arr: ['蓝色', 'M'],
      stock: 80,
    },
    {
      _id: '4',
      goods_id: '101',
      goods_name: 'T恤',
      image: '/images/tshirt-blue-l.jpg',
      price: 2999,
      sku_name_arr: ['蓝色', 'L'],
      stock: 30,
    },
  ],
}
