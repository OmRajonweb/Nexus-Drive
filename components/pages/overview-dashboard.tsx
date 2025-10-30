"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { KPICard } from "@/components/kpi-card"
import { TelemetryCard } from "@/components/telemetry-card"
import { AgentOrchestration } from "@/components/agent-orchestration"
import { RecommendationsCard } from "@/components/recommendations-card"
import { Car, Building2, Target, Smile, MapPin, Calendar as CalendarIcon, CalendarDays, Clock, Bot, Hash, User, Wrench, Battery, Droplets, Brush, Shield, Disc } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

type ServiceCenter = { id: string; name: string; distanceKm: number; rating: number; availability: "green" | "yellow" | "red" }
type Booking = {
  id: string
  bookingId: string
  center: ServiceCenter
  date: Date
  slot: string
  status: "Upcoming" | "Completed" | "Cancelled"
  createdAt: number
  address: string
  technician: string
  serviceType: string
  notes: string
}

const serviceCenters: ServiceCenter[] = [
  { id: "east", name: "East Hub", distanceKm: 2.3, rating: 4.6, availability: "green" },
  { id: "north", name: "North Hub", distanceKm: 3.2, rating: 4.4, availability: "green" },
  { id: "west", name: "West Hub", distanceKm: 4.1, rating: 4.2, availability: "yellow" },
  { id: "south", name: "South Hub", distanceKm: 5.7, rating: 3.9, availability: "yellow" },
]

const timeSlots = ["9:00 AM", "10:30 AM", "11:30 AM", "2:00 PM", "3:30 PM"]

function availabilityBadge(level: ServiceCenter["availability"]) {
  return level === "green" ? "bg-green-500/20 text-green-400" : level === "yellow" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
}

const centerMeta: Record<string, { address: string; defaultTech: string }> = {
  east: { address: "Auto Avenue, Sector 4, Bengaluru", defaultTech: "Rahul Mehta" },
  north: { address: "Velocity Park, Block B, Pune", defaultTech: "Anita Sharma" },
  west: { address: "Drive Street, Plot 12, Mumbai", defaultTech: "Vikram Singh" },
  south: { address: "Torque Lane, Phase 3, Chennai", defaultTech: "Priya Nair" },
}

function generateBookingId(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  const rnd = Math.floor(1000 + Math.random() * 9000)
  return `NXD-${y}${m}${d}-${rnd}`
}

