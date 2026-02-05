'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Product, CartItem, Sale } from '@/lib/types'

const STORAGE_KEYS = {
  products: 'smartpos-products-v3',
  sales: 'smartpos-sales',
}

const defaultProducts: Product[] = [
  { id: '1', name: 'Учебник Python', price: 1500, icon: 'BookOpen', category: 'books', slot: 1 },
  { id: '2', name: 'Роман', price: 650, icon: 'BookOpen', category: 'books', slot: 1 },
  { id: '3', name: 'Шариковая ручка', price: 50, icon: 'Pen', category: 'pens', slot: 2 },
  { id: '4', name: 'Гелевая ручка', price: 120, icon: 'Pen', category: 'pens', slot: 2 },
  { id: '5', name: 'Набор наклеек', price: 200, icon: 'Tags', category: 'stickers', slot: 3 },
  { id: '6', name: 'Виниловая наклейка', price: 80, icon: 'Tags', category: 'stickers', slot: 3 },
  { id: '7', name: 'Обложка для книги', price: 350, icon: 'BookMarked', category: 'covers', slot: 4 },
  { id: '8', name: 'Обложка на паспорт', price: 450, icon: 'BookMarked', category: 'covers', slot: 4 },
  { id: '9', name: 'MacBook Pro', price: 180000, icon: 'Laptop', category: 'laptops', slot: 5 },
  { id: '10', name: 'Lenovo ThinkPad', price: 95000, icon: 'Laptop', category: 'laptops', slot: 5 },
  { id: '11', name: 'Механическая клавиатура', price: 8500, icon: 'Keyboard', category: 'keyboards', slot: 6 },
  { id: '12', name: 'Беспроводная клавиатура', price: 4500, icon: 'Keyboard', category: 'keyboards', slot: 6 },
  { id: '13', name: 'Игровая мышь', price: 5500, icon: 'Mouse', category: 'mice', slot: 1 },
  { id: '14', name: 'Беспроводная мышь', price: 2500, icon: 'Mouse', category: 'mice', slot: 1 },
  { id: '15', name: 'Canon EOS R5', price: 350000, icon: 'Camera', category: 'cameras', slot: 2 },
  { id: '16', name: 'Sony Alpha A7', price: 180000, icon: 'Camera', category: 'cameras', slot: 2 },
  { id: '17', name: 'Монитор 27"', price: 35000, icon: 'Monitor', category: 'monitors', slot: 3 },
  { id: '18', name: 'Монитор 32" 4K', price: 55000, icon: 'Monitor', category: 'monitors', slot: 3 },
  { id: '19', name: 'Лазерный принтер', price: 25000, icon: 'Printer', category: 'printers', slot: 4 },
  { id: '20', name: 'МФУ цветной', price: 45000, icon: 'Printer', category: 'printers', slot: 4 },
]

export function usePosStore() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEYS.products)
    const savedSales = localStorage.getItem(STORAGE_KEYS.sales)

    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch {
        setProducts(defaultProducts)
      }
    } else {
      setProducts(defaultProducts)
    }

    if (savedSales) {
      try {
        setSales(JSON.parse(savedSales))
      } catch {
        setSales([])
      }
    }

    setIsLoaded(true)
  }, [])

  // Save products to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products))
    }
  }, [products, isLoaded])

  // Save sales to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales))
    }
  }, [sales, isLoaded])

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { product, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId))
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getTotal = useCallback(() => {
    return cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    )
  }, [cart])

  const checkout = useCallback(() => {
    if (cart.length === 0) return null

    const sale: Sale = {
      id: Date.now().toString(),
      items: [...cart],
      total: getTotal(),
      date: new Date().toLocaleString('ru-RU'),
      timestamp: Date.now(),
    }

    setSales((prev) => [sale, ...prev])
    setCart([])
    return sale
  }, [cart, getTotal])

  const addProduct = useCallback((product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    }
    setProducts((prev) => [...prev, newProduct])
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    )
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const clearSales = useCallback(() => {
    setSales([])
  }, [])

  const getTodayStats = useCallback(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todaySales = sales.filter((s) => s.timestamp >= today.getTime())
    return {
      count: todaySales.length,
      total: todaySales.reduce((sum, s) => sum + s.total, 0),
    }
  }, [sales])

  return {
    products,
    cart,
    sales,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    checkout,
    addProduct,
    updateProduct,
    deleteProduct,
    clearSales,
    getTodayStats,
  }
}
