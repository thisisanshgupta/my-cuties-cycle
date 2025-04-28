import { addDays } from "date-fns"

export interface CycleData {
  periodStartDates: Date[]
  periodEndDates: Date[]
  averageCycleLength: number
  averagePeriodLength: number
  nextPeriodStart: Date | null
  ovulationDay: Date | null
  fertileWindowStart: Date | null
  fertileWindowEnd: Date | null
}

export function calculateCycleDates(startDate: Date, endDate: Date, existingData: CycleData | null): CycleData {
  // Initialize with existing data or create new data structure
  const periodStartDates = existingData?.periodStartDates ? [...existingData.periodStartDates] : []
  const periodEndDates = existingData?.periodEndDates ? [...existingData.periodEndDates] : []

  // Add new period dates
  periodStartDates.push(new Date(startDate))
  periodEndDates.push(new Date(endDate))

  // Calculate average period length
  let totalPeriodDays = 0
  for (let i = 0; i < periodStartDates.length; i++) {
    const start = periodStartDates[i]
    const end = periodEndDates[i]
    const periodLength = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
    totalPeriodDays += periodLength
  }
  const averagePeriodLength = Math.round(totalPeriodDays / periodStartDates.length)

  // Calculate average cycle length (if we have at least 2 periods)
  let averageCycleLength = 28 // Default to 28 days if not enough data
  if (periodStartDates.length >= 2) {
    let totalCycleDays = 0
    for (let i = 1; i < periodStartDates.length; i++) {
      const prevStart = periodStartDates[i - 1]
      const currentStart = periodStartDates[i]
      const cycleLength = Math.round((currentStart.getTime() - prevStart.getTime()) / (1000 * 60 * 60 * 24))
      totalCycleDays += cycleLength
    }
    averageCycleLength = Math.round(totalCycleDays / (periodStartDates.length - 1))
  } else if (existingData?.averageCycleLength) {
    // Keep existing average if available
    averageCycleLength = existingData.averageCycleLength
  }

  // Calculate next period start date
  const lastPeriodStart = periodStartDates[periodStartDates.length - 1]
  const nextPeriodStart = addDays(lastPeriodStart, averageCycleLength)

  // Calculate ovulation day (typically 14 days before next period)
  const ovulationDay = addDays(nextPeriodStart, -14)

  // Calculate fertile window (typically 5 days before ovulation to 1 day after)
  const fertileWindowStart = addDays(ovulationDay, -5)
  const fertileWindowEnd = addDays(ovulationDay, 1)

  return {
    periodStartDates,
    periodEndDates,
    averageCycleLength,
    averagePeriodLength,
    nextPeriodStart,
    ovulationDay,
    fertileWindowStart,
    fertileWindowEnd,
  }
}
