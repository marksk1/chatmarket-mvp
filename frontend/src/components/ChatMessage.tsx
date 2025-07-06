import { Bot, User } from "lucide-react"
import ProductSuggestionCarousel from "./ProductSuggestionCarousel"

interface ProductSuggestion {
    id: string
    title: string
    price: string
    imageUrl: string
    url?: string
}

interface ChatMessage {
    id: string
    sender: "user" | "ai"                     // ← renamed
    content: string
    messageType?: "text" | "product_suggestions"
    suggestions?: ProductSuggestion[]
    timestamp: Date
    images?: string[]
}

interface ChatMessageProps {
    message: ChatMessage
    onProductClick?: (product: ProductSuggestion) => void
}

const ChatMessage = ({ message, onProductClick }: ChatMessageProps) => {
    const isUser = message.sender === "user"   // ← renamed

    return (
        <div className={`flex gap-3 p-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? "bg-blue-600" : "bg-gray-200"
                    }`}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-white" />
                ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                )}
            </div>

            {/* Message bubble */}
            <div className={`flex-1 max-w-[80%] ${isUser ? "text-right" : "text-left"}`}>
                <div
                    className={`inline-block p-3 rounded-lg ${isUser
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-900 rounded-bl-sm"
                        }`}
                >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>

                {/* Optional product carousel */}
                {!isUser &&
                    message.messageType === "product_suggestions" &&
                    message.suggestions && (
                        <div className="mt-3">
                            <ProductSuggestionCarousel
                                suggestions={message.suggestions}
                                onProductClick={onProductClick}
                            />
                        </div>
                    )}

                <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>
        </div>
    )
}

export default ChatMessage
