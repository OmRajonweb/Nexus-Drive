"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Brain, Bot, Calendar as CalendarIcon, Clock, MapPin, Wrench } from "lucide-react"
import { toast } from "sonner"

type Preferences = {
  preferredCenter: string | null
  preferredTime: "Morning" | "Afternoon" | "Evening" | null
  avoidWeekends: boolean
  frequentServiceTypes: string[]
  rescheduleFlexibility: "Low" | "Medium" | "High"
}

type Booking = {
  bookingId: string
  center: string
  date: string // ISO
  time: string
  serviceType: string
  status: "Upcoming" | "Completed" | "Cancelled"
}

const LS_PREF = "nexus.preferences"
const LS_CURR = "nexus.currentBooking"

const bucketTime = (time: string): Preferences["preferredTime"] => {
  const hour = (() => {
    const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!m) return 12
    let h = parseInt(m[1]) % 12
    if (m[3].toUpperCase() === "PM") h += 12
    return h
  })()
  if (hour < 12) return "Morning"
  if (hour < 17) return "Afternoon"
  return "Evening"
}

const defaultPreferences: Preferences = {
  preferredCenter: "East Hub",
  preferredTime: "Morning",
  avoidWeekends: true,
  frequentServiceTypes: ["Full Inspection"],
  rescheduleFlexibility: "Low",
}

