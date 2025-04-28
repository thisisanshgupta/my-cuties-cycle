"use client"

import { differenceInDays } from "date-fns"
import type { CycleData } from "@/lib/cycle-calculations"

interface CycleStatusProps {
  cycleData: CycleData | null
  petName: string
}

export default function CycleStatus({ cycleData, petName }: CycleStatusProps) {
  if (!cycleData || !cycleData.averageCycleLength) {
    return (
      <div className="text-center py-6">
        <p className="text-lg text-gray-500">No cycle data available yet.</p>
        <p className="text-sm text-gray-400 mt-2">Add a period to see cycle status.</p>
      </div>
    )
  }

  const today = new Date()
  let currentDay = 0
  let statusText = ""
  let statusColor = "text-gray-700"
  let emoji = "🌸"

  // Find the most recent period
  if (cycleData.periodStartDates && cycleData.periodStartDates.length > 0) {
    const lastPeriodStart = cycleData.periodStartDates[cycleData.periodStartDates.length - 1]
    currentDay = differenceInDays(today, lastPeriodStart) + 1

    // Check if currently on period
    const lastPeriodEnd = cycleData.periodEndDates[cycleData.periodEndDates.length - 1]
    if (today >= lastPeriodStart && today <= lastPeriodEnd) {
      statusText = "Currently on period"
      statusColor = "text-pink-700"
      emoji = "🩸"
    }
    // Check if in fertile window
    else if (
      cycleData.fertileWindowStart &&
      cycleData.fertileWindowEnd &&
      today >= cycleData.fertileWindowStart &&
      today <= cycleData.fertileWindowEnd
    ) {
      statusText = "Fertile window"
      statusColor = "text-purple-700"
      emoji = "✨"
    }
    // Check if ovulation day
    else if (
      cycleData.ovulationDay &&
      today.getDate() === cycleData.ovulationDay.getDate() &&
      today.getMonth() === cycleData.ovulationDay.getMonth() &&
      today.getFullYear() === cycleData.ovulationDay.getFullYear()
    ) {
      statusText = "Ovulation day"
      statusColor = "text-purple-800"
      emoji = "🥚"
    }
    // Otherwise, just regular day
    else {
      statusText = "Regular day"
      emoji = "🌿"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className="text-6xl mb-4">{emoji}</div>
      <h2 className="text-3xl font-bold text-pink-600 mb-2">
        Day {currentDay} of {cycleData.averageCycleLength}
      </h2>
      <p className={`text-lg font-medium ${statusColor}`}>{statusText}</p>

      {cycleData.nextPeriodStart && (
        <div className="mt-4 text-center">
          <p className="text-gray-600">
            {differenceInDays(cycleData.nextPeriodStart, today)} days until {petName}&apos;s next period
          </p>
        </div>
      )}
    </div>
  )
}
