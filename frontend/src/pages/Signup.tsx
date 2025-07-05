import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff, Upload, User } from "lucide-react";

interface SignupFormData {
    fullName: string;
    email: string;
    avatar?: string;
    address?: string;
    phoneNumber?: string;
    password: string;
}

export default function SignupForm() {

    // a dummy avatar URL is added
    const [avatarPreview, setAvatarPreview] = useState<string>("https://www.djibstyle.com/wp-content/uploads/2019/01/dummy-snapcode-avatar@2x-2.png");
    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>();

    // Manually register `avatar` because the input is hidden
    useEffect(() => {
        register("avatar");
    }, [register]);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
                setValue("avatar", result, { shouldValidate: true });
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: SignupFormData) => {
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Form submitted:", data);
            alert("Account created successfully!");
        } catch (error) {
            console.error("Error creating account:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CM</span>
                        </div>
                        <span className="text-xl font-semibold text-gray-900">Chat Market</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                    <p className="text-gray-600">Join Chat Market and start buying and selling with ease</p>
                </div>

                <Card className="shadow-lg border-0">
                    <CardHeader className="text-center pb-6">
                        <CardTitle className="text-2xl">Sign Up</CardTitle>
                        <CardDescription>Fill in your details to get started</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                    <Avatar className="w-24 h-24">
                                        <AvatarImage src={avatarPreview || "/placeholder.svg"} alt="Avatar preview" />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            <User className="w-8 h-8" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <label
                                        htmlFor="avatar-upload"
                                        className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </label>
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                {errors.avatar && <p className="text-sm text-red-600">{errors.avatar.message}</p>}
                            </div>

                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    {...register("fullName", {
                                        required: "Full name is required",
                                        minLength: { value: 2, message: "Full name must be at least 2 characters" },
                                    })}
                                    placeholder="Enter your full name"
                                    className={errors.fullName ? "border-red-500" : ""}
                                />
                                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName.message}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                    placeholder="Enter your email address"
                                    className={errors.email ? "border-red-500" : ""}
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <Label htmlFor="phoneNumber">Phone Number *</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    {...register("phoneNumber", {
                                        minLength: { value: 10, message: "Please enter a valid phone number" },
                                    })}
                                    placeholder="Enter your phone number"
                                    className={errors.phoneNumber ? "border-red-500" : ""}
                                />
                                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>}
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    {...register("address", {
                                        minLength: { value: 10, message: "Please enter a complete address" },
                                    })}
                                    placeholder="Enter your complete address"
                                    className={`min-h-[80px] ${errors.address ? "border-red-500" : ""}`}
                                />
                                {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
                            </div>

                            {/* Password */}
                            {/* <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Password must be at least 8 characters" },
                                        })}
                                    placeholder="Create a strong password"
                                    className={errors.password ? "border-red-500" : ""}
                                />
                                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                            </div> */}
                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Password must be at least 8 characters" },
                                        })}
                                        placeholder="Create a strong password"
                                        className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Creating Account..." : "Sign Up"}
                            </Button>

                            {/* Login Link */}
                            <div className="text-center text-sm text-gray-600">
                                Already have an account?{" "}
                                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                                    Log In
                                </a>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
