'use client'

import { Moon, Sun, Plus, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { SalesHistory } from './sales-history'
import type { Sale } from '@/lib/types'

interface HeaderProps {
  sales: Sale[]
  onClearSales: () => void
  todayStats: { count: number; total: number }
  onAddProduct: () => void
}

export function Header({
  sales,
  onClearSales,
  todayStats,
  onAddProduct,
}: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <span className="text-lg font-bold text-accent-foreground">SP</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold leading-tight">SmartPOS</h1>
            <p className="text-xs text-muted-foreground">
              Умный калькулятор продаж
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={onAddProduct}
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Добавить товар</span>
          </Button>

          <SalesHistory
            sales={sales}
            onClear={onClearSales}
            todayStats={todayStats}
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Переключить тему</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
