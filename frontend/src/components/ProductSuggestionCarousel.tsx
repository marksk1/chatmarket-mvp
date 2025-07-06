"use client"
import { useState } from "react"
import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import ImageModal from "./ImageModal"

interface ProductSuggestion {
    id: string
    title: string
    price: string
    imageUrl: string
    url?: string
}

interface ProductSuggestionCarouselProps {
    suggestions: ProductSuggestion[]
    onProductClick?: (product: ProductSuggestion) => void
}

const ProductSuggestionCarousel = ({ suggestions, onProductClick }: ProductSuggestionCarouselProps) => {
    const [selectedImage, setSelectedImage] = useState<ProductSuggestion | null>(null)

    const handleImageClick = (product: ProductSuggestion, e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering onProductClick
        setSelectedImage(product)
    }

    const handleCardClick = (product: ProductSuggestion) => {
        onProductClick?.(product)
    }

    return (
        <>
            <div className="w-full py-2">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                    {suggestions.map((product) => (
                        <Card
                            key={product.id}
                            className="flex-shrink-0 w-24 cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => handleCardClick(product)}
                        >
                            <CardContent className="p-2">
                                <div
                                    className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden cursor-zoom-in"
                                    onClick={(e) => handleImageClick(product, e)}
                                >
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl || "/placeholder.svg"}
                                            alt={product.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement
                                                target.style.display = "none"
                                                target.nextElementSibling?.classList.remove("hidden")
                                            }}
                                        />
                                    ) : null}
                                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hidden">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21,15 16,10 5,21" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-xs font-medium text-center truncate">{product.price}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            <ImageModal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} product={selectedImage} />
        </>
    )
}

export default ProductSuggestionCarousel
