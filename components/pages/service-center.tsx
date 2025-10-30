"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarUI } from "@/components/ui/calendar"
import { toast } from "sonner"
import { ClipboardList, Wrench, Boxes, Users, BarChart3, Calendar, MapPin, Hash, MessageSquare, Upload, Star, ChevronDown, ChevronUp, TrendingUp, Brain, Activity, PieChart as PieChartIcon, Bell, Send, Eye, CheckCircle, Megaphone, AlertTriangle } from "lucide-react"
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts"

// LocalStorage keys
const LS_CENTER_ORDERS = "nexus.center.workOrders"
const LS_CENTER_PARTS = "nexus.center.parts"
const LS_CENTER_TECHS = "nexus.center.techs"
const LS_HISTORY = "nexus.history"
const LS_FEEDBACK = "nexus.feedback"

// Types
 type WorkOrder = {
  id: string
  orderId: string
  vehicleReg: string
  vehicleType?: string // SUV, Sedan, Hatchback
  vehicleModel?: string // Nexon EV, Swift, etc.
  vehicleMake?: string // Tata, Maruti, etc.
  serviceType: string
  technician: string
  status: "Pending" | "Ongoing" | "Completed" | "Cancelled"
  startDate: string // ISO
  expectedCompletion?: string // ISO
  completedAt?: string // ISO
  remarks?: string
  time?: string
  parts?: string[]
  customerRating?: number // 1-5
  photoUrl?: string
 }

 type Part = {
  id: string
  partId: string
  name: string
  qty: number
  lastRestock: string
  supplier: string
  cpu: number
 }

 type Technician = {
  id: string
  name: string
  currentTasks: number
  completedToday: number
  available: boolean
  experience?: string // "5 yrs"
  specialization?: string // "EV Systems", "Brake Systems"
  totalCompleted?: number // career total
  avgRating?: number // 1-5
  avgCompletionTime?: string // "2.3h"
  certifications?: string[] // ["EV Certified", "Safety Level 2"]
 }

 type Feedback = {
  id: string
  feedbackId: string
  centerId: string
  partId: string
  partName: string
  issueType: "Quality" | "Delay" | "Shortage" | "Suggestion"
  urgency: "Low" | "Medium" | "High"
  description: string
  status: "Pending Review" | "Resolved" | "In Progress"
  date: string
 }

 type Message = {
  id: string
  messageId: string
  sender: "Admin" | "Service Center"
  receiver: string
  content: string
  timestamp: string
  priority: "Low" | "Medium" | "High"
  read: boolean
  relatedId?: string
 }

 type Broadcast = {
  id: string
  broadcastId: string
  title: string
  content: string
  priority: "Low" | "Medium" | "High"
  date: string
  attachment?: string
  acknowledged: boolean
 }

 function readLS<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback }
 }
 function writeLS<T>(key: string, val: T) { try { localStorage.setItem(key, JSON.stringify(val)) } catch {} }

 function genOrderId() { return `SRV-${String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0")}` }

 // Default data
 const defaultOrders: WorkOrder[] = [
    { id: crypto.randomUUID(), orderId: "SRV-2025-1101", vehicleReg: "KA-19-AB-4422", vehicleType: "SUV", vehicleModel: "Tata Nexon EV", vehicleMake: "Tata", serviceType: "Brake Service", technician: "Ravi Kumar", status: "Ongoing", startDate: new Date().toISOString(), expectedCompletion: new Date(Date.now()+86400000).toISOString(), remarks: "Pads at 70% wear, rotors need inspection", time: "10:30–12:00", parts: ["P-1001", "P-1002"], customerRating: 4.5 },
    { id: crypto.randomUUID(), orderId: "SRV-2025-1102", vehicleReg: "MH-12-CC-7611", vehicleType: "Sedan", vehicleModel: "Honda City ZX", vehicleMake: "Honda", serviceType: "Oil Change", technician: "Priya Sharma", status: "Completed", startDate: new Date(Date.now()-86400000).toISOString(), completedAt: new Date().toISOString(), time: "09:00–10:30", customerRating: 4.7 },
    { id: crypto.randomUUID(), orderId: "SRV-2025-1103", vehicleReg: "KA-02-ZD-2234", vehicleType: "Hatchback", vehicleModel: "Maruti Swift VXi", vehicleMake: "Maruti", serviceType: "Tire Rotation", technician: "Akshay Mehta", status: "Pending", startDate: new Date(Date.now()+259200000).toISOString(), time: "2:00–3:30", parts: [] },
    { id: crypto.randomUUID(), orderId: "SRV-2025-1104", vehicleReg: "TN-09-YZ-9854", vehicleType: "SUV", vehicleModel: "MG Hector Sharp", vehicleMake: "MG", serviceType: "Battery Check", technician: "Sanjay Verma", status: "Pending", startDate: new Date(Date.now()+172800000).toISOString(), time: "3:30–5:00", remarks: "Scheduled inspection" },
    { id: crypto.randomUUID(), orderId: "SRV-2025-1105", vehicleReg: "DL-04-KP-5523", vehicleType: "Sedan", vehicleModel: "Hyundai Verna SX", vehicleMake: "Hyundai", serviceType: "Full Service", technician: "Neha Patil", status: "Completed", startDate: new Date(Date.now()-259200000).toISOString(), completedAt: new Date(Date.now()-172800000).toISOString(), time: "12:00–1:30", customerRating: 4.9 },
    { id: crypto.randomUUID(), orderId: "SRV-2025-1106", vehicleReg: "TN-09-AB-5544", vehicleType: "Hatchback", vehicleModel: "Hyundai i20 Sportz", vehicleMake: "Hyundai", serviceType: "Engine Diagnostics", technician: "Priya Sharma", status: "Ongoing", startDate: new Date().toISOString(), expectedCompletion: new Date(Date.now()+86400000).toISOString(), time: "10:30–12:00", remarks: "Check engine light on" },
    { id: crypto.randomUUID(), orderId: "SRV-2025-1107", vehicleReg: "DL-08-EF-9988", vehicleType: "SUV", vehicleModel: "Hyundai Creta SX", vehicleMake: "Hyundai", serviceType: "Suspension Service", technician: "Neha Patil", status: "Ongoing", startDate: new Date().toISOString(), time: "2:00–3:30", parts: ["P-1003"], customerRating: 4.6 },
    { id: crypto.randomUUID(), orderId: "SRV-2025-1108", vehicleReg: "KA-51-MN-3311", vehicleType: "Sedan", vehicleModel: "Toyota Camry Hybrid", vehicleMake: "Toyota", serviceType: "Transmission Check", technician: "Aditya Rao", status: "Ongoing", startDate: new Date().toISOString(), expectedCompletion: new Date(Date.now()+86400000).toISOString(), time: "1:00–3:00", remarks: "Gear shifting issue reported" },
  ]

  const defaultTechs: Technician[] = [
    { id: crypto.randomUUID(), name: "Ravi Kumar", currentTasks: 1, completedToday: 3, available: true, experience: "5 yrs", specialization: "EV Systems & Brake Repair", totalCompleted: 124, avgRating: 4.8, avgCompletionTime: "2.1h", certifications: ["EV Certified", "Safety Level 2"] },
    { id: crypto.randomUUID(), name: "Priya Sharma", currentTasks: 2, completedToday: 2, available: false, experience: "4 yrs", specialization: "Engine Diagnostics & Oil Systems", totalCompleted: 97, avgRating: 4.6, avgCompletionTime: "2.5h", certifications: ["Engine Expert", "OBD Certified"] },
    { id: crypto.randomUUID(), name: "Akshay Mehta", currentTasks: 1, completedToday: 1, available: true, experience: "3 yrs", specialization: "Tire & Wheel Alignment", totalCompleted: 82, avgRating: 4.5, avgCompletionTime: "2.3h", certifications: ["Tire Specialist"] },
    { id: crypto.randomUUID(), name: "Sanjay Verma", currentTasks: 0, completedToday: 4, available: true, experience: "6 yrs", specialization: "Hybrid & Electrical Systems", totalCompleted: 146, avgRating: 4.9, avgCompletionTime: "1.9h", certifications: ["Hybrid Expert", "Master Technician", "Safety Level 3"] },
    { id: crypto.randomUUID(), name: "Neha Patil", currentTasks: 1, completedToday: 1, available: true, experience: "2 yrs", specialization: "Suspension & Steering Systems", totalCompleted: 58, avgRating: 4.4, avgCompletionTime: "2.6h", certifications: ["Suspension Certified"] },
    { id: crypto.randomUUID(), name: "Aditya Rao", currentTasks: 1, completedToday: 2, available: true, experience: "5 yrs", specialization: "Transmission & Gearbox Repair", totalCompleted: 112, avgRating: 4.7, avgCompletionTime: "2.2h", certifications: ["Transmission Expert", "Gearbox Specialist"] },
  ]

 export function ServiceCenterPage() {
  const centerName = "East Hub"
  const centerId = "EAST-HUB"
  const [activeTab, setActiveTab] = React.useState("overview")
  
  // Force reset data on mount if needed
  const [orders, setOrders] = React.useState<WorkOrder[]>(() => {
    const stored = readLS<WorkOrder[]>(LS_CENTER_ORDERS, []);
    // Check if stored data has proper vehicle types, if not reset
    if (stored.length === 0 || stored.some(o => !o.vehicleType || !o.vehicleModel)) {
      return defaultOrders;
    }
    return stored;
  })
  
  const [parts, setParts] = React.useState<Part[]>(() => readLS<Part[]>(LS_CENTER_PARTS, [
    { id: crypto.randomUUID(), partId: "P-1001", name: "Brake Pads", qty: 12, lastRestock: new Date().toISOString(), supplier: "Bharat Auto", cpu: 1800 },
    { id: crypto.randomUUID(), partId: "P-1002", name: "Brake Fluid", qty: 3, lastRestock: new Date().toISOString(), supplier: "Tata Supplies", cpu: 450 },
    { id: crypto.randomUUID(), partId: "P-1003", name: "Battery", qty: 2, lastRestock: new Date().toISOString(), supplier: "PowerCell", cpu: 8500 },
  ]))
  
  const [techs, setTechs] = React.useState<Technician[]>(() => {
    const stored = readLS<Technician[]>(LS_CENTER_TECHS, []);
    // Check if stored data has proper experience/specialization, if not reset
    if (stored.length === 0 || stored.some(t => !t.experience || !t.specialization || t.specialization === "General")) {
      return defaultTechs;
    }
    return stored;
  })
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>(() => readLS<Feedback[]>(LS_FEEDBACK, []))
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())

  // Messages & Notifications State
  const [messages, setMessages] = React.useState<Message[]>([
    { id: "1", messageId: "MSG-2025-050", sender: "Admin", receiver: centerName, content: "Your request PR-2025-1101 for 20 Brake Pads is under review.", timestamp: "2025-11-01T10:30:00Z", priority: "High", read: true },
    { id: "2", messageId: "MSG-2025-051", sender: "Service Center", receiver: "Admin", content: "Urgent: Need immediate approval for brake pads. High customer demand.", timestamp: "2025-11-01T11:45:00Z", priority: "High", read: true },
    { id: "3", messageId: "MSG-2025-052", sender: "Admin", receiver: centerName, content: "🚚 Your request PR-2025-1102 for 10 Oil Filters has been dispatched.", timestamp: "2025-10-30T14:20:00Z", priority: "Medium", read: false },
    { id: "4", messageId: "MSG-2025-053", sender: "Admin", receiver: centerName, content: "Feedback FB-2025-010 has been marked as reviewed. Follow-up scheduled.", timestamp: "2025-10-30T16:00:00Z", priority: "Medium", read: false },
  ])
  
  const [broadcasts, setBroadcasts] = React.useState<Broadcast[]>([
    { id: "1", broadcastId: "BRC-2025-011", title: "Brake Pad Recall Notice", content: "Urgent recall of 2025 EV brake pad batches (Batch #EV-BP-2025-A through #EV-BP-2025-D) due to quality issue. Inform all customers immediately and return affected units.", priority: "High", date: "2025-11-02", attachment: "recall-notice.pdf", acknowledged: false },
    { id: "2", broadcastId: "BRC-2025-010", title: "Maintenance Window Notification", content: "Scheduled maintenance window on November 5, 12:00–3:00 PM. System access will be limited during this period.", priority: "Medium", date: "2025-11-01", acknowledged: true },
    { id: "3", broadcastId: "BRC-2025-009", title: "New Performance Tracking Update", content: "New performance tracking features have been added to the analytics dashboard. Check Analytics tab for more details.", priority: "Low", date: "2025-10-28", acknowledged: true },
  ])

  const [messageContent, setMessageContent] = React.useState("")
  const [messagePriority, setMessagePriority] = React.useState<"Low" | "Medium" | "High">("Medium")
  const [selectedBroadcast, setSelectedBroadcast] = React.useState<Broadcast | null>(null)
  const [broadcastViewOpen, setBroadcastViewOpen] = React.useState(false)
  const [messagesTab, setMessagesTab] = React.useState<"direct" | "broadcasts">("direct")

  const unreadCount = messages.filter(m => !m.read && m.sender === "Admin").length + broadcasts.filter(b => !b.acknowledged).length

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast.error("Message cannot be empty")
      return
    }
    const newMessage: Message = {
      id: `${messages.length + 1}`,
      messageId: `MSG-2025-${String(messages.length + 50).padStart(3, '0')}`,
      sender: "Service Center",
      receiver: "Admin",
      content: messageContent,
      timestamp: new Date().toISOString(),
      priority: messagePriority,
      read: false,
    }
    setMessages(prev => [...prev, newMessage])
    toast.success("Message sent to Admin successfully")
    setMessageContent("")
  }

  const handleAcknowledgeBroadcast = (broadcastId: string) => {
    setBroadcasts(prev => prev.map(b => b.id === broadcastId ? { ...b, acknowledged: true } : b))
    toast.success("Broadcast acknowledged successfully")
    setBroadcastViewOpen(false)
  }

  React.useEffect(() => writeLS(LS_CENTER_ORDERS, orders), [orders])
  React.useEffect(() => writeLS(LS_CENTER_PARTS, parts), [parts])
  React.useEffect(() => writeLS(LS_CENTER_TECHS, techs), [techs])
  React.useEffect(() => writeLS(LS_FEEDBACK, feedbacks), [feedbacks])

  // Update modal state
  const [updateOpen, setUpdateOpen] = React.useState(false)
  const [focused, setFocused] = React.useState<WorkOrder | null>(null)
  const [editStatus, setEditStatus] = React.useState<WorkOrder["status"]>("Pending")
  const [editTech, setEditTech] = React.useState<string>("")
  const [editDue, setEditDue] = React.useState<string>("")
  const [editRemarks, setEditRemarks] = React.useState<string>("")

  // Technician details modal state
  const [techDetailsOpen, setTechDetailsOpen] = React.useState(false)
  const [focusedTech, setFocusedTech] = React.useState<Technician | null>(null)

  function openUpdate(order: WorkOrder) {
    setFocused(order)
    setEditStatus(order.status)
    setEditTech(order.technician)
    setEditDue(order.expectedCompletion || "")
    setEditRemarks(order.remarks || "")
    setUpdateOpen(true)
  }

  function saveUpdate() {
    if (!focused) return
    const updated: WorkOrder = {
      ...focused,
      status: editStatus,
      technician: editTech,
      expectedCompletion: editDue || undefined,
      remarks: editRemarks || undefined,
      completedAt: editStatus === "Completed" ? new Date().toISOString() : focused.completedAt,
    }
    setOrders((o) => o.map((w) => (w.id === updated.id ? updated : w)))

    // If completed, append to global user history store
    if (updated.status === "Completed") {
      try {
        const raw = localStorage.getItem(LS_HISTORY)
        const history = raw ? JSON.parse(raw) as any[] : []
        history.unshift({
          bookingId: updated.orderId,
          center: centerName,
          date: updated.completedAt || new Date().toISOString(),
          time: new Date(updated.completedAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          serviceType: updated.serviceType,
          status: "Completed",
          notes: updated.remarks || "Completed via Service Center",
        })
        localStorage.setItem(LS_HISTORY, JSON.stringify(history))
      } catch {}
      toast.success(`Work Order #${updated.orderId} marked as Completed by ${centerName}.`)
    } else {
      toast.info(`Work Order #${updated.orderId} updated.`)
    }
    setUpdateOpen(false)
  }

  // Inventory helpers
  const [invDialog, setInvDialog] = React.useState(false)
  const [newPart, setNewPart] = React.useState<Partial<Part>>({})
  function addPart() {
    if (!newPart.name || !newPart.partId) return
    const p: Part = {
      id: crypto.randomUUID(),
      partId: String(newPart.partId),
      name: String(newPart.name),
      qty: Number(newPart.qty || 0),
      lastRestock: new Date().toISOString(),
      supplier: String(newPart.supplier || "Unknown"),
      cpu: Number(newPart.cpu || 0),
    }
    setParts((arr) => [p, ...arr])
    setInvDialog(false)
    toast.success("Part added to inventory")
  }

  function adjustStock(id: string, delta: number) {
    setParts((arr) => arr.map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p)))
  }

  const lowStock = parts.filter((p) => p.qty <= 3)

  const activeOrders = orders.filter((o) => o.status !== "Completed").length

  // Feedback system
  const [feedbackDialog, setFeedbackDialog] = React.useState(false)
  const [fbPart, setFbPart] = React.useState<string>("")
  const [fbIssue, setFbIssue] = React.useState<Feedback["issueType"]>("Shortage")
  const [fbUrgency, setFbUrgency] = React.useState<Feedback["urgency"]>("Medium")
  const [fbDesc, setFbDesc] = React.useState<string>("")

  function submitFeedback() {
    if (!fbPart || !fbDesc) { toast.error("Please select a part and describe the issue."); return }
    const partObj = parts.find((p) => p.id === fbPart)
    if (!partObj) return
    const fb: Feedback = {
      id: crypto.randomUUID(),
      feedbackId: `FBK-${new Date().getFullYear()}-${String(feedbacks.length + 1).padStart(3, "0")}`,
      centerId,
      partId: partObj.partId,
      partName: partObj.name,
      issueType: fbIssue,
      urgency: fbUrgency,
      description: fbDesc,
      status: "Pending Review",
      date: new Date().toISOString(),
    }
    setFeedbacks((arr) => [fb, ...arr])
    toast.success(`Feedback ${fb.feedbackId} submitted — Manufacturing team notified.`)
    setFeedbackDialog(false)
    setFbPart("")
    setFbDesc("")
  }

  // Calendar helpers
  const todaysBookings = orders.filter((o) => {
    const d = new Date(o.startDate)
    return selectedDate && d.toDateString() === selectedDate.toDateString()
  })

  const [detailsOpen, setDetailsOpen] = React.useState(false)
  const [focusedBooking, setFocusedBooking] = React.useState<WorkOrder | null>(null)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient font-[family-name:var(--font-orbitron)]">Service Center Dashboard</h2>
          <p className="text-muted-foreground text-sm flex items-center gap-2"><MapPin className="w-4 h-4" /> {centerName}</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-primary/10 hover:bg-primary/20 border-primary/50"
                  onClick={() => setActiveTab("messages")}
                >
                  <Bell className={`w-5 h-5 ${unreadCount > 0 ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'No new notifications'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">{activeOrders} Active Orders</span>
          </div>
        </div>
      </motion.div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="glass-card neon-border mb-6 grid grid-cols-8 gap-1 h-auto p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Overview</TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Work Orders</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Inventory</TabsTrigger>
          <TabsTrigger value="technicians" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Technicians</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Calendar</TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Feedback</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Analytics</TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary relative">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages
            {unreadCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs bg-rose-500 text-white rounded-full animate-pulse">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4 neon-border glass-card">
              <div className="flex items-center gap-2 mb-2"><ClipboardList className="w-4 h-4 text-primary" /><span className="font-semibold">Active Work Orders</span></div>
              <p className="text-3xl font-bold">{activeOrders}</p>
            </Card>
            <Card className="p-4 neon-border glass-card">
              <div className="flex items-center gap-2 mb-2"><Boxes className="w-4 h-4 text-primary" /><span className="font-semibold">Low Stock Alerts</span></div>
              <p className="text-3xl font-bold">{lowStock.length}</p>
            </Card>
            <Card className="p-4 neon-border glass-card">
              <div className="flex items-center gap-2 mb-2"><Users className="w-4 h-4 text-primary" /><span className="font-semibold">Technicians</span></div>
              <p className="text-3xl font-bold">{techs.length}</p>
            </Card>
          </div>

          {/* Active Orders Summary */}
          <Card className="p-6 neon-border glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Active Orders Summary</h3>
            <div className="space-y-2">
              {orders.filter(o => o.status !== "Completed").slice(0, 5).map((o) => (
                <div key={o.id} className="glass-card p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="font-mono text-primary text-sm">{o.orderId}</p>
                    <p className="text-xs text-muted-foreground">{o.vehicleReg} • {o.serviceType} • {o.technician}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${o.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-blue-500/20 text-blue-400"}`}>{o.status}</span>
                </div>
              ))}
              {activeOrders === 0 && <p className="text-sm text-muted-foreground text-center py-4">No active orders.</p>}
            </div>
          </Card>
        </TabsContent>

        {/* WORK ORDERS TAB */}
        <TabsContent value="orders" className="space-y-6">

          <Card className="p-6 neon-border glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Work Orders</h3>
              <Button size="sm" onClick={() => setOrders((arr) => [{ id: crypto.randomUUID(), orderId: genOrderId(), vehicleReg: "GA08EF1122", serviceType: "Full Inspection", technician: techs[0]?.name || "Unassigned", status: "Pending", startDate: new Date().toISOString() }, ...arr])}>New Order</Button>
            </div>
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Vehicle No.</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Technician</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <React.Fragment key={o.id}>
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <TableRow className="hover:bg-primary/5 cursor-pointer transition-all duration-300">
                        <TableCell className="font-mono text-primary underline font-semibold">{o.orderId}</TableCell>
                        <TableCell className="font-bold tracking-wide">{o.vehicleReg}</TableCell>
                        <TableCell>
                          <span className="text-sm font-medium text-accent">{o.vehicleType || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">{o.vehicleModel || "-"}</span>
                        </TableCell>
                        <TableCell className="text-sm">{o.serviceType}</TableCell>
                        <TableCell className="text-sm">{o.technician}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${o.status === "Pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" : o.status === "Ongoing" ? "bg-blue-500/20 text-blue-400 border-blue-500/50" : o.status === "Completed" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-rose-500/20 text-rose-400 border-rose-500/50"}`}>{o.status}</span>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(o.startDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" className="bg-transparent hover:bg-primary/20 hover:border-primary transition-all" onClick={() => openUpdate(o)}>Update</Button>
                        </TableCell>
                      </TableRow>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="glass-card neon-border">
                      <div className="text-xs space-y-1">
                        <p><strong className="text-primary">Vehicle Type:</strong> {o.vehicleType || "N/A"}</p>
                        <p><strong className="text-primary">Model:</strong> {o.vehicleMake ? `${o.vehicleMake} ` : ""}{o.vehicleModel || "N/A"}</p>
                        <p><strong className="text-primary">Service:</strong> {o.serviceType}</p>
                        <p><strong className="text-primary">Assigned to:</strong> {o.technician}</p>
                        {o.time && <p><strong className="text-primary">Time Slot:</strong> {o.time}</p>}
                        {o.remarks && <p><strong className="text-primary">Notes:</strong> {o.remarks}</p>}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        </div>

        <Dialog open={updateOpen} onOpenChange={setUpdateOpen}>
          <DialogContent className="glass-card neon-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><Hash className="w-4 h-4" /> Update Work Order</DialogTitle>
              <DialogDescription>Modify status, assign technician, adjust due date, add notes and upload photos.</DialogDescription>
            </DialogHeader>
            {focused && (
              <div className="space-y-4 text-sm">
                {/* Vehicle Details Section */}
                <div className="glass-card p-4 rounded-xl space-y-3">
                  <h4 className="font-semibold text-primary flex items-center gap-2"><Wrench className="w-4 h-4" /> Service Details</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div><p className="text-xs text-muted-foreground">Order ID</p><p className="font-mono">{focused.orderId}</p></div>
                    <div><p className="text-xs text-muted-foreground">Vehicle No.</p><p className="font-semibold">{focused.vehicleReg}</p></div>
                    <div><p className="text-xs text-muted-foreground">Service Type</p><p>{focused.serviceType}</p></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><p className="text-xs text-muted-foreground">Make</p><p>{focused.vehicleMake || "N/A"}</p></div>
                    <div><p className="text-xs text-muted-foreground">Model</p><p>{focused.vehicleModel || "N/A"}</p></div>
                    <div><p className="text-xs text-muted-foreground">Type</p><p>{focused.vehicleType || "N/A"}</p></div>
                  </div>
                  {focused.time && (
                    <div><p className="text-xs text-muted-foreground">Scheduled Time</p><p>{focused.time}</p></div>
                  )}
                  {focused.parts && focused.parts.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Required Parts</p>
                      <div className="flex flex-wrap gap-1">
                        {focused.parts.map((partId, idx) => {
                          const part = parts.find(p => p.partId === partId);
                          const isLowStock = part && part.qty <= 3;
                          return (
                            <span key={idx} className={`text-xs px-2 py-1 rounded-full border ${isLowStock ? "bg-rose-500/20 text-rose-400 border-rose-500" : "bg-primary/20 text-primary"}`}>
                              {part?.name || partId} {isLowStock && "⚠️"}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {focused.customerRating && (
                    <div><p className="text-xs text-muted-foreground">Customer Rating</p><p className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {focused.customerRating} / 5</p></div>
                  )}
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Select value={editStatus} onValueChange={(v) => setEditStatus(v as WorkOrder["status"]) }>
                      <SelectTrigger className="bg-transparent"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Ongoing">Ongoing</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Assign Technician</p>
                    <Select value={editTech} onValueChange={setEditTech}>
                      <SelectTrigger className="bg-transparent"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {techs.map(t => <SelectItem key={t.id} value={t.name}>{t.name} {t.specialization && `(${t.specialization})`}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Expected Completion Date</p>
                  <Input type="date" value={editDue ? editDue.substring(0,10) : ""} onChange={(e) => setEditDue(e.target.value ? new Date(e.target.value).toISOString() : "")} className="bg-transparent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes & Remarks</p>
                  <Textarea value={editRemarks} onChange={(e) => setEditRemarks(e.target.value)} placeholder="Add service notes, observations, or special instructions..." className="bg-transparent" rows={3} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Upload Photo (Optional)</p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => toast.info("Photo upload feature coming soon")}>
                      <Upload className="w-4 h-4 mr-2" /> Choose File
                    </Button>
                    <span className="text-xs text-muted-foreground">JPG, PNG, max 5MB</span>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                  <Button variant="outline" className="bg-transparent" onClick={() => setUpdateOpen(false)}>Cancel</Button>
                  <Button onClick={saveUpdate} className="neon-glow">Save Changes</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
          </Card>
        </TabsContent>

        {/* INVENTORY TAB */}
        <TabsContent value="inventory" className="space-y-6">
          {/* AI Inventory Insights */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="p-6 neon-border glass-card bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary animate-pulse" />
                  AI-Powered Inventory Insights
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on upcoming bookings, historical consumption patterns, and service demand analysis.
                </p>
                
                {/* Prediction Summary */}
                <div className="glass-card p-4 rounded-xl mb-4">
                  <p className="text-sm mb-2">
                    <span className="font-semibold text-primary">🧠 AI Prediction:</span> Based on the next 7 days of bookings, you'll likely need:
                  </p>
                  <ul className="text-sm space-y-1 ml-4">
                    <li><TrendingUp className="w-3 h-3 inline mr-1 text-yellow-400" /> <strong>5 Brake Pads</strong> (Brake services scheduled)</li>
                    <li><TrendingUp className="w-3 h-3 inline mr-1 text-yellow-400" /> <strong>3 Oil Filters</strong> (Oil change demand)</li>
                    <li><TrendingUp className="w-3 h-3 inline mr-1 text-rose-400" /> <strong>2 Batteries</strong> (Low current stock + seasonal demand)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2">📊 Restock soon to maintain 95%+ availability.</p>
                </div>

                {/* Predictive Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2">Part</th>
                        <th className="text-center py-2">Current Stock</th>
                        <th className="text-center py-2">Predicted Need (7d)</th>
                        <th className="text-left py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-2">Brake Pads</td>
                        <td className="text-center">{parts.find(p => p.name === "Brake Pads")?.qty || 0}</td>
                        <td className="text-center">9</td>
                        <td><span className="text-xs px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500">⚠️ Restock Recommended</span></td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2">Brake Fluid</td>
                        <td className="text-center">{parts.find(p => p.name === "Brake Fluid")?.qty || 0}</td>
                        <td className="text-center">8</td>
                        <td><span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500">⚠️ Low Soon</span></td>
                      </tr>
                      <tr>
                        <td className="py-2">Battery</td>
                        <td className="text-center">{parts.find(p => p.name === "Battery")?.qty || 0}</td>
                        <td className="text-center">5</td>
                        <td><span className="text-xs px-2 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500">🔴 Critical</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Auto Reorder Button */}
                <div className="mt-4 flex justify-end">
                  <Button size="sm" className="neon-glow" onClick={() => toast.success("🟢 Restock request sent to Manufacturing team!")}>
                    <Upload className="w-4 h-4 mr-2" /> Auto Reorder
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <Card className="p-6 neon-border glass-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Boxes className="w-4 h-4" /> Parts & Inventory</h3>
          <Dialog open={invDialog} onOpenChange={setInvDialog}>
            <DialogTrigger asChild>
              <Button size="sm">Add Part</Button>
            </DialogTrigger>
            <DialogContent className="glass-card neon-border max-w-lg">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>Maintain real-time stock for the center.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground mb-1">Part ID</p><Input className="bg-transparent" value={newPart.partId || ""} onChange={(e) => setNewPart({ ...newPart, partId: e.target.value })} /></div>
                <div><p className="text-xs text-muted-foreground mb-1">Name</p><Input className="bg-transparent" value={newPart.name || ""} onChange={(e) => setNewPart({ ...newPart, name: e.target.value })} /></div>
                <div><p className="text-xs text-muted-foreground mb-1">Quantity</p><Input type="number" className="bg-transparent" value={newPart.qty as any || ""} onChange={(e) => setNewPart({ ...newPart, qty: Number(e.target.value) })} /></div>
                <div><p className="text-xs text-muted-foreground mb-1">Supplier</p><Input className="bg-transparent" value={newPart.supplier || ""} onChange={(e) => setNewPart({ ...newPart, supplier: e.target.value })} /></div>
                <div className="col-span-2"><p className="text-xs text-muted-foreground mb-1">Cost per Unit</p><Input type="number" className="bg-transparent" value={newPart.cpu as any || ""} onChange={(e) => setNewPart({ ...newPart, cpu: Number(e.target.value) })} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" className="bg-transparent" onClick={() => setInvDialog(false)}>Cancel</Button>
                <Button onClick={addPart}>Add Part</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Part ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Last Restock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((p) => (
              <TableRow key={p.id} className={p.qty <= 3 ? "bg-yellow-500/10" : undefined}>
                <TableCell className="font-mono">{p.partId}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.qty}</TableCell>
                <TableCell>{p.supplier}</TableCell>
                <TableCell>{new Date(p.lastRestock).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="mr-2 bg-transparent" onClick={() => adjustStock(p.id, -1)}>Use 1</Button>
                  <Button size="sm" onClick={() => adjustStock(p.id, +5)}>Restock +5</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
            {lowStock.length > 0 && (
              <div className="mt-3 text-xs text-yellow-400">⚠️ Low stock: {lowStock.map((p) => p.name).join(", ")} — Reorder soon.</div>
            )}
          </Card>
        </TabsContent>

        {/* TECHNICIANS TAB */}
        <TabsContent value="technicians" className="space-y-6">
          <Card className="p-6 neon-border glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Technician Profiles</h3>
            
            {/* Technician Table */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3">Technician</th>
                    <th className="text-center py-3">Experience</th>
                    <th className="text-center py-3">Specialization</th>
                    <th className="text-center py-3">Current Jobs</th>
                    <th className="text-center py-3">Completed (Total)</th>
                    <th className="text-center py-3">Avg Rating</th>
                    <th className="text-right py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {techs.map((t) => (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-primary/5">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold">
                            {t.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold">{t.name}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${t.available ? "bg-green-500/20 text-green-400" : "bg-rose-500/20 text-rose-400"}`}>
                              {t.available ? "Available" : "Busy"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="font-semibold text-primary">{t.experience || "N/A"}</span>
                      </td>
                      <td className="text-center">
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className={`text-xs px-2 py-1 rounded-full border cursor-help ${
                                t.specialization?.includes("EV") || t.specialization?.includes("Hybrid") ? "bg-blue-500/20 text-blue-400 border-blue-500/50" :
                                t.specialization?.includes("Engine") || t.specialization?.includes("Oil") ? "bg-amber-500/20 text-amber-400 border-amber-500/50" :
                                t.specialization?.includes("Tire") || t.specialization?.includes("Wheel") ? "bg-green-500/20 text-green-400 border-green-500/50" :
                                t.specialization?.includes("Suspension") || t.specialization?.includes("Steering") ? "bg-purple-500/20 text-purple-400 border-purple-500/50" :
                                t.specialization?.includes("Transmission") || t.specialization?.includes("Gearbox") ? "bg-red-500/20 text-red-400 border-red-500/50" :
                                t.specialization?.includes("Battery") ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                                "bg-primary/20 text-primary border-primary/50"
                              }`}>
                                {t.specialization || "General"}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="glass-card neon-border">
                              <div className="text-xs">
                                <p><strong>Experience:</strong> {t.experience}</p>
                                <p><strong>Specialization:</strong> {t.specialization}</p>
                                <p><strong>Avg Rating:</strong> {t.avgRating} ⭐</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </td>
                      <td className="text-center">{t.currentTasks}</td>
                      <td className="text-center font-bold text-primary">{t.totalCompleted || 0}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold text-yellow-400">{t.avgRating?.toFixed(1) || "N/A"}</span>
                        </div>
                      </td>
                      <td className="text-right space-x-2">
                        <Button size="sm" variant="outline" className="bg-transparent" onClick={() => setTechs((arr) => arr.map((x) => x.id === t.id ? { ...x, available: !x.available } : x))}>
                          {t.available ? "Mark Busy" : "Mark Available"}
                        </Button>
                        <Button size="sm" onClick={() => { setFocusedTech(t); setTechDetailsOpen(true) }}>
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Best Performer of the Month */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Card className="p-6 neon-border glass-card bg-gradient-to-br from-yellow-500/10 to-primary/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    Best Performer of the Month
                  </h3>
                  <p className="text-2xl font-bold text-gradient mb-1">
                    {techs.reduce((best, t) => (t.avgRating && (!best.avgRating || t.avgRating > best.avgRating)) ? t : best, techs[0] as Technician).name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(() => {
                      const best = techs.reduce((b, t) => (t.avgRating && (!b.avgRating || t.avgRating > b.avgRating)) ? t : b, techs[0] as Technician);
                      return `98% completion efficiency • Avg rating ${best.avgRating}/5 • ${best.totalCompleted} total jobs completed`;
                    })()}
                  </p>
                </div>
                <div className="text-6xl">⭐</div>
              </div>
            </Card>
          </motion.div>

          {/* AI Insight Card */}
          <Card className="p-6 neon-border glass-card bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-start gap-3">
              <Brain className="w-6 h-6 text-primary animate-pulse mt-1" />
              <div>
                <h4 className="font-semibold text-primary mb-2">AI Insight</h4>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Ravi Kumar's</strong> service completion rate is <strong className="text-green-400">12% faster</strong> than the center average. 
                  Recommend assigning him <strong className="text-primary">EV-related jobs</strong> during high-load periods for optimal efficiency.
                </p>
              </div>
            </div>
          </Card>

          {/* Performance Charts Grid */}
          <Card className="p-6 neon-border glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Technician Performance Insights
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Jobs Per Month Bar Chart */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Average Jobs Completed per Month</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={techs.map(t => ({ 
                    name: t.name.split(' ')[0], 
                    jobs: Math.round((t.totalCompleted || 0) / ((parseInt(t.experience || "1") || 1) * 12)),
                    efficiency: t.avgRating ? Math.round(t.avgRating * 20) : 85
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" stroke="#888" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#888" style={{ fontSize: "12px" }} label={{ value: "Jobs/Month", angle: -90, position: "insideLeft", style: { fontSize: "10px", fill: "#888" } }} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #00E0FF", borderRadius: "8px" }} 
                      formatter={(value: any, name: any, props: any) => [`${value} jobs (Eff. ${props.payload.efficiency}%)`, "Performance"]}
                    />
                    <Bar dataKey="jobs" fill="#00E0FF" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Service Distribution Pie Chart */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Service Specialization Distribution</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "EV Systems", value: 30, color: "#00E0FF" },
                        { name: "Engine", value: 25, color: "#FF8C00" },
                        { name: "Brake Systems", value: 20, color: "#00FF7F" },
                        { name: "Battery", value: 15, color: "#FFD700" },
                        { name: "Tire & Alignment", value: 10, color: "#FF6B9D" },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                      labelLine={false}
                      style={{ fontSize: "10px" }}
                    >
                      {[
                        { name: "EV Systems", value: 30, color: "#00E0FF" },
                        { name: "Engine", value: 25, color: "#FF8C00" },
                        { name: "Brake Systems", value: 20, color: "#00FF7F" },
                        { name: "Battery", value: 15, color: "#FFD700" },
                        { name: "Tire & Alignment", value: 10, color: "#FF6B9D" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #00E0FF", borderRadius: "8px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Efficiency Trend */}
              <div className="md:col-span-2">
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">3-Month Performance Trend</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={[
                    { month: "August", ravi: 26, priya: 22, akshay: 18, sanjay: 28, anita: 20, neha: 14 },
                    { month: "September", ravi: 28, priya: 24, akshay: 20, sanjay: 30, anita: 22, neha: 16 },
                    { month: "October", ravi: 30, priya: 26, akshay: 22, sanjay: 32, anita: 24, neha: 18 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#888" style={{ fontSize: "12px" }} />
                    <YAxis stroke="#888" style={{ fontSize: "12px" }} label={{ value: "Jobs Completed", angle: -90, position: "insideLeft", style: { fontSize: "10px", fill: "#888" } }} />
                    <RechartsTooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #00E0FF", borderRadius: "8px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Line type="monotone" dataKey="ravi" name="Ravi" stroke="#00E0FF" strokeWidth={2} dot={{ fill: "#00E0FF", r: 4 }} />
                    <Line type="monotone" dataKey="priya" name="Priya" stroke="#FF8C00" strokeWidth={2} dot={{ fill: "#FF8C00", r: 4 }} />
                    <Line type="monotone" dataKey="akshay" name="Akshay" stroke="#00FF7F" strokeWidth={2} dot={{ fill: "#00FF7F", r: 4 }} />
                    <Line type="monotone" dataKey="sanjay" name="Sanjay" stroke="#FFD700" strokeWidth={2} dot={{ fill: "#FFD700", r: 4 }} />
                    <Line type="monotone" dataKey="anita" name="Anita" stroke="#FF6B9D" strokeWidth={2} dot={{ fill: "#FF6B9D", r: 4 }} />
                    <Line type="monotone" dataKey="neha" name="Neha" stroke="#9D4EDD" strokeWidth={2} dot={{ fill: "#9D4EDD", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Individual Technician Cards */}
          <Card className="p-6 neon-border glass-card">
            <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Individual Performance Summary</h4>
            <div className="grid md:grid-cols-3 gap-4">
              {techs.map((t) => (
                <Card key={t.id} className="p-4 glass-card neon-border">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold">{t.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full border ${t.available ? "bg-green-500/20 text-green-400" : "bg-rose-500/20 text-rose-400"}`}>
                      {t.available ? "Available" : "Busy"}
                    </span>
                  </div>
                  
                  {/* AI Summary */}
                  <div className="glass-card p-3 rounded-lg mb-3 text-xs">
                    <p className="flex items-center gap-1 text-primary font-semibold mb-1">
                      <Brain className="w-3 h-3" /> AI Summary
                    </p>
                    <p className="text-muted-foreground">
                      {t.avgRating && t.avgRating >= 4.7 ? `${t.name.split(' ')[0]} maintains an excellent ${t.avgRating}/5 rating and completes services ${t.avgCompletionTime === "1.8h" ? "10% faster" : "on time"}.` : `${t.name.split(' ')[0]} is performing well with consistent service quality.`}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Today:</span>
                      <span className="font-semibold">{t.completedToday} done, {t.currentTasks} active</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Completed:</span>
                      <span className="font-semibold text-primary">{t.totalCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Time:</span>
                      <span className="font-semibold">{t.avgCompletionTime}</span>
                    </div>
                    {t.certifications && t.certifications.length > 0 && (
                      <div>
                        <p className="text-muted-foreground mb-1">Certifications:</p>
                        <div className="flex flex-wrap gap-1">
                          {t.certifications.map((cert, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Technician Details Modal */}
          <Dialog open={techDetailsOpen} onOpenChange={setTechDetailsOpen}>
            <DialogContent className="glass-card neon-border max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Technician Performance Profile
                </DialogTitle>
                <DialogDescription>Comprehensive performance analytics and job history</DialogDescription>
              </DialogHeader>
              {focusedTech && (
                <div className="space-y-4">
                  {/* Profile Header */}
                  <div className="glass-card p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold">
                        {focusedTech.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{focusedTech.name}</h3>
                        <p className="text-sm text-muted-foreground">{focusedTech.specialization}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary border border-primary/30">
                            {focusedTech.experience} Experience
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${focusedTech.available ? "bg-green-500/20 text-green-400" : "bg-rose-500/20 text-rose-400"}`}>
                            {focusedTech.available ? "Available" : "Busy"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                          <span className="text-2xl font-bold">{focusedTech.avgRating}</span>
                          <span className="text-muted-foreground">/5</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Based on {Math.round((focusedTech.totalCompleted || 0) * 0.5)} reviews</p>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="glass-card p-3 rounded-xl text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total Completed</p>
                      <p className="text-2xl font-bold text-primary">{focusedTech.totalCompleted}</p>
                    </div>
                    <div className="glass-card p-3 rounded-xl text-center">
                      <p className="text-xs text-muted-foreground mb-1">Avg Completion</p>
                      <p className="text-2xl font-bold text-primary">{focusedTech.avgCompletionTime}</p>
                    </div>
                    <div className="glass-card p-3 rounded-xl text-center">
                      <p className="text-xs text-muted-foreground mb-1">Today</p>
                      <p className="text-2xl font-bold text-primary">{focusedTech.completedToday}</p>
                    </div>
                    <div className="glass-card p-3 rounded-xl text-center">
                      <p className="text-xs text-muted-foreground mb-1">In Progress</p>
                      <p className="text-2xl font-bold text-primary">{focusedTech.currentTasks}</p>
                    </div>
                  </div>

                  {/* AI Performance Summary */}
                  <div className="glass-card p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
                    <div className="flex items-start gap-3">
                      <Brain className="w-5 h-5 text-primary animate-pulse mt-0.5" />
                      <div>
                        <p className="font-semibold text-primary mb-2">AI Performance Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          {focusedTech.avgRating && focusedTech.avgRating >= 4.7 
                            ? `${focusedTech.name.split(' ')[0]} consistently delivers exceptional service quality with a ${focusedTech.avgRating}/5 rating. Average completion time of ${focusedTech.avgCompletionTime} is ${parseFloat(focusedTech.avgCompletionTime || "2.5") < 2.3 ? "12% faster than center average" : "on par with center standards"}. Recommended for priority assignments in ${focusedTech.specialization}.`
                            : `${focusedTech.name.split(' ')[0]} maintains solid performance with consistent service delivery. Specialization in ${focusedTech.specialization} makes them ideal for related service types.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Certifications */}
                  {focusedTech.certifications && focusedTech.certifications.length > 0 && (
                    <div className="glass-card p-4 rounded-xl">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary" />
                        Certifications & Qualifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {focusedTech.certifications.map((cert, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-medium">
                            ✓ {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Monthly Performance Chart */}
                  <div className="glass-card p-4 rounded-xl">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-primary" />
                      Monthly Performance Trend
                    </h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={[
                        { month: "Jul", jobs: Math.round((focusedTech.totalCompleted || 0) / 12) - 4 },
                        { month: "Aug", jobs: Math.round((focusedTech.totalCompleted || 0) / 12) - 2 },
                        { month: "Sep", jobs: Math.round((focusedTech.totalCompleted || 0) / 12) + 1 },
                        { month: "Oct", jobs: Math.round((focusedTech.totalCompleted || 0) / 12) + 3 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#888" style={{ fontSize: "12px" }} />
                        <YAxis stroke="#888" style={{ fontSize: "12px" }} />
                        <RechartsTooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #00E0FF", borderRadius: "8px" }} />
                        <Area type="monotone" dataKey="jobs" stroke="#00E0FF" fill="#00E0FF" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Recent Jobs */}
                  <div className="glass-card p-4 rounded-xl">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4 text-primary" />
                      Recent Jobs
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {orders.filter(o => o.technician === focusedTech.name).slice(0, 5).map((order) => (
                        <div key={order.id} className="p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-mono text-xs text-primary">{order.orderId}</p>
                              <p className="text-sm font-semibold">{order.vehicleReg} • {order.serviceType}</p>
                              <p className="text-xs text-muted-foreground">{new Date(order.startDate).toLocaleDateString()}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full border ${
                              order.status === "Completed" ? "bg-green-500/20 text-green-400" :
                              order.status === "Ongoing" ? "bg-blue-500/20 text-blue-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {orders.filter(o => o.technician === focusedTech.name).length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No recent jobs found</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* CALENDAR TAB */}
        <TabsContent value="calendar" className="space-y-6">
          <Card className="p-6 neon-border glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><Calendar className="w-4 h-4" /> Booking Calendar</h3>
              <Button size="sm" onClick={() => toast.info("Add Booking feature coming soon")}>
                + Add Booking
              </Button>
            </div>

            {/* Summary */}
            {selectedDate && (
              <div className="glass-card p-3 rounded-xl mb-4">
                <p className="text-sm">
                  <strong className="text-primary">{todaysBookings.length} appointments</strong> scheduled for <strong>{selectedDate.toDateString()}</strong>
                  {todaysBookings.length > 0 && ` • Peak time: ${todaysBookings.find(o => o.time)?.time || "10:30–12:00"}`}
                </p>
              </div>
            )}
            
            <div className="grid md:grid-cols-[300px_1fr] gap-6">
              <div>
                <CalendarUI mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border glass-card" />
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center justify-between">
                  <span>Time Slots</span>
                  <span className="text-xs text-muted-foreground font-normal">Color: 🔵 Ongoing | 🟢 Completed | 🟡 Scheduled | 🔴 Cancelled</span>
                </h4>

                {/* Time Slots */}
                <div className="space-y-3">
                  {["09:00–10:30", "10:30–12:00", "12:00–1:30", "2:00–3:30", "3:30–5:00"].map((slot) => {
                    const slotBookings = todaysBookings.filter(o => o.time === slot || !o.time && slot === "10:30–12:00")
                    return (
                      <div key={slot} className="glass-card p-4 rounded-xl">
                        <p className="text-sm font-semibold text-primary mb-2">{slot}</p>
                        {slotBookings.length === 0 && (
                          <p className="text-xs text-muted-foreground">No bookings</p>
                        )}
                        {slotBookings.map((o) => (
                          <div 
                            key={o.id} 
                            className={`p-3 rounded-lg border-l-4 cursor-pointer hover:bg-primary/10 mb-2 transition-all ${
                              o.status === "Ongoing" ? "border-blue-500 bg-blue-500/5" : 
                              o.status === "Completed" ? "border-green-500 bg-green-500/5" : 
                              o.status === "Pending" ? "border-yellow-500 bg-yellow-500/5" : 
                              "border-rose-500 bg-rose-500/5"
                            }`}
                            onClick={() => { setFocusedBooking(o); setDetailsOpen(true) }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-mono text-xs text-primary font-semibold">{o.orderId}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full border ${
                                    o.status === "Pending" ? "bg-yellow-500/20 text-yellow-400" : 
                                    o.status === "Ongoing" ? "bg-blue-500/20 text-blue-400" : 
                                    o.status === "Completed" ? "bg-green-500/20 text-green-400" : 
                                    "bg-rose-500/20 text-rose-400"
                                  }`}>
                                    {o.status}
                                  </span>
                                </div>
                                <p className="text-xs font-semibold">{o.vehicleReg} {o.vehicleType && `• ${o.vehicleType}`}</p>
                                <p className="text-xs text-muted-foreground">{o.serviceType}</p>
                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" /> {o.technician}
                                  </span>
                                  {o.parts && o.parts.length > 0 && (
                                    <span className="flex items-center gap-1">
                                      <Boxes className="w-3 h-3" /> {o.parts.length} part(s)
                                      {o.parts.some(partId => {
                                        const p = parts.find(x => x.partId === partId);
                                        return p && p.qty <= 3;
                                      }) && <span className="text-rose-400">⚠️</span>}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          {/* Booking Details Modal */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="glass-card neon-border max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Hash className="w-4 h-4" /> Booking Details</DialogTitle>
              </DialogHeader>
              {focusedBooking && (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Order ID</p><p className="font-mono">{focusedBooking.orderId}</p></div>
                    <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Vehicle</p><p>{focusedBooking.vehicleReg}</p></div>
                  </div>
                  <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Service Type</p><p>{focusedBooking.serviceType}</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Technician</p><p>{focusedBooking.technician}</p></div>
                    <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Status</p><p>{focusedBooking.status}</p></div>
                  </div>
                  {focusedBooking.time && <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Time</p><p>{focusedBooking.time}</p></div>}
                  {focusedBooking.parts && focusedBooking.parts.length > 0 && (
                    <div className="glass-card p-3 rounded-xl">
                      <p className="text-xs text-muted-foreground mb-2">Required Parts</p>
                      <div className="space-y-1">
                        {focusedBooking.parts.map((partId) => {
                          const p = parts.find(x => x.partId === partId);
                          return p ? (
                            <div key={partId} className="flex items-center justify-between text-xs">
                              <span>{p.name} ({partId})</span>
                              <span className={p.qty <= 3 ? "text-rose-400" : "text-green-400"}>{p.qty} in stock {p.qty <= 3 && "⚠️"}</span>
                            </div>
                          ) : <span key={partId} className="text-xs text-muted-foreground">{partId}</span>
                        })}
                      </div>
                    </div>
                  )}
                  {focusedBooking.remarks && <div className="glass-card p-3 rounded-xl"><p className="text-xs text-muted-foreground">Remarks</p><p>{focusedBooking.remarks}</p></div>}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        {/* FEEDBACK TAB */}
        <TabsContent value="feedback" className="space-y-6">
          <Card className="p-6 neon-border glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Parts Feedback</h3>
              <Button size="sm" onClick={() => setFeedbackDialog(true)}>Submit Feedback</Button>
            </div>

            {/* Feedback Dialog */}
            <Dialog open={feedbackDialog} onOpenChange={setFeedbackDialog}>
              <DialogContent className="glass-card neon-border max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Report Parts Issue</DialogTitle>
                  <DialogDescription>Notify manufacturing team about quality, delays, or shortages.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Select Part</p>
                    <Select value={fbPart} onValueChange={setFbPart}>
                      <SelectTrigger className="bg-transparent"><SelectValue placeholder="Choose a part..." /></SelectTrigger>
                      <SelectContent>
                        {parts.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.partId})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Issue Type</p>
                      <Select value={fbIssue} onValueChange={(v) => setFbIssue(v as Feedback["issueType"])}>
                        <SelectTrigger className="bg-transparent"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Quality">Quality Issue</SelectItem>
                          <SelectItem value="Delay">Delivery Delay</SelectItem>
                          <SelectItem value="Shortage">Stock Shortage</SelectItem>
                          <SelectItem value="Suggestion">Improvement Suggestion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Urgency</p>
                      <Select value={fbUrgency} onValueChange={(v) => setFbUrgency(v as Feedback["urgency"])}>
                        <SelectTrigger className="bg-transparent"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                    <Textarea value={fbDesc} onChange={(e) => setFbDesc(e.target.value)} placeholder="Describe the issue or suggestion..." className="bg-transparent" rows={4} />
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button variant="outline" className="bg-transparent" onClick={() => setFeedbackDialog(false)}>Cancel</Button>
                    <Button onClick={submitFeedback}>Submit Feedback</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Recent Feedback Table */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Recent Feedback</h4>
              {feedbacks.length === 0 && <p className="text-sm text-muted-foreground">No feedback submitted yet.</p>}
              {feedbacks.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feedback ID</TableHead>
                      <TableHead>Part</TableHead>
                      <TableHead>Issue Type</TableHead>
                      <TableHead>Urgency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks.map((fb) => (
                      <TableRow key={fb.id}>
                        <TableCell className="font-mono text-primary">{fb.feedbackId}</TableCell>
                        <TableCell>{fb.partName}</TableCell>
                        <TableCell>{fb.issueType}</TableCell>
                        <TableCell>
                          <span className={`text-xs px-2 py-1 rounded-full border ${fb.urgency === "High" ? "bg-rose-500/20 text-rose-400" : fb.urgency === "Medium" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>{fb.urgency}</span>
                        </TableCell>
                        <TableCell>{fb.status}</TableCell>
                        <TableCell>{new Date(fb.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          {/* AI Summary Card */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="p-6 neon-border glass-card bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary animate-pulse" />
                  AI Performance Summary
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your service center maintained <strong className="text-primary">94% efficiency</strong> this month. 
                  Brake-related services increased by <strong className="text-green-400">12%</strong>, and customer satisfaction improved by <strong className="text-green-400">0.3 points</strong>.
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Performance trending upward</span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* KPI Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-4 neon-border glass-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Avg Completion Time</p>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold">2.3 hrs</p>
              <p className="text-xs text-green-400 mt-1">↓ 8% from last month</p>
            </Card>
            <Card className="p-4 neon-border glass-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Customer Rating</p>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-2xl font-bold">4.6</p>
              <p className="text-xs text-green-400 mt-1">↑ 0.2 from last month</p>
            </Card>
            <Card className="p-4 neon-border glass-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Revenue Estimate</p>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold">₹1.8L</p>
              <p className="text-xs text-green-400 mt-1">↑ 6% from last month</p>
            </Card>
            <Card className="p-4 neon-border glass-card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Total Services (30d)</p>
                <ClipboardList className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{orders.length * 10}</p>
              <p className="text-xs text-muted-foreground mt-1">Across all service types</p>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Service Volume Trend */}
            <Card className="p-6 neon-border glass-card">
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                Service Volume Trend (Weekly)
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { week: "Week 1", services: 45 },
                  { week: "Week 2", services: 52 },
                  { week: "Week 3", services: 48 },
                  { week: "Week 4", services: 61 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="week" stroke="#888" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#888" style={{ fontSize: "12px" }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #00E0FF", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="services" stroke="#00E0FF" strokeWidth={2} dot={{ fill: "#00E0FF", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Technician Efficiency */}
            <Card className="p-6 neon-border glass-card">
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Technician Efficiency (Avg Completion Time)
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={techs.map(t => ({ name: t.name.split(' ')[0], time: parseFloat(t.avgCompletionTime || "2.5") }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#888" style={{ fontSize: "12px" }} label={{ value: "Hours", angle: -90, position: "insideLeft", style: { fontSize: "10px", fill: "#888" } }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #00E0FF", borderRadius: "8px" }} />
                  <Bar dataKey="time" fill="#00E0FF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Parts Consumption */}
            <Card className="p-6 neon-border glass-card">
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Boxes className="w-4 h-4 text-primary" />
                Parts Consumption Trend (Monthly)
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={[
                  { month: "Jan", brakePads: 24, batteries: 8, filters: 31 },
                  { month: "Feb", brakePads: 29, batteries: 12, filters: 35 },
                  { month: "Mar", brakePads: 33, batteries: 15, filters: 40 },
                  { month: "Apr", brakePads: 38, batteries: 11, filters: 38 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#888" style={{ fontSize: "12px" }} />
                  <RechartsTooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #00E0FF", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="brakePads" stackId="1" stroke="#00E0FF" fill="#00E0FF" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="batteries" stackId="1" stroke="#FFD700" fill="#FFD700" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="filters" stackId="1" stroke="#FF6B9D" fill="#FF6B9D" fillOpacity={0.6} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Customer Feedback Distribution */}
            <Card className="p-6 neon-border glass-card">
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 text-primary" />
                Customer Feedback Distribution
              </h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "5 Stars", value: 45, color: "#00FF7F" },
                      { name: "4 Stars", value: 30, color: "#00E0FF" },
                      { name: "3 Stars", value: 15, color: "#FFD700" },
                      { name: "2 Stars", value: 7, color: "#FF8C00" },
                      { name: "1 Star", value: 3, color: "#FF4500" },
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    labelLine={false}
                    style={{ fontSize: "10px" }}
                  >
                    {[
                      { name: "5 Stars", value: 45, color: "#00FF7F" },
                      { name: "4 Stars", value: 30, color: "#00E0FF" },
                      { name: "3 Stars", value: 15, color: "#FFD700" },
                      { name: "2 Stars", value: 7, color: "#FF8C00" },
                      { name: "1 Star", value: 3, color: "#FF4500" },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #00E0FF", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* MESSAGES & NOTIFICATIONS TAB */}
        <TabsContent value="messages" className="space-y-6">
          {/* Tab switcher for Direct Messages vs Broadcasts */}
          <div className="flex items-center justify-between">
            <Tabs value={messagesTab} onValueChange={(v) => setMessagesTab(v as "direct" | "broadcasts")} className="w-full">
              <TabsList className="bg-card/50 p-1">
                <TabsTrigger value="direct" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Direct Messages
                  {messages.filter(m => !m.read && m.sender === "Admin").length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-rose-500 text-white rounded-full">
                      {messages.filter(m => !m.read && m.sender === "Admin").length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="broadcasts" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Broadcasts
                  {broadcasts.filter(b => !b.acknowledged).length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-rose-500 text-white rounded-full">
                      {broadcasts.filter(b => !b.acknowledged).length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Direct Messages Tab Content */}
              <TabsContent value="direct" className="space-y-4 mt-4">
                <Card className="p-6 neon-border glass-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Conversation with Admin
                    </h3>
                    <div className="text-xs text-muted-foreground">
                      {messages.filter(m => !m.read && m.sender === "Admin").length > 0 && (
                        <span className="text-rose-400">
                          You have {messages.filter(m => !m.read && m.sender === "Admin").length} unread message{messages.filter(m => !m.read && m.sender === "Admin").length > 1 ? 's' : ''} from Admin
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="space-y-3 mb-4 max-h-[500px] overflow-y-auto pr-2">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        No messages yet
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg ${
                            msg.sender === "Admin"
                              ? "bg-primary/10 border border-primary/30 mr-8"
                              : "bg-card/50 border border-primary/20 ml-8"
                          } ${!msg.read && msg.sender === "Admin" ? "ring-2 ring-primary/50 animate-pulse" : ""}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-primary">{msg.sender === "Admin" ? "Admin" : centerName}</span>
                            <div className="flex items-center gap-2">
                              {msg.priority && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                  msg.priority === "High" ? "bg-rose-500/20 text-rose-400" :
                                  msg.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                  "bg-green-500/20 text-green-400"
                                }`}>
                                  {msg.priority}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm">{msg.content}</p>
                          {msg.relatedId && (
                            <p className="text-xs text-muted-foreground mt-1">Related: {msg.relatedId}</p>
                          )}
                          {!msg.read && msg.sender === "Admin" && (
                            <button
                              onClick={() => setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m))}
                              className="text-xs text-primary hover:underline mt-1"
                            >
                              Mark as read
                            </button>
                          )}
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">Priority:</span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={messagePriority === "Low" ? "default" : "outline"}
                          onClick={() => setMessagePriority("Low")}
                          className={messagePriority === "Low" ? "bg-green-500/80 h-7 text-xs" : "h-7 text-xs"}
                        >
                          Low
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={messagePriority === "Medium" ? "default" : "outline"}
                          onClick={() => setMessagePriority("Medium")}
                          className={messagePriority === "Medium" ? "bg-yellow-500/80 h-7 text-xs" : "h-7 text-xs"}
                        >
                          Medium
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={messagePriority === "High" ? "default" : "outline"}
                          onClick={() => setMessagePriority("High")}
                          className={messagePriority === "High" ? "bg-rose-500/80 h-7 text-xs" : "h-7 text-xs"}
                        >
                          High
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Type your message to Admin..."
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="bg-background/50 border-primary/30 min-h-[60px]"
                      />
                      <Button onClick={handleSendMessage} className="bg-primary/80 hover:bg-primary h-auto">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              {/* Broadcasts Tab Content */}
              <TabsContent value="broadcasts" className="space-y-4 mt-4">
                <Card className="p-6 neon-border glass-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Megaphone className="w-5 h-5 text-primary" />
                      Admin Broadcasts
                    </h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">
                        {broadcasts.filter(b => !b.acknowledged).length} Unread
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {broadcasts.length} Total
                      </span>
                    </div>
                  </div>

                  {/* Broadcasts Table */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Broadcast ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead className="text-center">Priority</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {broadcasts.map((broadcast) => (
                          <TableRow key={broadcast.id} className={`${!broadcast.acknowledged ? "bg-primary/5" : ""}`}>
                            <TableCell className="font-mono text-primary">{broadcast.broadcastId}</TableCell>
                            <TableCell className="font-semibold">{broadcast.title}</TableCell>
                            <TableCell className="text-center">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                broadcast.priority === "High" ? "bg-rose-500/20 text-rose-400" :
                                broadcast.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400" :
                                "bg-green-500/20 text-green-400"
                              }`}>
                                {broadcast.priority}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(broadcast.date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-center">
                              {broadcast.acknowledged ? (
                                <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                                  <CheckCircle className="w-4 h-4" />
                                  Read
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-rose-400 text-sm animate-pulse">
                                  <AlertTriangle className="w-4 h-4" />
                                  Unread
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-primary/10 hover:bg-primary/30 border-primary/50 text-primary font-semibold"
                                onClick={() => {
                                  setSelectedBroadcast(broadcast)
                                  setBroadcastViewOpen(true)
                                }}
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>

      {/* Broadcast View Dialog */}
      <Dialog open={broadcastViewOpen} onOpenChange={setBroadcastViewOpen}>
        <DialogContent className="bg-[#0B0E12]/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_0_30px_rgba(0,224,255,0.3)] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Broadcast Details
            </DialogTitle>
            <DialogDescription>View and acknowledge admin broadcast</DialogDescription>
          </DialogHeader>
          {selectedBroadcast && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Broadcast ID</p>
                  <p className="font-mono text-primary font-semibold">{selectedBroadcast.broadcastId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p>{selectedBroadcast.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    selectedBroadcast.priority === "High" ? "bg-rose-500/20 text-rose-400 border border-rose-500/50" :
                    selectedBroadcast.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50" :
                    "bg-green-500/20 text-green-400 border border-green-500/50"
                  }`}>
                    {selectedBroadcast.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  {selectedBroadcast.acknowledged ? (
                    <span className="inline-flex items-center gap-1 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Acknowledged
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Title</p>
                  <p className="text-lg font-semibold">{selectedBroadcast.title}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">{selectedBroadcast.content}</p>
                </div>
                {selectedBroadcast.attachment && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Attachment</p>
                    <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 p-2 rounded-lg border border-primary/20">
                      <Upload className="w-4 h-4" />
                      {selectedBroadcast.attachment}
                    </div>
                  </div>
                )}
              </div>

              {!selectedBroadcast.acknowledged && (
                <div className="flex gap-2 justify-end pt-4">
                  <Button 
                    onClick={() => handleAcknowledgeBroadcast(selectedBroadcast.id)}
                    className="bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Acknowledge Broadcast
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
 }
