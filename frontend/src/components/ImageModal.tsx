"use client"

import { useState } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ProductSuggestion {
    id: string
    title: string
    price: string
    imageUrl: string
    url?: string
}

interface ImageModalProps {
    isOpen: boolean
    onClose: () => void
    product: ProductSuggestion | null
}

const ImageModal = ({ isOpen, onClose, product }: ImageModalProps) => {
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.25, 0.5))
    }

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360)
    }

    const handleDownload = async () => {
        if (!product?.imageUrl) return

        try {
            const response = await fetch(product.imageUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `${product.title.replace(/\s+/g, "_")}_${product.price}.jpg`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error("Download failed:", error)
        }
    }

    const resetTransforms = () => {
        setZoom(1)
        setRotation(0)
    }

    // Reset transforms when modal opens/closes
    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose()
            resetTransforms()
        }
    }

    if (!product) return null

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-white">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                        <p className="text-sm text-gray-600">{product.price}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 mr-4 md:mr-5">
                        <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
                            <ZoomOut className="w-4 h-4" />
                        </Button>

                        <span className="text-sm font-mono min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>

                        <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
                            <ZoomIn className="w-4 h-4" />
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleRotate}>
                            <RotateCw className="w-4 h-4" />
                        </Button>

                        <Button variant="outline" size="sm" onClick={handleDownload}>
                            <Download className="w-4 h-4" />
                        </Button>

                        <Button variant="outline" size="sm" onClick={resetTransforms}>
                            Reset View
                        </Button>
                        {/* <Button variant="ghost" size="sm" onClick={() => handleOpenChange(false)}>
                            <X className="w-4 h-4" />
                        </Button> */}
                    </div>
                </div>

                {/* Image Container */}
                <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center min-h-[400px] max-h-[70vh]">
                    <div className="relative">
                        <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.title}
                            className="max-w-full max-h-full object-contain transition-transform duration-200 cursor-grab active:cursor-grabbing"
                            style={{
                                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                transformOrigin: "center",
                            }}
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=400&width=400"
                            }}
                            draggable={false}
                        />
                    </div>
                </div>

                {/* Footer */}
                {/* <div className="p-4 border-t bg-orange-500">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">Click and drag to pan • Use controls to zoom and rotate</div>
                        <Button variant="outline" size="sm" onClick={resetTransforms}>
                            Reset View
                        </Button>
                    </div>
                </div> */}
            </DialogContent>
        </Dialog>
    )
}

export default ImageModal
