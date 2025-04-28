"use client"

import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, CalendarIcon, Settings, Cloud, Leaf } from "lucide-react"
import { format, addDays, differenceInDays } from "date-fns"
import CycleStatus from "@/components/cycle-status"
import PeriodForm from "@/components/period-form"
import SettingsModal from "@/components/settings-modal"
import { useToast } from "@/hooks/use-toast"
import { calculateCycleDates, type CycleData } from "@/lib/cycle-calculations"
import { requestNotificationPermission, scheduleNotification } from "@/lib/notifications"

export default function Dashboard() {
  const [cycleData, setCycleData] = useState<CycleData | null>(null)
  const [showPeriodForm, setShowPeriodForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [petName, setPetName] = useState("Totoro")
  const { toast } = useToast()

  useEffect(() => {
    // Load data from localStorage
    const savedCycleData = localStorage.getItem("cycleData")
    const savedPetName = localStorage.getItem("petName")

    if (savedCycleData) {
      const parsedData = JSON.parse(savedCycleData)
      // Convert string dates back to Date objects
      if (parsedData.periodStartDates) {
        parsedData.periodStartDates = parsedData.periodStartDates.map((d: string) => new Date(d))
      }
      if (parsedData.periodEndDates) {
        parsedData.periodEndDates = parsedData.periodEndDates.map((d: string) => new Date(d))
      }
      if (parsedData.nextPeriodStart) {
        parsedData.nextPeriodStart = new Date(parsedData.nextPeriodStart)
      }
      if (parsedData.ovulationDay) {
        parsedData.ovulationDay = new Date(parsedData.ovulationDay)
      }
      if (parsedData.fertileWindowStart) {
        parsedData.fertileWindowStart = new Date(parsedData.fertileWindowStart)
      }
      if (parsedData.fertileWindowEnd) {
        parsedData.fertileWindowEnd = new Date(parsedData.fertileWindowEnd)
      }

      setCycleData(parsedData)
    }

    if (savedPetName) {
      setPetName(savedPetName)
    }

    // Request notification permission
    requestNotificationPermission()
  }, [])

  useEffect(() => {
    if (cycleData) {
      // Save to localStorage whenever cycleData changes
      localStorage.setItem("cycleData", JSON.stringify(cycleData))

      // Schedule notifications
      if (cycleData.nextPeriodStart) {
        scheduleNotification(
          "Period Starting Soon",
          `${petName}'s cycle is beginning tomorrow!`,
          new Date(cycleData.nextPeriodStart.getTime() - 24 * 60 * 60 * 1000),
        )
      }

      if (cycleData.ovulationDay) {
        scheduleNotification("Ovulation Day", `${petName} is ovulating today!`, cycleData.ovulationDay)
      }

      if (cycleData.fertileWindowStart) {
        scheduleNotification(
          "Fertile Window Beginning",
          `${petName}'s fertile window is starting tomorrow!`,
          new Date(cycleData.fertileWindowStart.getTime() - 24 * 60 * 60 * 1000),
        )
      }
    }
  }, [cycleData, petName])

  useEffect(() => {
    // Save petName to localStorage
    localStorage.setItem("petName", petName)
  }, [petName])

  const handleAddPeriod = (startDate: Date, endDate: Date) => {
    const newCycleData = calculateCycleDates(startDate, endDate, cycleData)
    setCycleData(newCycleData)
    setShowPeriodForm(false)

    toast({
      title: "Period added",
      description: "Your cycle information has been updated!",
      className: "bg-green-50 border-green-200 text-green-800",
    })
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    // Check if the selected date is already marked as a period
    if (cycleData?.periodStartDates && cycleData.periodEndDates) {
      for (let i = 0; i < cycleData.periodStartDates.length; i++) {
        const start = cycleData.periodStartDates[i]
        const end = cycleData.periodEndDates[i]

        if (date >= start && date <= end) {
          // This date is already marked as a period
          toast({
            title: "Period already recorded",
            description: `This date is already marked as a cycle day.`,
            className: "bg-amber-50 border-amber-200 text-amber-800",
          })
          return
        }
      }
    }

    // If not already marked, open the form to add a new period
    setShowPeriodForm(true)
  }

  const getDayClassName = (date: Date) => {
    if (!cycleData) return ""

    // Check if date is in a period
    if (cycleData.periodStartDates && cycleData.periodEndDates) {
      for (let i = 0; i < cycleData.periodStartDates.length; i++) {
        const start = cycleData.periodStartDates[i]
        const end = cycleData.periodEndDates[i]

        if (date >= start && date <= end) {
          return "bg-red-100 rounded-full text-red-800"
        }
      }
    }

    // Check if date is ovulation day
    if (
      cycleData.ovulationDay &&
      date.getDate() === cycleData.ovulationDay.getDate() &&
      date.getMonth() === cycleData.ovulationDay.getMonth() &&
      date.getFullYear() === cycleData.ovulationDay.getFullYear()
    ) {
      return "bg-amber-100 rounded-full text-amber-800"
    }

    // Check if date is in fertile window
    if (
      cycleData.fertileWindowStart &&
      cycleData.fertileWindowEnd &&
      date >= cycleData.fertileWindowStart &&
      date <= cycleData.fertileWindowEnd
    ) {
      return "bg-green-50 rounded-full text-green-700"
    }

    return ""
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-teal-50 bg-fixed relative">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-sky-200 opacity-30">
        <Cloud size={120} />
      </div>
      <div className="absolute bottom-10 right-10 text-teal-200 opacity-30">
        <Leaf size={120} />
      </div>
      <div className="absolute top-40 right-20 text-blue-200 opacity-20">
        <Cloud size={80} />
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-rose-400 mr-3" />
            <h1 className="text-3xl font-bold text-teal-800 font-display tracking-wide">
              My {petName}&apos;s Cycle
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(true)}
            className="text-teal-600 hover:text-teal-800 hover:bg-teal-100/50 rounded-full"
          >
            <Settings className="h-6 w-6" />
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <Card className="backdrop-blur-md bg-white/40 border-0 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-100/80 to-amber-100/80 pb-6">
                <CardTitle className="text-center text-teal-800 text-xl">Today&apos;s Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-8">
                <CycleStatus cycleData={cycleData} petName={petName} />
              </CardContent>
            </Card>

            <Card className="backdrop-blur-md bg-white/40 border-0 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-100/80 to-amber-100/80 pb-6">
                <CardTitle className="text-center text-teal-800 text-xl">Important Dates</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-8">
                {cycleData ? (
                  <div className="space-y-5">
                    {cycleData.nextPeriodStart && (
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-rose-400 mr-4 shadow-sm"></div>
                        <div>
                          <p className="text-teal-700 font-medium">Next Cycle</p>
                          <p className="text-teal-600">{format(cycleData.nextPeriodStart, "MMMM d, yyyy")}</p>
                        </div>
                      </div>
                    )}

                    {cycleData.fertileWindowStart && cycleData.fertileWindowEnd && (
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-300 mr-4 shadow-sm"></div>
                        <div>
                          <p className="text-teal-700 font-medium">Fertile Window</p>
                          <p className="text-teal-600">
                            {format(cycleData.fertileWindowStart, "MMMM d")} -{" "}
                            {format(cycleData.fertileWindowEnd, "MMMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    )}

                    {cycleData.ovulationDay && (
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-amber-400 mr-4 shadow-sm"></div>
                        <div>
                          <p className="text-teal-700 font-medium">Ovulation Day</p>
                          <p className="text-teal-600">{format(cycleData.ovulationDay, "MMMM d, yyyy")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-teal-600 mb-4">No cycle data recorded yet</p>
                    <Button 
                      onClick={() => setShowPeriodForm(true)} 
                      className="mt-2 bg-rose-400 hover:bg-rose-500 text-white shadow-md rounded-full px-6"
                    >
                      Add First Cycle
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="backdrop-blur-md bg-white/40 border-0 shadow-lg rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-rose-100/80 to-amber-100/80 pb-6 flex justify-between items-center">
                <CardTitle className="text-center text-teal-800 text-xl">Calendar</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPeriodForm(true)}
                  className="text-teal-600 border-teal-200 hover:bg-teal-100/50 rounded-full"
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Add Cycle
                </Button>
              </CardHeader>
              <CardContent className="pt-6 pb-8">
                <div className="calendar-container">
                  <Calendar
                    mode="single"
                    onSelect={handleDateSelect}
                    className="rounded-lg border-none shadow-inner bg-white/30"
                    modifiersClassNames={{
                      today: "bg-teal-50 text-teal-900 font-bold border border-teal-200",
                    }}
                    modifiers={{
                      period:
                        cycleData?.periodStartDates?.flatMap((start, i) => {
                          const end = cycleData.periodEndDates[i]
                          const days = []
                          const current = new Date(start)
                          while (current <= end) {
                            days.push(new Date(current))
                            current.setDate(current.getDate() + 1)
                          }
                          return days
                        }) || [],
                      ovulation: cycleData?.ovulationDay ? [cycleData.ovulationDay] : [],
                      fertile:
                        cycleData?.fertileWindowStart && cycleData?.fertileWindowEnd
                          ? Array.from(
                              { length: differenceInDays(cycleData.fertileWindowEnd, cycleData.fertileWindowStart) + 1 },
                              (_, i) => addDays(new Date(cycleData.fertileWindowStart), i),
                            )
                          : [],
                    }}
                    styles={{
                      day: (date) => {
                        return { className: getDayClassName(date) }
                      },
                    }}
                  />
                </div>

                <div className="mt-6 flex justify-center space-x-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-red-100 border border-red-200 mr-2"></div>
                    <span className="text-xs text-teal-700">Cycle Days</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-200 mr-2"></div>
                    <span className="text-xs text-teal-700">Ovulation</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-green-50 border border-green-200 mr-2"></div>
                    <span className="text-xs text-teal-700">Fertile</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {showPeriodForm && <PeriodForm onSubmit={handleAddPeriod} onCancel={() => setShowPeriodForm(false)} />}

        {showSettings && (
          <SettingsModal petName={petName} setPetName={setPetName} onClose={() => setShowSettings(false)} />
        )}
      </div>
    </div>
  )
}