export function OverviewDashboard() {
  const [bookingOpen, setBookingOpen] = React.useState(false)
  const [step, setStep] = React.useState(1)
  const [recommended, setRecommended] = React.useState<ServiceCenter>(serviceCenters[0])
  const [selectedCenter, setSelectedCenter] = React.useState<ServiceCenter | null>(null)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined)
  const [selectedSlot, setSelectedSlot] = React.useState<string>("")
  const [selectedServiceType, setSelectedServiceType] = React.useState<string | null>(null)
  const [aiSuggestedServiceType, setAiSuggestedServiceType] = React.useState<string | null>(null)
  const [currentBooking, setCurrentBooking] = React.useState<Booking | null>(null)
  const [history, setHistory] = React.useState<Booking[]>(() => {
    const b1Date = new Date("2025-08-15T09:00:00")
    const b2Date = new Date("2025-11-03T10:30:00")
    return [
      {
        id: "h1",
        bookingId: generateBookingId(b1Date),
        center: serviceCenters[1],
        date: b1Date,
        slot: "9:00 AM",
        status: "Completed",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 80,
        address: centerMeta[serviceCenters[1].id].address,
        technician: centerMeta[serviceCenters[1].id].defaultTech,
        serviceType: "Battery Maintenance",
        notes: "Routine battery diagnostics completed.",
      },
      {
        id: "h2",
        bookingId: generateBookingId(b2Date),
        center: serviceCenters[0],
        date: b2Date,
        slot: "10:30 AM",
        status: "Upcoming",
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
        address: centerMeta[serviceCenters[0].id].address,
        technician: centerMeta[serviceCenters[0].id].defaultTech,
        serviceType: "Routine Maintenance",
        notes: "Routine checkup scheduled.",
      },
    ]
  })
  const [aiMessages, setAiMessages] = React.useState<string[]>([])
  const [search, setSearch] = React.useState("")
  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [focusedBooking, setFocusedBooking] = React.useState<Booking | null>(null)
  const LS_CURR = "nexus.currentBooking"
  const LS_HISTORY = "nexus.history"

  // countdown progress toward next service (from booked time to service time)
  const [progress, setProgress] = React.useState(0)
  React.useEffect(() => {
    if (!currentBooking) return
    const start = currentBooking.createdAt
    const end = currentBooking.date.getTime()
    const update = () => {
      const now = Date.now()
      const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
      setProgress(Number.isFinite(pct) ? pct : 0)
    }
    update()
    const t = setInterval(update, 1000 * 60) // update every minute
    return () => clearInterval(t)
  }, [currentBooking])

  // AI assistant after booking
  React.useEffect(() => {
    if (!currentBooking) return
    const t = setTimeout(() => {
      const d = currentBooking.date
      setAiMessages((m) => [
        `Your vehicle is scheduled at ${currentBooking.center.name} on ${d.toLocaleDateString()} at ${currentBooking.slot}. I've marked this in your calendar. Arrive 10 minutes early!`,
        ...m,
      ])
    }, 3000)
    return () => clearTimeout(t)
  }, [currentBooking])

  // Hydrate booking from localStorage for cross-page sync (Engagement page)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_CURR)
      if (!raw) return
      const stored = JSON.parse(raw) as { bookingId?: string; center: string; date: string; time: string; serviceType?: string; status?: string }
      const center = serviceCenters.find((c) => c.name === stored.center) || recommended
      const dt = new Date(stored.date)
      const booking: Booking = {
        id: crypto.randomUUID(),
        bookingId: stored.bookingId || generateBookingId(dt),
        center,
        date: dt,
        slot: stored.time,
        status: (stored.status as Booking["status"]) || "Upcoming",
        createdAt: Date.now() - 1000 * 60 * 10,
        address: centerMeta[center.id].address,
        technician: centerMeta[center.id].defaultTech,
        serviceType: stored.serviceType || "Routine Maintenance",
        notes: "Synced from Engagement preferences.",
      }
      setCurrentBooking(booking)
      setHistory((h) => {
        const exists = h.some((b) => b.bookingId === booking.bookingId)
        return exists ? h : [booking, ...h]
      })
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Hydrate and persist history across portals (e.g., Service Center updates)
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_HISTORY)
      if (!raw) return
      const arr = JSON.parse(raw) as Array<{ bookingId: string; center: string; date: string; time: string; serviceType: string; status: string; notes?: string }>
      const mapped: Booking[] = arr.map((x) => {
        const center = serviceCenters.find((c) => c.name === x.center) || serviceCenters[0]
        const dt = new Date(x.date)
        return {
          id: crypto.randomUUID(),
          bookingId: x.bookingId,
          center,
          date: dt,
          slot: x.time,
          status: (x.status as Booking["status"]) || "Completed",
          createdAt: Date.now() - 1000 * 60 * 5,
          address: centerMeta[center.id].address,
          technician: centerMeta[center.id].defaultTech,
          serviceType: x.serviceType,
          notes: x.notes || "Service Center update.",
        }
      })
      setHistory((h) => {
        const seen = new Set(h.map((i) => i.bookingId))
        const merged = [...mapped.filter((i) => !seen.has(i.bookingId)), ...h]
        return merged
      })
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    try {
      const serializable = history.map((b) => ({
        bookingId: b.bookingId,
        center: b.center.name,
        date: b.date.toISOString(),
        time: b.slot,
        serviceType: b.serviceType,
        status: b.status,
        notes: b.notes,
      }))
      localStorage.setItem(LS_HISTORY, JSON.stringify(serializable))
    } catch {}
  }, [history])
  return (
    <motion.div 
      className="space-y-8 max-w-[1800px] mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-4xl font-bold text-gradient mb-2 font-[family-name:var(--font-orbitron)]">
            DASHBOARD OVERVIEW
          </h2>
          <p className="text-muted-foreground text-sm">
            Real-time automotive intelligence and predictive insights
          </p>
        </div>
        
        <motion.div
          className="glass-card rounded-xl px-4 py-2"
          animate={{
            boxShadow: [
              "0 0 20px rgba(0, 224, 255, 0.2)",
              "0 0 30px rgba(0, 224, 255, 0.3)",
              "0 0 20px rgba(0, 224, 255, 0.2)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <p className="text-xs text-muted-foreground">Last Updated</p>
          <p className="text-sm font-semibold text-primary">Just now</p>
        </motion.div>
      </motion.div>

      {/* Vehicle Details + Next Service */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 neon-border glass-card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10 neon-glow"><Car className="w-6 h-6 text-primary" /></div>
              <div>
                <h3 className="text-xl font-bold">Tata Nexon EV 2024</h3>
                <p className="text-xs text-muted-foreground">VIN: TNXEV24-9XZ13 • Reg: MH 12 AB 3456</p>
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">🟢 Healthy</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Mileage</p>
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold">21,368 km</motion.p>
              <p className="text-[10px] text-muted-foreground">Last updated 2 mins ago</p>
            </div>
            <div className="glass-card rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Last Service</p>
              <p className="text-lg font-semibold">Aug 15, 2025</p>
            </div>
            <div className="glass-card rounded-xl p-3 md:col-span-1 col-span-2">
              <p className="text-xs text-muted-foreground">Predicted Next Service</p>
              <p className="text-lg font-semibold">Battery Check due in ~300 km</p>
            </div>
          </div>
          <div className="mt-4">
            <Dialog open={bookingOpen} onOpenChange={(v) => { setBookingOpen(v); if (!v) { setStep(1); setSelectedCenter(null); setSelectedDate(undefined); setSelectedSlot(""); setSelectedServiceType(null); setAiSuggestedServiceType(null) } }}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">Schedule Service</Button>
              </DialogTrigger>
              <DialogContent className="glass-card neon-border max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Smart Service Booking</DialogTitle>
                  <DialogDescription>AI-assisted scheduling for the best experience</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Step {step} of 5</span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={`step-${step}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      {step === 1 && (
                        <div className="space-y-3">
                          {aiSuggestedServiceType && (
                            <div className="glass-card rounded-xl p-4 border">
                              <div className="flex items-start gap-3">
                                <div className="p-2 rounded-lg bg-primary/10"><Bot className="w-4 h-4 text-primary" /></div>
                                <div>
                                  <p className="text-sm">AI has recommended a <span className="font-semibold">{aiSuggestedServiceType}</span> for your vehicle based on recent telemetry. You can review or continue booking below.</p>
                                </div>
                              </div>
                            </div>
                          )}
                          <p className="text-sm">Select Service Type</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                              { key: "Full Inspection", icon: Shield },
                              { key: "Brake System Check", icon: Disc },
                              { key: "Battery Service", icon: Battery },
                              { key: "Oil & Filter Change", icon: Droplets },
                              { key: "General Cleaning", icon: Brush },
                            ].map((opt) => {
                              const Icon = opt.icon
                              const selected = selectedServiceType === opt.key
                              return (
                                <motion.button
                                  key={opt.key}
                                  onClick={() => setSelectedServiceType(opt.key)}
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  className={`text-left p-4 rounded-xl border glass-card transition ${selected ? "neon-border-bright" : "neon-border"}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${selected ? "bg-primary/20" : "bg-primary/10"}`}>
                                      <Icon className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                      <p className="font-semibold">{opt.key}</p>
                                      {aiSuggestedServiceType === opt.key && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/30">AI Suggested</span>
                                      )}
                                    </div>
                                  </div>
                                </motion.button>
                              )
                            })}
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button disabled={!selectedServiceType} onClick={() => setStep(2)}>Next</Button>
                          </div>
                        </div>
                      )}
                      {step === 2 && (
                        <div className="space-y-3">
                          <p className="text-sm">Select a service center</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {serviceCenters.map((c) => (
                              <button key={c.id} onClick={() => { setSelectedCenter(c); setStep(3) }} className={`text-left p-4 rounded-xl border glass-card hover:neon-glow transition ${c.id === recommended.id ? "neon-border-bright" : "neon-border"}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold">{c.name}</span>
                                  <div className="flex items-center gap-2">
                                    {c.id === recommended.id && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full border bg-primary/10 text-primary border-primary/30">Recommended</span>
                                    )}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${availabilityBadge(c.availability)}`}>{c.availability === "green" ? "🟢" : c.availability === "yellow" ? "🟡" : "🔴"} Availability</span>
                                  </div>
                                </div>
                                <div className="text-xs text-muted-foreground flex items-center gap-3">
                                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.distanceKm} km</span>
                                  <span>⭐ {c.rating.toFixed(1)}</span>
                                </div>
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2"><Button variant="outline" className="bg-transparent" onClick={() => setStep(1)}>Back</Button></div>
                        </div>
                      )}
                      {step === 3 && (
                        <div className="space-y-3">
                          <p className="text-sm">Select a date for <span className="font-semibold">{selectedCenter?.name}</span></p>
                          <div className="flex flex-col md:flex-row gap-3">
                            <div className="rounded-xl border glass-card p-2">
                              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(d) => d < new Date()} modifiers={{ recommended: [new Date(Date.now() + 1000*60*60*24*2), new Date(Date.now() + 1000*60*60*24*3)] }} modifiersStyles={{ recommended: { outline: "2px solid var(--primary)", outlineOffset: 2 } }} />
                            </div>
                            <div className="flex-1 rounded-xl border glass-card p-3">
                              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><CalendarDays className="w-3 h-3" /> AI-recommended dates highlighted</p>
                              <p className="text-xs">Selected: {selectedDate ? selectedDate.toDateString() : "None"}</p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2"><Button variant="outline" className="bg-transparent" onClick={() => setStep(2)}>Back</Button><Button disabled={!selectedDate} onClick={() => setStep(4)}>Next</Button></div>
                        </div>
                      )}
                      {step === 4 && (
                        <div className="space-y-3">
                          <p className="text-sm">Choose a time slot</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {timeSlots.map((s) => (
                              <button key={s} onClick={() => setSelectedSlot(s)} className={`text-sm px-3 py-2 rounded-lg border glass-card ${selectedSlot === s ? "neon-border-bright" : "neon-border"}`}>{s}</button>
                            ))}
                          </div>
                          <div className="flex justify-end gap-2"><Button variant="outline" className="bg-transparent" onClick={() => setStep(3)}>Back</Button><Button disabled={!selectedSlot} onClick={() => setStep(5)}>Next</Button></div>
                        </div>
                      )}
                      {step === 5 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="glass-card p-3 rounded-xl">
                              <p className="text-xs text-muted-foreground">Service Type</p>
                              <p className="font-semibold">{selectedServiceType}</p>
                            </div>
                            <div className="glass-card p-3 rounded-xl">
                              <p className="text-xs text-muted-foreground">Center</p>
                              <p className="font-semibold">{selectedCenter?.name}</p>
                            </div>
                            <div className="glass-card p-3 rounded-xl">
                              <p className="text-xs text-muted-foreground">Date & Time</p>
                              <p className="font-semibold">{selectedDate?.toDateString()} • {selectedSlot}</p>
                            </div>
                            <div className="glass-card p-3 rounded-xl md:col-span-2">
                              <p className="text-xs text-muted-foreground">Vehicle</p>
                              <p className="font-semibold">Tata Nexon EV 2024 • VIN TNXEV24-9XZ13</p>
                            </div>
                          </div>
                          <Button className="w-full bg-primary" onClick={() => {
                            if (!selectedCenter || !selectedDate || !selectedSlot) return
                            const dt = new Date(`${selectedDate.toDateString()} ${selectedSlot}`)
                            const booking: Booking = {
                              id: crypto.randomUUID(),
                              bookingId: generateBookingId(dt),
                              center: selectedCenter,
                              date: dt,
                              slot: selectedSlot,
                              status: "Upcoming",
                              createdAt: Date.now(),
                              address: centerMeta[selectedCenter.id].address,
                              technician: centerMeta[selectedCenter.id].defaultTech,
                              serviceType: selectedServiceType || (aiSuggestedServiceType ?? "Routine Maintenance"),
                              notes: "AI predicted brake pad inspection based on driving data.",
                            }
                            setCurrentBooking(booking)
                            setHistory((h) => [{ ...booking }, ...h])
                            setBookingOpen(false)
                            setStep(1)
                            toast.success(`Booking Confirmed for ${booking.serviceType} at ${selectedCenter.name}`, { description: `ID: ${booking.bookingId} • ${selectedDate?.toDateString()} ${selectedSlot}` })
                            try {
                              localStorage.setItem(LS_CURR, JSON.stringify({ bookingId: booking.bookingId, center: booking.center.name, date: booking.date.toISOString(), time: booking.slot, serviceType: booking.serviceType, status: booking.status }))
                            } catch {
                              /* noop */
                            }
                          }}>Confirm Booking</Button>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Next Service Panel */}
        <Card className="p-6 neon-border glass-card">
          <h3 className="text-lg font-semibold mb-3">Next Service</h3>
          {currentBooking ? (
            <div className="space-y-3">
              <div className="text-sm flex items-center gap-2"><Wrench className="w-4 h-4 text-primary" /> <span className="font-semibold">{currentBooking.serviceType}</span></div>
              <p className="text-sm"><span className="font-semibold">{currentBooking.center.name}</span> — {currentBooking.date.toLocaleDateString()} @ {currentBooking.slot}</p>
              <p className="text-xs text-muted-foreground">Booking ID: <span className="font-mono">{currentBooking.bookingId}</span></p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> {Math.max(0, Math.ceil((currentBooking.date.getTime() - Date.now()) / (1000*60*60*24)))} days remaining</div>
              <Progress value={progress} />
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="bg-transparent" onClick={() => { setBookingOpen(true); setStep(3); setSelectedCenter(currentBooking.center); setSelectedDate(currentBooking.date); setSelectedSlot(currentBooking.slot) }}>Modify Booking</Button>
                <Button variant="destructive" onClick={() => { setHistory((h) => [{ ...currentBooking, status: "Cancelled" }, ...h]); setCurrentBooking(null); toast.error("Booking cancelled"); try { localStorage.removeItem(LS_CURR) } catch {} }}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">No upcoming service scheduled</p>
              <Button className="bg-primary" onClick={() => setBookingOpen(true)}>Book Now</Button>
            </div>
          )}
        </Card>
      </div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        <KPICard 
          title="Vehicle Uptime" 
          value="98.7%" 
          change="+2.3%" 
          icon={Car}
          trend={98.7}
          delay={0}
        />
        <KPICard 
          title="Service Center Efficiency" 
          value="94.2%" 
          change="+1.8%" 
          icon={Building2}
          trend={94.2}
          delay={0.1}
        />
        <KPICard 
          title="Model Accuracy" 
          value="96.5%" 
          change="+3.1%" 
          icon={Target}
          trend={96.5}
          delay={0.2}
        />
        <KPICard 
          title="Customer Satisfaction" 
          value="4.8" 
          change="+0.3" 
          icon={Smile}
          trend={96}
          delay={0.3}
        />
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {/* Telemetry */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TelemetryCard />
        </motion.div>

        {/* Agent Orchestration */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <AgentOrchestration />
        </motion.div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <RecommendationsCard
          onSchedule={(serviceType) => {
            // Open shared booking with AI-suggested service type preselected; other steps editable
            setBookingOpen(true)
            if (serviceType) {
              setAiSuggestedServiceType(serviceType)
              setSelectedServiceType(serviceType)
            }
            setStep(1)
          }}
          recentBooking={currentBooking ? { centerName: currentBooking.center.name, date: currentBooking.date, slot: currentBooking.slot } : undefined}
        />
      </motion.div>

      {/* Service History */}
      <Card className="p-6 neon-border glass-card">
        <h3 className="text-lg font-semibold mb-4">Service History</h3>
        <div className="mb-3">
          <Input placeholder="Search by Booking ID, Service Type or Center..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent" />
        </div>
        <Tabs defaultValue="Upcoming">
          <TabsList className="mb-3">
            <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="Completed">Completed</TabsTrigger>
            <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
          </TabsList>
          {(["Upcoming", "Completed", "Cancelled"] as Booking["status"][]).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>Service Type</TableHead>
                    <TableHead>Service Center</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history
                    .filter((b) => b.status === tab)
                    .filter((b) => {
                      const q = search.trim().toLowerCase()
                      if (!q) return true
                      return b.bookingId.toLowerCase().includes(q) || b.center.name.toLowerCase().includes(q) || b.serviceType.toLowerCase().includes(q)
                    })
                    .map((b) => (
                      <TableRow key={b.id} className="hover:neon-glow cursor-pointer">
                        <TableCell className="font-mono text-sm text-primary underline" onClick={() => { setFocusedBooking(b); setDetailsOpen(true) }}>{b.bookingId}</TableCell>
                        <TableCell className="font-medium">{b.serviceType}</TableCell>
                        <TableCell className="font-medium">{b.center.name}</TableCell>
                        <TableCell>{b.date.toLocaleDateString()}</TableCell>
                        <TableCell>{b.slot}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full border ${b.status === "Upcoming" ? "bg-primary/10 text-primary" : b.status === "Completed" ? "bg-blue-500/20 text-blue-400" : "bg-rose-500/20 text-rose-400"}`}>
                            {b.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{b.notes}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Booking Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="glass-card neon-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Hash className="w-4 h-4" /> Booking Details</DialogTitle>
            <DialogDescription>Complete information about your service booking</DialogDescription>
          </DialogHeader>
          {focusedBooking && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Booking ID</p><p className="font-mono">{focusedBooking.bookingId}</p></div>
                <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Service Center</p><p className="font-semibold">{focusedBooking.center.name}</p></div>
                <div className="glass-card p-3 rounded-xl col-span-2 flex items-center gap-2"><MapPin className="w-4 h-4" /><div><p className="text-xs text-muted-foreground">Address</p><p>{focusedBooking.address}</p></div></div>
                <div className="glass-card p-3 rounded-xl flex items-center gap-2"><User className="w-4 h-4" /><div><p className="text-xs text-muted-foreground">Technician</p><p>{focusedBooking.technician}</p></div></div>
                <div className="glass-card p-3 rounded-xl flex items-center gap-2"><Wrench className="w-4 h-4" /><div><p className="text-xs text-muted-foreground">Service Type</p><p>{focusedBooking.serviceType}</p></div></div>
                <div className="glass-card p-3 rounded-xl flex items-center gap-2"><CalendarIcon className="w-4 h-4" /><div><p className="text-xs text-muted-foreground">Date & Time</p><p>{focusedBooking.date.toLocaleDateString()} — {focusedBooking.slot}</p></div></div>
                <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Status</p><p className="font-semibold">{focusedBooking.status}</p></div>
              </div>
              <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Notes</p><p>{focusedBooking.notes}</p></div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Assistant Widget */}
      <AnimatePresence>
        {aiMessages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed bottom-6 right-6 z-50 w-[320px]">
            <div className="glass-card neon-border rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary font-semibold flex items-center gap-1"><Bot className="w-3 h-3" /> AI Assistant</span>
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {aiMessages.map((m, i) => (
                  <div key={i} className="text-sm text-foreground/90 glass-card p-2 rounded-lg border">
                    {m}
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="outline" className="bg-transparent" onClick={() => setAiMessages([])}>Dismiss</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
