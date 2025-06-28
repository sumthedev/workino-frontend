"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ArrowLeft, ArrowRight, Users, User, Briefcase, Heart, HelpCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { DASHBOARD } from "@/lib/constant/Route"
import api from "@/api/auth"

type UsageType = "PERSONAL" | "PROFESSIONAL" | "OTHER"
type UsageMode = "ALONE" | "TEAM"

interface OnboardingData {
  usageType: UsageType | null
  usageMode: UsageMode | null
}

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>({
    usageType: null,
    usageMode: null,
  })

  const router = useRouter();

  const handleUsageTypeSelect = (value: UsageType) => {
    setData((prev) => ({ ...prev, usageType: value }))
  }

  const handleUsageModeSelect = (value: UsageMode) => {
    setData((prev) => ({ ...prev, usageMode: value }))
  }

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
  try {
    const payload = {
      usageType: data.usageType,
      usageMode: data.usageMode,
    };

    const token = localStorage.getItem("token");

    await api.post("/onboarding", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    router.push(DASHBOARD);
  } catch (error) {
    console.log(error);
  }
};


  const canProceed = () => {
    if (currentStep === 1) return data.usageType !== null
    if (currentStep === 2) return data.usageMode !== null
    return false
  }

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <Card className="w-[600px]">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <span className=" font-bold text-xl">W</span>
          </div>
          <CardTitle className="text-2xl font-bold">
            {currentStep === 1 ? "Welcome to Workino" : "How will you use Workino?"}
          </CardTitle>
          <CardDescription>
            {currentStep === 1
              ? "Let's get you set up with a personalized experience"
              : "Tell us about your preferred working style"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">Why are you using Workino?</h3>
              <RadioGroup value={data.usageType || ""} onValueChange={handleUsageTypeSelect} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 rounded-lg border transition-colors">
                  <RadioGroupItem value="PERSONAL" id="personal" />
                  <Label htmlFor="personal" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <div>
                      <div className="font-medium">Personal</div>
                      <div className="text-sm text-muted-foreground">For personal projects and notes</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border transition-colors">
                  <RadioGroupItem value="PROFESSIONAL" id="professional" />
                  <Label htmlFor="professional" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Professional</div>
                      <div className="text-sm text-muted-foreground">For work and business purposes</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg border  transition-colors">
                  <RadioGroupItem value="OTHER" id="other" />
                  <Label htmlFor="other" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <HelpCircle className="w-5 h-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Other</div>
                      <div className="text-sm text-muted-foreground">Something else entirely</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-center mb-4">Will you be working alone or with a team?</h3>
              <RadioGroup value={data.usageMode || ""} onValueChange={handleUsageModeSelect} className="space-y-3">
                <div className="flex items-center space-x-3 p-4 rounded-lg bordertransition-colors">
                  <RadioGroupItem value="ALONE" id="alone" />
                  <Label htmlFor="alone" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <User className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">Just me</div>
                      <div className="text-sm text-muted-foreground">I will be working on my own</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 rounded-lg bordertransition-colors">
                  <RadioGroupItem value="TEAM" id="team" />
                  <Label htmlFor="team" className="flex items-center space-x-3 cursor-pointer flex-1">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <div className="font-medium">With a team</div>
                      <div className="text-sm text-muted-foreground">I will be collaborating with others</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>

            {currentStep < 2 ? (
              <Button onClick={handleNext} disabled={!canProceed()} className="flex items-center space-x-2">
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={!canProceed()} className="flex items-center space-x-2">
                <span>Complete Setup</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex justify-center space-x-2 pt-2">
            <div className={`w-2 h-2 rounded-full ${currentStep === 1 ? "bg-blue-600" : "bg-gray-300"}`} />
            <div className={`w-2 h-2 rounded-full ${currentStep === 2 ? "bg-blue-600" : "bg-gray-300"}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
