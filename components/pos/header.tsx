'use client'

import React from "react"

import { useRef } from 'react'
import { Moon, Sun, Plus, Download, Upload, Shield, ShieldAlert } from 'lucide-react'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SalesHistory } from './sales-history'
import type { Sale } from '@/lib/types'

interface HeaderProps {
  sales: Sale[]
  onClearSales: () => void
  todayStats: { count: number; total: number }
  onAddProduct: () => void
  onExport: () => void
  onImport: (file: File) => Promise<void>
  isSaving: boolean
  isPersistent: boolean
}

export function Header({
  sales,
  onClearSales,
  todayStats,
  onAddProduct,
  onExport,
  onImport,
  isSaving,
  isPersistent,
}: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await onImport(file)
      toast.success('Данные успешно импортированы')
    } catch (error) {
      toast.error('Ошибка импорта данных')
      console.error('Import error:', error)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleExportClick = () => {
    onExport()
    toast.success('Резервная копия скачана')
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
            <span className="text-lg font-bold text-accent-foreground">SP</span>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold leading-tight">SmartPOS</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    {isPersistent ? (
                      <Shield className="h-4 w-4 text-accent" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent>
                    {isPersistent
                      ? 'Хранилище защищено'
                      : 'Рекомендуем делать резервные копии'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {isSaving && (
                <span className="text-xs text-muted-foreground animate-pulse">
                  Сохранение...
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Умный калькулятор продаж
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Data backup dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-transparent">
                <Download className="h-4 w-4" />
                <span className="sr-only">Резервное копирование</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportClick}>
                <Download className="mr-2 h-4 w-4" />
                Экспорт данных (JSON)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImportClick}>
                <Upload className="mr-2 h-4 w-4" />
                Импорт данных
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                {isPersistent ? (
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-accent" />
                    Данные защищены от очистки
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" />
                    Делайте резервные копии
                  </span>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleFileChange}
          />

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
