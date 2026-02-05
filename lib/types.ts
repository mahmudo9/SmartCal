export type SlotNumber = 1 | 2 | 3 | 4 | 5 | 6

export type ProductCategory =
  | 'books'
  | 'pens'
  | 'stickers'
  | 'covers'
  | 'laptops'
  | 'keyboards'
  | 'mice'
  | 'cameras'
  | 'monitors'
  | 'printers'

export interface Product {
  id: string
  name: string
  price: number
  icon: string
  category: ProductCategory
  slot: SlotNumber
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Sale {
  id: string
  items: CartItem[]
  total: number
  date: string
  timestamp: number
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  books: 'Книги',
  pens: 'Ручки',
  stickers: 'Наклейки',
  covers: 'Обложки',
  laptops: 'Ноутбуки',
  keyboards: 'Клавиатуры',
  mice: 'Мышки',
  cameras: 'Камеры',
  monitors: 'Мониторы',
  printers: 'Принтеры',
}

export const CATEGORIES: ProductCategory[] = [
  'books',
  'pens',
  'stickers',
  'covers',
  'laptops',
  'keyboards',
  'mice',
  'cameras',
  'monitors',
  'printers',
]

export const SLOT_LABELS: Record<SlotNumber, string> = {
  1: 'Ячейка 1',
  2: 'Ячейка 2',
  3: 'Ячейка 3',
  4: 'Ячейка 4',
  5: 'Ячейка 5',
  6: 'Ячейка 6',
}

export const SLOTS: SlotNumber[] = [1, 2, 3, 4, 5, 6]
