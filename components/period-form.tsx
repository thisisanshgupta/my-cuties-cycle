"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { X } from "lucide-react"

interface PeriodFormProps {
  onSubmit: (startDate: Date, endDate: Date) => void
  onCancel: () => void
}

export default function PeriodForm({ onSubmit, onCancel }: PeriodFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [step, setStep] = useState<"start" | "end">("start")

  const handleSubmit = () => {
    if (startDate && endDate) {
      onSubmit(startDate, endDate)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-t-lg relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="absolute right-2 top-2 text-pink-700 hover:text-pink-900 hover:bg-pink-100"
          >
            <X className="h-5 w-5" />
          </Button>
          <CardTitle className="text-center text-pink-800">
            {step === "start" ? "Select Period Start Date" : "Select Period End Date"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {step === "start" ? (
            <div className="text-center">
              <p className="mb-4 text-gray-600">Please select when your period started:</p>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="mx-auto border-pink-100"
              />
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4 text-gray-600">Please select when your period ended:</p>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                disabled={(date) => date < (startDate || new Date())}
                className="mx-auto border-pink-100"
              />
              <p className="mt-2 text-sm text-gray-500">
                Start date: {startDate ? format(startDate, "MMMM d, yyyy") : "Not selected"}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {step === "start" ? (
            <>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button onClick={() => setStep("end")} disabled={!startDate} className="bg-pink-500 hover:bg-pink-600">
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep("start")}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={!endDate} className="bg-pink-500 hover:bg-pink-600">
                Save Period
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
