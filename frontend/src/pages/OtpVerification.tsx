import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface OTPVerificationProps {
    email: string
    onVerify: (otp: string) => void
    onResend: () => void
    onBack: () => void
    isLoading?: boolean
}

export default function OTPVerification({
    email,
    onVerify,
    onResend,
    onBack,
    isLoading = false,
}: OTPVerificationProps) {
    const [otp, setOtp] = useState<string[]>(["", "", "", ""])
    const [error, setError] = useState<string>("")
    const [resendTimer, setResendTimer] = useState<number>(60)
    const [canResend, setCanResend] = useState<boolean>(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Timer for resend functionality
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(resendTimer - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [resendTimer])

    const handleInputChange = (index: number, value: string) => {
        setError("")

        // Only allow single digit
        if (value.length > 1) {
            value = value.slice(-1)
        }

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
            return
        }

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Move to next input if value is entered
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                // If current input is empty and backspace is pressed, move to previous input
                inputRefs.current[index - 1]?.focus()
            } else if (otp[index]) {
                // If current input has value, clear it
                const newOtp = [...otp]
                newOtp[index] = ""
                setOtp(newOtp)
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === "ArrowRight" && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)

        if (pastedData.length === 4) {
            const newOtp = pastedData.split("")
            setOtp(newOtp)
            inputRefs.current[3]?.focus()
        }
    }

    const handleSubmit = () => {
        const otpString = otp.join("")

        if (otpString.length !== 4) {
            setError("Please enter all 4 digits")
            return
        }

        onVerify(otpString)
    }

    const handleResend = () => {
        if (canResend) {
            setResendTimer(60)
            setCanResend(false)
            setError("")
            onResend()
        }
    }

    const isComplete = otp.every((digit) => digit !== "")

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CM</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">Chat Market</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
                    <p className="text-gray-600">
                        We've sent a 4-digit code to <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>

                <Card className="shadow-lg border-0">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl">Enter Verification Code</CardTitle>
                        <CardDescription>Enter the 4-digit code sent to your email</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Back Button */}
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign Up
                            </button>

                            {/* OTP Input */}
                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className={`w-14 h-14 text-center text-2xl font-bold border-2 ${error ? "border-red-500" : digit ? "border-blue-500" : "border-gray-300"
                                            } focus:border-blue-500 focus:ring-blue-500`}
                                        autoComplete="off"
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                            {/* Verify Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={!isComplete || isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium disabled:opacity-50"
                            >
                                {isLoading ? "Verifying..." : "Verify Code"}
                            </Button>

                            {/* Resend Code */}
                            <div className="text-center text-sm text-gray-600">
                                {"Didn't receive the code? "}
                                {canResend ? (
                                    <button onClick={handleResend} className="text-blue-600 hover:text-blue-700 font-medium">
                                        Resend Code
                                    </button>
                                ) : (
                                    <span className="text-gray-500">Resend in {resendTimer}s</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
