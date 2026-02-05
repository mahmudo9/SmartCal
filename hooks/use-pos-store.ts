'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { Product, CartItem, Sale } from '@/lib/types'
import {
  saveProducts,
  loadProducts,
  saveSales,
  loadSales,
  requestPersistentStorage,
  exportData,
  downloadExport,
  importData,
} from '@/lib/storage'

export function usePosStore() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isPersistent, setIsPersistent] = useState(false)
  
  // Track if this is the initial load
  const initialLoadDone = useRef(false)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Request persistent storage and load data on mount
  useEffect(() => {
    const initStorage = async () => {
      // Request persistent storage for iOS protection
      const persistent = await requestPersistentStorage()
      setIsPersistent(persistent)
      
      // Load saved data
      const [savedProducts, savedSales] = await Promise.all([
        loadProducts(),
        loadSales(),
      ])
      
      setProducts(savedProducts)
      setSales(savedSales)
      setIsLoaded(true)
      initialLoadDone.current = true
    }

    initStorage()
  }, [])

  // Auto-save products with debounce
  useEffect(() => {
    if (!initialLoadDone.current) return
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    
    // Debounce save to prevent too many writes
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      await saveProducts(products)
      setIsSaving(false)
    }, 100)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [products])

  // Auto-save sales immediately (important transaction data)
  useEffect(() => {
    if (!initialLoadDone.current) return
    
    const saveSalesData = async () => {
      setIsSaving(true)
      await saveSales(sales)
      setIsSaving(false)
    }
    
    saveSalesData()
  }, [sales])

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

  // Export data function
  const handleExport = useCallback(async () => {
    const data = await exportData()
    downloadExport(data)
  }, [])

  // Import data function
  const handleImport = useCallback(async (file: File) => {
    const { products: importedProducts, sales: importedSales } =
      await importData(file)
    setProducts(importedProducts)
    setSales(importedSales)
  }, [])

  return {
    products,
    cart,
    sales,
    isLoaded,
    isSaving,
    isPersistent,
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
    handleExport,
    handleImport,
  }
}
