"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface SettingsModalProps {
  petName: string
  setPetName: (name: string) => void
  onClose: () => void
}

export default function SettingsModal({ petName, setPetName, onClose }: SettingsModalProps) {
  const [nameInput, setNameInput] = useState(petName)

  const handleSave = () => {
    if (nameInput.trim()) {
      setPetName(nameInput.trim())
    }
    onClose()
  }

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all cycle data? This cannot be undone.")) {
      localStorage.removeItem("cycleData")
      window.location.reload()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-pink-200">
        <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-t-lg relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-2 top-2 text-pink-700 hover:text-pink-900 hover:bg-pink-100"
          >
            <X className="h-5 w-5" />
          </Button>
          <CardTitle className="text-center text-pink-800">Settings</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="petName" className="text-pink-700">
              Pet Name
            </Label>
            <Input
              id="petName"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter a cute name for your partner"
              className="border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            />
            <p className="text-xs text-gray-500">This name will be used in notifications and throughout the app.</p>
          </div>

          <div className="pt-4 border-t border-pink-100">
            <h3 className="text-sm font-medium text-pink-700 mb-2">Notifications</h3>
            <p className="text-sm text-gray-600">The app will send browser notifications for:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside mt-2">
              <li>Day before period starts</li>
              <li>Ovulation day</li>
              <li>Day before fertile window begins</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-pink-100">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearData}
              className="w-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700"
            >
              Clear All Data
            </Button>
            <p className="text-xs text-gray-500 mt-1">This will remove all saved cycle data and cannot be undone.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} className="bg-pink-500 hover:bg-pink-600">
            Save Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
