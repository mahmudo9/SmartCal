'use client'

import { Receipt, Trash2, Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import type { Sale } from '@/lib/types'

interface SalesHistoryProps {
  sales: Sale[]
  onClear: () => void
  todayStats: { count: number; total: number }
}

export function SalesHistory({ sales, onClear, todayStats }: SalesHistoryProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Receipt className="h-4 w-4" />
          <span className="hidden sm:inline">История</span>
          {todayStats.count > 0 && (
            <Badge variant="secondary" className="ml-1">
              {todayStats.count}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              История продаж
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="mt-6">
          <Card className="mb-6 bg-accent/10 p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">Сегодня</p>
                <p className="text-lg font-bold">
                  {todayStats.total.toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <Badge className="ml-auto bg-accent text-accent-foreground">
                {todayStats.count} заказов
              </Badge>
            </div>
          </Card>

          {sales.length > 0 && (
            <div className="mb-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClear}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Очистить историю
              </Button>
            </div>
          )}

          <ScrollArea className="h-[calc(100vh-280px)]">
            {sales.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
                <Receipt className="mb-2 h-12 w-12 opacity-30" />
                <p>Нет продаж</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pr-4">
                {sales.map((sale) => (
                  <Card key={sale.id} className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {sale.date}
                      </span>
                      <span className="font-bold text-accent">
                        {sale.total.toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {sale.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-muted-foreground">
                            {item.product.name} x{item.quantity}
                          </span>
                          <span>
                            {(item.product.price * item.quantity).toLocaleString(
                              'ru-RU',
                            )}{' '}
                            ₽
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
