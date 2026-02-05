'use client'

import { useState, useEffect } from 'react'
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
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product, SlotNumber, ProductCategory } from '@/lib/types'
import { SLOTS, CATEGORIES, CATEGORY_LABELS } from '@/lib/types'

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

const AVAILABLE_ICONS = Object.keys(ICON_MAP)

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product | null
  onSave: (product: Omit<Product, 'id'>) => void
  onDelete?: (id: string) => void
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
  onDelete,
}: ProductDialogProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [icon, setIcon] = useState('Package')
  const [category, setCategory] = useState<ProductCategory>('books')
  const [slot, setSlot] = useState<SlotNumber>(1)

  useEffect(() => {
    if (product) {
      setName(product.name)
      setPrice(product.price.toString())
      setIcon(product.icon)
      setCategory(product.category)
      setSlot(product.slot)
    } else {
      setName('')
      setPrice('')
      setIcon('Package')
      setCategory('books')
      setSlot(1)
    }
  }, [product, open])

  const handleSave = () => {
    if (!name.trim() || !price) return

    onSave({
      name: name.trim(),
      price: Number.parseFloat(price),
      icon,
      category,
      slot,
    })
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (product && onDelete) {
      onDelete(product.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Редактировать товар' : 'Добавить товар'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Название</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Введите название"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="price">Цена (₽)</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              min="0"
              step="1"
            />
          </div>

          <div className="grid gap-2">
            <Label>Категория</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as ProductCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Ячейка хранения</Label>
            <div className="grid grid-cols-6 gap-2">
              {SLOTS.map((slotNum) => (
                <Button
                  key={slotNum}
                  variant={slot === slotNum ? 'default' : 'outline'}
                  size="sm"
                  className="h-10 font-bold"
                  onClick={() => setSlot(slotNum)}
                  type="button"
                >
                  {slotNum}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Иконка</Label>
            <div className="grid grid-cols-6 gap-2 max-h-24 overflow-y-auto p-1">
              {AVAILABLE_ICONS.map((iconName) => {
                const IconComponent = ICON_MAP[iconName]
                return (
                  <Button
                    key={iconName}
                    variant={icon === iconName ? 'default' : 'outline'}
                    size="icon"
                    className="h-10 w-10"
                    onClick={() => setIcon(iconName)}
                    type="button"
                  >
                    <IconComponent className="h-5 w-5" />
                  </Button>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          {product && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto"
            >
              Удалить
            </Button>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || !price}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Сохранить
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
