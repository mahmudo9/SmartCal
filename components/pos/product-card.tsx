'use client'

import {
  BookOpen,
  Pen,
  Tags,
  BookMarked,
  Laptop,
  Keyboard,
  Mouse,
  Camera,
  Monitor,
  Printer,
  Package,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { Product } from '@/lib/types'
import { CATEGORY_LABELS } from '@/lib/types'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Pen,
  Tags,
  BookMarked,
  Laptop,
  Keyboard,
  Mouse,
  Camera,
  Monitor,
  Printer,
  Package,
}

interface ProductCardProps {
  product: Product
  onAdd: (product: Product) => void
  isInCart?: boolean
}

export function ProductCard({ product, onAdd, isInCart }: ProductCardProps) {
  const IconComponent = ICON_MAP[product.icon] || Package

  return (
    <Card
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center gap-2 p-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]',
        isInCart && 'ring-2 ring-accent',
      )}
      onClick={() => onAdd(product)}
    >
      {/* Category and Slot badges */}
      <div className="absolute top-1.5 left-1.5 right-1.5 flex justify-between items-start">
        <span className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded font-medium truncate max-w-[60%]">
          {CATEGORY_LABELS[product.category]}
        </span>
        <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-bold">
          {product.slot}
        </span>
      </div>
      
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center rounded-xl bg-muted transition-colors group-hover:bg-accent/20 mt-4',
          isInCart && 'bg-accent/20',
        )}
      >
        <IconComponent
          className={cn(
            'h-6 w-6 text-muted-foreground transition-colors group-hover:text-accent',
            isInCart && 'text-accent',
          )}
        />
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="line-clamp-2 text-xs font-medium leading-tight">
          {product.name}
        </span>
        <span className="text-sm font-bold text-accent">
          {product.price.toLocaleString('ru-RU')} ₽
        </span>
      </div>
      {isInCart && (
        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
          +
        </div>
      )}
    </Card>
  )
}
