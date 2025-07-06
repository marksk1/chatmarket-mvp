"use client"

import { useState } from "react"
import { ArrowLeft, Bot, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatInterface from "@/components/ChatInterface"
import BuyChatOptionsModal from "@/components/BuyChatOptionsModal"
import { useNavigate } from "react-router-dom"

const BuyChat = () => {
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false)
  const chatTitle = "Vintage Americana Sneakers"
  const navigate = useNavigate()
  const handleBack = () => {
    // Handle navigation back
    console.log("Navigate back")
    navigate(-1);
  }

  const handleViewDraftListing = () => {
    console.log("View draft listing")
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Enhanced Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Buy Chats</span>
                  <span className="text-sm text-gray-400">›</span>
                  <span className="text-sm font-medium text-gray-900">{chatTitle}</span>
                </div>
                <p className="text-xs text-gray-500">Chat with AI to discover great deals</p>
              </div>
            </div>
            <Bot className="w-6 h-6 text-blue-600" />
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsOptionsModalOpen(true)}>
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1">
        <ChatInterface type="buy" onViewDraftListing={handleViewDraftListing} />
      </div>

      {/* Buy Chat Options Modal */}
      <BuyChatOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        chatTitle={chatTitle}
      />
    </div>
  )
}

export default BuyChat