export function EngagementPage() {
  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState<{ id: number; from: "Customer" | "AI Agent"; text: string; time?: string }[]>([
    { id: 1, from: "Customer", text: "When can I schedule my next service?", time: "2 hours ago" },
    { id: 2, from: "AI Agent", text: "Based on your driving patterns, I recommend a brake inspection next week.", time: "1 hour ago" },
  ])
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const raw = localStorage.getItem(LS_PREF)
      return raw ? JSON.parse(raw) : defaultPreferences
    } catch {
      return defaultPreferences
    }
  })
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(() => {
    try {
      const raw = localStorage.getItem(LS_CURR)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Persist preferences and booking
  useEffect(() => {
    localStorage.setItem(LS_PREF, JSON.stringify(preferences))
  }, [preferences])
  useEffect(() => {
    if (currentBooking) localStorage.setItem(LS_CURR, JSON.stringify(currentBooking))
    else localStorage.removeItem(LS_CURR)
  }, [currentBooking])

  const updatePrefsFromBooking = (b: Booking) => {
    setPreferences((p) => {
      const timeBucket = bucketTime(b.time) || p.preferredTime
      const freq = new Set([...(p.frequentServiceTypes || []), b.serviceType])
      return { ...p, preferredCenter: b.center || p.preferredCenter, preferredTime: timeBucket, frequentServiceTypes: Array.from(freq) }
    })
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    setMessages((m) => [...m, { id: Date.now(), from: "Customer", text: messageInput }])
    setMessageInput("")
  }

  // Suggest next best slot based on preferences
  const computeSuggestion = useMemo(() => {
    const base = new Date()
    let d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + 3)
    // Shift off weekends if needed
    if (preferences.avoidWeekends) {
      while ([0, 6].includes(d.getDay())) d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)
    }
    const center = preferences.preferredCenter || "East Hub"
    const time = preferences.preferredTime === "Morning" ? "9:00 AM" : preferences.preferredTime === "Afternoon" ? "2:00 PM" : "5:30 PM"
    const serviceType = (preferences.frequentServiceTypes && preferences.frequentServiceTypes[0]) || "Full Inspection"
    return { date: d, time, center, serviceType }
  }, [preferences])

  const pushAISuggestion = () => {
    const { date, time, center } = computeSuggestion
    setMessages((m) => [
      ...m,
      {
        id: Date.now(),
        from: "AI Agent",
        text: `I see you usually prefer ${preferences.preferredTime?.toLowerCase()} slots at ${center}. There's an opening on ${date.toLocaleDateString()} at ${time}. Would you like me to move your service there?`,
      },
    ])
  }

  const acceptSuggestion = () => {
    const s = computeSuggestion
    const newBooking: Booking = {
      bookingId: `NXD-${s.date.getFullYear()}${String(s.date.getMonth() + 1).padStart(2, "0")}${String(s.date.getDate()).padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
      center: s.center,
      date: s.date.toISOString(),
      time: s.time,
      serviceType: s.serviceType,
      status: "Upcoming",
    }
    setCurrentBooking(newBooking)
    updatePrefsFromBooking(newBooking)
    toast.success(`Updated to ${s.center}, ${s.date.toLocaleDateString()} at ${s.time}`)
    setMessages((m) => [
      ...m,
      { id: Date.now() + 1, from: "AI Agent", text: `Got it! I've updated your booking for ${s.date.toLocaleDateString()}, ${s.time} at ${s.center} — your preferred slot.` },
    ])
  }

  const declineSuggestion = () => {
    setMessages((m) => [
      ...m,
      { id: Date.now(), from: "AI Agent", text: "No problem! I’ll keep your booking as is and adjust my future recommendations." },
    ])
  }

  // Derived calendar markers
  const today = new Date()
  const currentMonthDays = 35
  const userBookingDay = useMemo(() => {
    if (!currentBooking) return null
    const d = new Date(currentBooking.date)
    return d.getDate()
  }, [currentBooking])
  const aiSuggestedDays = useMemo(() => {
    const d1 = computeSuggestion.date.getDate()
    const d2 = Math.min(d1 + 3, 31)
    return [d1, d2]
  }, [computeSuggestion])

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2">Phase 3: Engagement & Scheduling</h2>
        <p className="text-muted-foreground">Voice-first AI interaction and service scheduling</p>
      </motion.div>

      {/* AI Insights */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <Card className="p-4 glass-card neon-border flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary"><Brain className="w-4 h-4" /></div>
          <div className="text-sm">
            <p className="font-semibold">AI Insights</p>
            <p className="text-muted-foreground">
              You prefer {preferences.preferredCenter || "East Hub"} and {preferences.preferredTime?.toLowerCase() || "morning"} slots. I’ll prioritize those when suggesting appointments.
            </p>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Voice Agent */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">AI Voice Agent Chat</h3>
          <div className="space-y-4 mb-4 h-80 overflow-y-auto">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${msg.from === "AI Agent" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.from === "AI Agent"
                      ? "bg-primary/20 border border-primary/50 text-foreground"
                      : "bg-accent/20 border border-accent/50 text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  {msg.time && <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder-muted-foreground"
            />
            <Button className="bg-primary hover:bg-primary/90" onClick={handleSendMessage}>
              Send
            </Button>
          </div>

          {/* Suggestion CTA */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" className="bg-primary" onClick={pushAISuggestion}><Bot className="w-4 h-4 mr-1" /> Suggest based on my preferences</Button>
            <Button size="sm" variant="outline" className="bg-transparent" onClick={() => {
              setPreferences((p) => ({ ...p, avoidWeekends: !p.avoidWeekends }))
              toast.info(`Weekend preference: ${!preferences.avoidWeekends ? "Avoid weekends" : "Allow weekends"}`)
            }}>Toggle weekend preference</Button>
          </div>

          {/* Latest actionable suggestion */}
          <div className="mt-3">
            <Card className="p-3 glass-card">
              <div className="flex items-start gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><Bot className="w-4 h-4" /></div>
                <div className="flex-1 text-sm">
                  <p>
                    {`I can move your booking to ${computeSuggestion.center}, ${computeSuggestion.date.toLocaleDateString()} at ${computeSuggestion.time} (${preferences.preferredTime}). Confirm?`}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" className="bg-primary" onClick={acceptSuggestion}>Yes, move it</Button>
                    <Button size="sm" variant="outline" className="bg-transparent" onClick={declineSuggestion}>No, keep it</Button>
                    <Button size="sm" variant="ghost" onClick={() => setMessages((m) => [...m, { id: Date.now(), from: "AI Agent", text: "Sure, I’ll remind you later." }])}>Remind me later</Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        {/* Appointments */}
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Upcoming Appointment</h3>
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 rounded-lg bg-card/50 border border-border/50"
            >
              {currentBooking ? (
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold flex items-center gap-2"><Wrench className="w-4 h-4 text-primary" /> {currentBooking.serviceType}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> {currentBooking.center}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> {new Date(currentBooking.date).toLocaleDateString()} at {currentBooking.time}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${currentBooking.status === "Upcoming" ? "bg-green-500/20 text-green-400" : currentBooking.status === "Completed" ? "bg-blue-500/20 text-blue-400" : "bg-rose-500/20 text-rose-400"}`}>{currentBooking.status}</span>
                  </div>
                  <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v) }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">Manage</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Manage Appointment</DialogTitle>
                        <DialogDescription>Update or reschedule your service appointment</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3 text-sm">
                        <p className="font-semibold">{currentBooking.serviceType}</p>
                        <p className="text-muted-foreground">Current: {new Date(currentBooking.date).toLocaleDateString()} at {currentBooking.time} • {currentBooking.center}</p>
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                        <div className="space-y-2">
                          <Button className="w-full bg-primary" onClick={() => { acceptSuggestion(); setDialogOpen(false) }}>Accept AI Suggestion</Button>
                          <Button variant="outline" className="w-full bg-transparent" onClick={() => { setDialogOpen(false); toast.info("Open full reschedule flow from Overview to modify.") }}>Modify Manually</Button>
                          <Button variant="destructive" className="w-full" onClick={() => { setCurrentBooking(null); setDialogOpen(false); toast.error("Appointment cancelled!") }}>Cancel Appointment</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No active booking. Ask the AI to suggest one or book from the Overview dashboard.</div>
              )}
            </motion.div>
          </div>
        </Card>
      </div>

      {/* Scheduling Calendar */}
      <TooltipProvider>
        <Card className="p-6 neon-border">
          <h3 className="text-lg font-semibold mb-4">Service Scheduling Calendar</h3>
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: currentMonthDays }).map((_, i) => {
              const day = i + 1
              const isUser = userBookingDay === day
              const isAI = aiSuggestedDays.includes(day)
              const className = isUser
                ? "bg-blue-500/30 border border-blue-500/50 text-blue-200 font-semibold"
                : isAI
                ? "bg-green-500/30 border border-green-500/50 text-green-200 font-semibold"
                : selectedDate === day
                ? "bg-accent/30 border border-accent/50"
                : "bg-card/50 border border-border/50 hover:border-primary/50"
              const label = isUser ? "User Booking" : isAI ? "AI Suggestion" : ""
              return (
                <Tooltip key={day}>
                  <TooltipTrigger asChild>
                    <motion.button whileHover={{ scale: 1.05 }} onClick={() => setSelectedDate(day)} className={`p-2 rounded-lg text-sm transition-all ${className}`}>
                      {day}
                    </motion.button>
                  </TooltipTrigger>
                  {label && (
                    <TooltipContent>
                      <div className="text-xs">
                        <p className="font-semibold">{label}</p>
                        {isAI && (
                          <p className="text-muted-foreground">Matches your usual {preferences.preferredTime?.toLowerCase()} at {preferences.preferredCenter}.</p>
                        )}
                        {isUser && currentBooking && (
                          <p className="text-muted-foreground">{new Date(currentBooking.date).toDateString()} @ {currentBooking.time} • {currentBooking.center}</p>
                        )}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })}
          </div>
          <div className="mt-3 text-xs text-muted-foreground flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-blue-500/30 border border-blue-500/50">🔵 User Bookings</span>
            <span className="px-2 py-0.5 rounded bg-green-500/30 border border-green-500/50">🟢 AI Suggestions</span>
          </div>
        </Card>
      </TooltipProvider>
    </div>
  )
}
