'use client'

import { useState, useMemo } from 'react'
import { Search, PackageOpen, Edit2, Grid3X3, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'
import { usePosStore } from '@/hooks/use-pos-store'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Header } from './header'
import { ProductCard } from './product-card'
import { Cart } from './cart'
import { ProductDialog } from './product-dialog'
import type { Product, SlotNumber, ProductCategory } from '@/lib/types'
import { SLOTS, CATEGORIES, CATEGORY_LABELS } from '@/lib/types'

export function PosTerminal() {
  const {
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
  } = usePosStore()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all')
  const [selectedSlot, setSelectedSlot] = useState<SlotNumber | 'all'>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory
      const matchesSlot =
        selectedSlot === 'all' || product.slot === selectedSlot
      return matchesSearch && matchesCategory && matchesSlot
    })
  }, [products, search, selectedCategory, selectedSlot])

  const cartProductIds = useMemo(() => {
    return new Set(cart.map((item) => item.product.id))
  }, [cart])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (selectedCategory !== 'all') count++
    if (selectedSlot !== 'all') count++
    return count
  }, [selectedCategory, selectedSlot])

  const handleCheckout = () => {
    const sale = checkout()
    if (sale) {
      toast.success(`Заказ на ${sale.total.toLocaleString('ru-RU')} ₽ оформлен!`)
    }
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleSaveProduct = (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData)
      toast.success('Товар обновлен')
    } else {
      addProduct(productData)
      toast.success('Товар добавлен')
    }
  }

  const handleDeleteProduct = (id: string) => {
    deleteProduct(id)
    toast.success('Товар удален')
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedSlot('all')
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
          <div className="container flex h-16 items-center px-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="ml-3">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="mt-1 h-3 w-32" />
            </div>
          </div>
        </div>
        <div className="container px-4 py-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div>
              <Skeleton className="mb-6 h-10 w-full" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-36 rounded-lg" />
                ))}
              </div>
            </div>
            <Skeleton className="h-[600px] rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        sales={sales}
        onClearSales={clearSales}
        todayStats={getTodayStats()}
        onAddProduct={handleAddProduct}
        onExport={handleExport}
        onImport={handleImport}
        isSaving={isSaving}
        isPersistent={isPersistent}
      />

      <main className="container px-4 py-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          {/* Products Section */}
          <div>
            {/* Search */}
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Поиск товаров..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Категории</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => setSelectedCategory('all')}
                >
                  Все
                </Button>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    className="h-8 text-xs"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {CATEGORY_LABELS[cat]}
                  </Button>
                ))}
              </div>
            </div>

            {/* Slot Filter */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Ячейки хранения</span>
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-auto cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={clearFilters}
                  >
                    Сбросить фильтры ({activeFiltersCount})
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                <Button
                  variant={selectedSlot === 'all' ? 'default' : 'outline'}
                  className="h-10 font-bold text-sm"
                  onClick={() => setSelectedSlot('all')}
                >
                  Все
                </Button>
                {SLOTS.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedSlot === slot ? 'default' : 'outline'}
                    className="h-10 font-bold text-base"
                    onClick={() => setSelectedSlot(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            {/* Active Filters Info */}
            {(selectedCategory !== 'all' || selectedSlot !== 'all') && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Активные фильтры:</span>
                {selectedCategory !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    {CATEGORY_LABELS[selectedCategory]}
                  </Badge>
                )}
                {selectedSlot !== 'all' && (
                  <Badge variant="outline" className="text-xs">
                    Ячейка {selectedSlot}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  Найдено: {filteredProducts.length}
                </span>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="flex h-48 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                <PackageOpen className="mb-2 h-10 w-10 opacity-30" />
                <p className="text-center text-sm">
                  {products.length === 0 
                    ? 'Список товаров пуст' 
                    : 'Товары не найдены'}
                </p>
                {products.length === 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-1"
                    onClick={handleAddProduct}
                  >
                    Добавить товар
                  </Button>
                )}
                {activeFiltersCount > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="mt-1"
                    onClick={clearFilters}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group relative">
                    <ProductCard
                      product={product}
                      onAdd={addToCart}
                      isInCart={cartProductIds.has(product.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100 bg-background/80"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditProduct(product)
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Section */}
          <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-100px)]">
            <Cart
              items={cart}
              total={getTotal()}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
              onClear={clearCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={editingProduct}
        onSave={handleSaveProduct}
        onDelete={editingProduct ? handleDeleteProduct : undefined}
      />
    </div>
  )
}
