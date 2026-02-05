'use client'

import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { CartItem } from '@/lib/types'

interface CartProps {
  items: CartItem[]
  total: number
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
  onClear: () => void
  onCheckout: () => void
}

export function Cart({
  items,
  total,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout,
}: CartProps) {
  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Корзина</h2>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-destructive hover:text-destructive"
          >
            Очистить
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        {items.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
            <ShoppingCart className="mb-2 h-12 w-12 opacity-30" />
            <p>Корзина пуста</p>
            <p className="text-sm">Выберите товары</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.product.price.toLocaleString('ru-RU')} ₽ x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() =>
                      onUpdateQuantity(item.product.id, item.quantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() =>
                      onUpdateQuantity(item.product.id, item.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => onRemove(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="border-t p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-medium">Итого:</span>
          <span className="text-2xl font-bold text-accent">
            {total.toLocaleString('ru-RU')} ₽
          </span>
        </div>
        <Button
          className="h-14 w-full bg-accent text-lg font-semibold text-accent-foreground hover:bg-accent/90"
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          Оформить заказ
        </Button>
      </div>
    </Card>
  )
}
