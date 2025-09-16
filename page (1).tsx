"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { LanguageSelector } from "@/components/language-selector"
import { ArrowLeft, ArrowRight, MapPin, Camera, User, CheckCircle, Upload, Shield } from "lucide-react"
import Link from "next/link"

interface FormData {
  name: string
  phone: string
  problemType: string
  description: string
  location: string
  coordinates: { lat: number; lng: number } | null
  image: File | null
}

const PROBLEM_TYPES = [
  "Pothole",
  "Graffiti",
  "Broken Light",
  "Damaged Sidewalk",
  "Illegal Dumping",
  "Traffic Signal Issue",
  "Water Leak",
  "Noise Complaint",
  "Other",
]

export default function ReportPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    problemType: "",
    description: "",
    location: "",
    coordinates: null,
    image: null,
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted:", formData)
    // Redirect to success page or dashboard
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      updateFormData("image", file)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== "" && formData.phone.trim() !== ""
      case 2:
        return formData.problemType !== "" && formData.description.trim() !== ""
      case 3:
        return formData.location.trim() !== ""
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CivicWatch</h1>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <Badge variant="outline">Report Issue</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Report a Community Issue</h1>
            <Badge variant="secondary">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>User Details</span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Problem Details</span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Location & Photo</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && (
                <>
                  <User className="w-5 h-5 text-primary" />
                  Your Information
                </>
              )}
              {currentStep === 2 && (
                <>
                  <CheckCircle className="w-5 h-5 text-secondary" />
                  Problem Details
                </>
              )}
              {currentStep === 3 && (
                <>
                  <MapPin className="w-5 h-5 text-accent" />
                  Location & Evidence
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: User Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                  />
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 inline mr-2" />
                    Your contact information helps us follow up on your report and provide updates on resolution
                    progress.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Problem Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problemType">Issue Type *</Label>
                  <Select value={formData.problemType} onValueChange={(value) => updateFormData("problemType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the type of issue" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROBLEM_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Problem Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail. Include any relevant information about severity, safety concerns, or impact on the community."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                  />
                </div>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Be as specific as possible. Details help authorities understand the urgency and allocate appropriate
                    resources.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Location & Photo */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location Address *</Label>
                  <Input
                    id="location"
                    placeholder="Enter the street address or nearest intersection"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                  />
                </div>

                {/* Interactive Map Placeholder */}
                <div className="space-y-2">
                  <Label>Pinpoint Location</Label>
                  <div className="aspect-video bg-muted/30 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <MapPin className="w-8 h-8 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">Interactive map will load here</p>
                      <p className="text-xs text-muted-foreground">Click to pinpoint the exact location</p>
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label htmlFor="image">Upload Photo (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    <div className="text-center space-y-4">
                      <Camera className="w-8 h-8 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm font-medium">Upload a photo of the issue</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <label htmlFor="image" className="cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </label>
                      </Button>
                      <input id="image" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      {formData.image && (
                        <div className="mt-2 p-2 bg-accent/10 rounded text-sm text-accent">✓ {formData.image.name}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Photos provide valuable context and help authorities assess the situation more accurately.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={!isStepValid()} className="flex items-center gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90"
            >
              <CheckCircle className="w-4 h-4" />
              Submit Report
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link href="/help" className="text-primary hover:underline">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
