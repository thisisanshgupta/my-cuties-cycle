export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications")
    return
  }

  if (Notification.permission !== "granted" && Notification.permission !== "denied") {
    Notification.requestPermission()
  }
}

export function scheduleNotification(title: string, message: string, date: Date) {
  // Check if notifications are supported and permitted
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return
  }

  // Calculate time until notification should be shown
  const now = new Date()
  const timeUntilNotification = date.getTime() - now.getTime()

  // Only schedule if the date is in the future
  if (timeUntilNotification > 0) {
    setTimeout(() => {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
      })
    }, timeUntilNotification)
  }
}
