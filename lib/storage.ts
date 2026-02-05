'use client'

import localforage from 'localforage'
import type { Product, Sale } from './types'

// Configure localForage to use IndexedDB with fallback
localforage.config({
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: 'SmartPOS',
  version: 1.0,
  storeName: 'smartpos_data',
  description: 'SmartPOS data storage',
})

// Storage keys
const KEYS = {
  products: 'products',
  sales: 'sales',
  lastBackup: 'lastBackup',
}

// Request persistent storage (protection against iOS clearing)
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage?.persist) {
    try {
      const isPersisted = await navigator.storage.persist()
      return isPersisted
    } catch {
      return false
    }
  }
  return false
}

// Check if storage is persistent
export async function isPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.storage?.persisted) {
    try {
      return await navigator.storage.persisted()
    } catch {
      return false
    }
  }
  return false
}

// Products storage
export async function saveProducts(products: Product[]): Promise<void> {
  try {
    await localforage.setItem(KEYS.products, products)
    // Also save to localStorage as backup
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smartpos-backup-products', JSON.stringify(products))
    }
  } catch (error) {
    console.error('Failed to save products:', error)
    // Fallback to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smartpos-backup-products', JSON.stringify(products))
    }
  }
}

export async function loadProducts(): Promise<Product[]> {
  try {
    const products = await localforage.getItem<Product[]>(KEYS.products)
    if (products && products.length > 0) {
      return products
    }
    // Try localStorage backup
    if (typeof localStorage !== 'undefined') {
      const backup = localStorage.getItem('smartpos-backup-products')
      if (backup) {
        const parsed = JSON.parse(backup) as Product[]
        // Migrate to IndexedDB
        await localforage.setItem(KEYS.products, parsed)
        return parsed
      }
    }
    return []
  } catch (error) {
    console.error('Failed to load products:', error)
    // Fallback to localStorage
    if (typeof localStorage !== 'undefined') {
      const backup = localStorage.getItem('smartpos-backup-products')
      if (backup) {
        return JSON.parse(backup) as Product[]
      }
    }
    return []
  }
}

// Sales storage
export async function saveSales(sales: Sale[]): Promise<void> {
  try {
    await localforage.setItem(KEYS.sales, sales)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smartpos-backup-sales', JSON.stringify(sales))
    }
  } catch (error) {
    console.error('Failed to save sales:', error)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smartpos-backup-sales', JSON.stringify(sales))
    }
  }
}

export async function loadSales(): Promise<Sale[]> {
  try {
    const sales = await localforage.getItem<Sale[]>(KEYS.sales)
    if (sales) {
      return sales
    }
    if (typeof localStorage !== 'undefined') {
      const backup = localStorage.getItem('smartpos-backup-sales')
      if (backup) {
        const parsed = JSON.parse(backup) as Sale[]
        await localforage.setItem(KEYS.sales, parsed)
        return parsed
      }
    }
    return []
  } catch (error) {
    console.error('Failed to load sales:', error)
    if (typeof localStorage !== 'undefined') {
      const backup = localStorage.getItem('smartpos-backup-sales')
      if (backup) {
        return JSON.parse(backup) as Sale[]
      }
    }
    return []
  }
}

// Export all data as JSON
export interface ExportData {
  version: number
  exportDate: string
  products: Product[]
  sales: Sale[]
}

export async function exportData(): Promise<ExportData> {
  const products = await loadProducts()
  const sales = await loadSales()
  return {
    version: 1,
    exportDate: new Date().toISOString(),
    products,
    sales,
  }
}

export function downloadExport(data: ExportData): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `smartpos-backup-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importData(
  file: File,
): Promise<{ products: Product[]; sales: Sale[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text) as ExportData
        
        // Validate data structure
        if (!data.products || !Array.isArray(data.products)) {
          throw new Error('Invalid products data')
        }
        if (!data.sales || !Array.isArray(data.sales)) {
          data.sales = []
        }
        
        // Save imported data
        await saveProducts(data.products)
        await saveSales(data.sales)
        
        resolve({ products: data.products, sales: data.sales })
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Clear all data
export async function clearAllData(): Promise<void> {
  await localforage.clear()
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('smartpos-backup-products')
    localStorage.removeItem('smartpos-backup-sales')
  }
}
