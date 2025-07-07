"use client"

import type React from "react"
import { MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Listing {
  id: string
  title: string
  price: number
  images: string[]
  condition: string
  description: string
  status: "active" | "sold" | "draft"
  createdAt: Date
}

interface ListingCardProps {
  listing: Listing
  onCardClick: (listing: Listing) => void
  onOptionsClick: (listing: Listing) => void
}

const ListingCard = ({ listing, onCardClick, onOptionsClick }: ListingCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onOptionsClick(listing)
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group h-32"
      onClick={() => onCardClick(listing)}
    >
      <div className="flex h-full">
        {/* Image Section */}
        <div className="relative w-32 h-full flex-shrink-0">
          <img
            src={listing.images[0] || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                listing.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}
            >
              {listing.status === "active" ? "Active" : "Sold"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col justify-between px-4 py-2 relative">
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-gray-900 line-clamp-1 pr-2 flex-1">{listing.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 hover:bg-gray-100 flex-shrink-0"
                onClick={handleOptionsClick}
              >
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </Button>
            </div>
            <p className="text-lg font-bold text-green-600 mb-1">${listing.price}</p>
            <p className="text-sm text-gray-600 mb-1">{listing.condition}</p>
          </div>
          <p className="text-sm text-gray-500">Listed {formatDate(listing.createdAt)}</p>
        </div>
      </div>
    </Card>
  )
}

export default ListingCard
