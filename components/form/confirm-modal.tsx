import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm }: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="h-16 w-16 text-[#00bcd4] mb-4" />
          <DialogTitle className="text-xl font-semibold mb-2">¿Estas seguro?</DialogTitle>
          <DialogDescription className="mb-6">
            Esto eliminará tu producto y todo su contenido de manera permanente. ¿estás seguro de continuar?
          </DialogDescription>
          <div className="flex flex-col w-full gap-2">
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="w-full bg-[#d32f2f] hover:bg-[#b71c1c] text-white"
            >
              Eliminar producto
            </Button>
            <Button
              variant="secondary"
              onClick={onClose}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}