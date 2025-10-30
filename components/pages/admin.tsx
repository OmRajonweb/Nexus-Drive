"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from "recharts"
import { 
  TrendingUp, Gauge, Users2, Factory, Package, MessageSquare, 
  CheckCircle, XCircle, Clock, AlertTriangle, BarChart3, 
  Activity, Brain, Star, AlertCircle, FileText, Send, Bell,
  Radio, Filter, Search, Truck, CheckCheck, RefreshCw, Archive,
  Eye, Megaphone, Upload
} from "lucide-react"
import { toast } from "sonner"

// Types
type PartsRequest = {
  id: string
  requestId: string
  center: string
  partName: string
  quantity: number
  priority: "Low" | "Medium" | "High"
  status: "Pending" | "Approved" | "Dispatched" | "Fulfilled" | "Rejected"
  date: string
  reason?: string
  dispatchDate?: string
  fulfillmentDate?: string
}

type ServiceFeedback = {
  id: string
  feedbackId: string
  center: string
  partName: string
  issueType: "Quality" | "Delay" | "Shortage" | "Suggestion"
  urgency: "Low" | "Medium" | "High"
  description: string
  status: "Pending Review" | "Reviewed" | "Resolved" | "Follow-Up"
  date: string
  adminComment?: string
}

type Message = {
  id: string
  messageId: string
  sender: "Admin" | string
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
  recipients: string
  attachment?: string
  acknowledgments: { center: string; confirmed: boolean; time?: string }[]
}

type ServiceCenter = {
  name: string
  online: boolean
  unreadCount: number
}

// Mock Data
const initialPartsRequests: PartsRequest[] = [
  { id: "1", requestId: "PR-2025-1101", center: "East Hub", partName: "Brake Pads", quantity: 20, priority: "High", status: "Pending", date: "2025-11-01", reason: "High demand" },
  { id: "2", requestId: "PR-2025-1102", center: "West Hub", partName: "Oil Filter", quantity: 10, priority: "Medium", status: "Dispatched", date: "2025-10-30", dispatchDate: "2025-10-30" },
  { id: "3", requestId: "PR-2025-1103", center: "North Hub", partName: "Battery", quantity: 5, priority: "High", status: "Approved", date: "2025-11-01", reason: "Stock depletion" },
  { id: "4", requestId: "PR-2025-1104", center: "South Hub", partName: "Spark Plugs", quantity: 15, priority: "Low", status: "Fulfilled", date: "2025-10-29", fulfillmentDate: "2025-10-30" },
  { id: "5", requestId: "PR-2025-1105", center: "East Hub", partName: "Air Filter", quantity: 8, priority: "Medium", status: "Pending", date: "2025-10-31" },
  { id: "6", requestId: "PR-2025-1106", center: "West Hub", partName: "Brake Pads", quantity: 12, priority: "High", status: "Pending", date: "2025-11-01", reason: "EV service demand spike" },
]

const initialServiceFeedbacks: ServiceFeedback[] = [
  { id: "1", feedbackId: "FB-2025-009", center: "East Hub", partName: "Brake Pads", issueType: "Quality", urgency: "High", description: "Brake pads wearing early on EVs", status: "Pending Review", date: "2025-11-01" },
  { id: "2", feedbackId: "FB-2025-010", center: "North Hub", partName: "Oil Filter", issueType: "Delay", urgency: "Medium", description: "Late supply affecting service schedules", status: "Reviewed", date: "2025-10-30" },
  { id: "3", feedbackId: "FB-2025-011", center: "West Hub", partName: "Battery", issueType: "Shortage", urgency: "High", description: "Insufficient battery stock", status: "Pending Review", date: "2025-10-31" },
  { id: "4", feedbackId: "FB-2025-012", center: "South Hub", partName: "Spark Plugs", issueType: "Suggestion", urgency: "Low", description: "Request for eco-friendly alternatives", status: "Resolved", date: "2025-10-28" },
  { id: "5", feedbackId: "FB-2025-013", center: "East Hub", partName: "Tire Set", issueType: "Quality", urgency: "Medium", description: "Tread wear inconsistent across batches", status: "Pending Review", date: "2025-11-01" },
]

const serviceCenters: ServiceCenter[] = [
  { name: "East Hub", online: true, unreadCount: 2 },
  { name: "West Hub", online: true, unreadCount: 0 },
  { name: "North Hub", online: false, unreadCount: 1 },
  { name: "South Hub", online: true, unreadCount: 0 },
]

const initialMessages: Message[] = [
  { id: "1", messageId: "MSG-2025-050", sender: "Admin", receiver: "East Hub", content: "Your request PR-2025-1101 for 20 Brake Pads is under review.", timestamp: "2025-11-01T10:30:00Z", priority: "High", read: true },
  { id: "2", messageId: "MSG-2025-051", sender: "East Hub", receiver: "Admin", content: "Urgent: Need immediate approval for brake pads. High customer demand.", timestamp: "2025-11-01T11:45:00Z", priority: "High", read: false, relatedId: "PR-2025-1101" },
  { id: "3", messageId: "MSG-2025-052", sender: "Admin", receiver: "West Hub", content: "🚚 Your request PR-2025-1102 for 10 Oil Filters has been dispatched.", timestamp: "2025-10-30T14:20:00Z", priority: "Medium", read: true, relatedId: "PR-2025-1102" },
  { id: "4", messageId: "MSG-2025-053", sender: "Admin", receiver: "North Hub", content: "Feedback FB-2025-010 has been marked as reviewed. Follow-up scheduled.", timestamp: "2025-10-30T16:00:00Z", priority: "Medium", read: false },
]

const initialBroadcasts: Broadcast[] = [
  {
    id: "1",
    broadcastId: "BRC-2025-011",
    title: "Brake Pad Recall Notice",
    content: "Urgent recall of 2025 EV brake pad batches (Batch #EV-BP-2025-A through #EV-BP-2025-D) due to quality issue. Inform all customers immediately and return affected units.",
    priority: "High",
    date: "2025-11-02",
    recipients: "All Service Centers",
    attachment: "recall-notice.pdf",
    acknowledgments: [
      { center: "East Hub", confirmed: true, time: "16:45" },
      { center: "West Hub", confirmed: false },
      { center: "North Hub", confirmed: true, time: "17:02" },
      { center: "South Hub", confirmed: false },
    ]
  },
  {
    id: "2",
    broadcastId: "BRC-2025-010",
    title: "Maintenance Window Notification",
    content: "Scheduled maintenance window on November 5, 12:00–3:00 PM. System access will be limited during this period.",
    priority: "Medium",
    date: "2025-11-01",
    recipients: "All Service Centers",
    acknowledgments: [
      { center: "East Hub", confirmed: true, time: "10:20" },
      { center: "West Hub", confirmed: true, time: "10:35" },
      { center: "North Hub", confirmed: true, time: "11:15" },
      { center: "South Hub", confirmed: true, time: "10:50" },
    ]
  },
]

// Analytics Data
const partDemandData = [
  { part: "Brake Pads", requests: 12 },
  { part: "Oil Filter", requests: 8 },
  { part: "Battery", requests: 6 },
  { part: "Air Filter", requests: 5 },
  { part: "Spark Plugs", requests: 4 },
]

const requestTrendData = [
  { date: "Oct 24", pending: 3, approved: 7 },
  { date: "Oct 25", pending: 4, approved: 6 },
  { date: "Oct 26", pending: 2, approved: 8 },
  { date: "Oct 27", pending: 5, approved: 5 },
  { date: "Oct 28", pending: 3, approved: 9 },
  { date: "Oct 29", pending: 4, approved: 7 },
  { date: "Oct 30", pending: 5, approved: 6 },
]

const feedbackUrgencyData = [
  { name: "High", value: 8, color: "#ef4444" },
  { name: "Medium", value: 5, color: "#f59e0b" },
  { name: "Low", value: 3, color: "#10b981" },
]

const centerPerformanceData = [
  { center: "East Hub", requests: 18, feedbacks: 6, avgResolution: 1.2, rating: 4.8 },
  { center: "West Hub", requests: 12, feedbacks: 3, avgResolution: 1.8, rating: 4.6 },
  { center: "North Hub", requests: 15, feedbacks: 5, avgResolution: 1.5, rating: 4.7 },
  { center: "South Hub", requests: 10, feedbacks: 5, avgResolution: 2.1, rating: 4.5 },
]

export function AdminPage() {
  const [activeTab, setActiveTab] = React.useState("parts-requests")
  const [selectedRequest, setSelectedRequest] = React.useState<PartsRequest | null>(null)
  const [selectedFeedback, setSelectedFeedback] = React.useState<ServiceFeedback | null>(null)
  const [selectedBroadcast, setSelectedBroadcast] = React.useState<Broadcast | null>(null)
  const [requestDialogOpen, setRequestDialogOpen] = React.useState(false)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = React.useState(false)
  const [messageDialogOpen, setMessageDialogOpen] = React.useState(false)
  const [broadcastDialogOpen, setBroadcastDialogOpen] = React.useState(false)
  const [broadcastViewOpen, setBroadcastViewOpen] = React.useState(false)
  const [requests, setRequests] = React.useState(initialPartsRequests)
  const [feedbacks, setFeedbacks] = React.useState(initialServiceFeedbacks)
  const [messages, setMessages] = React.useState(initialMessages)
  const [broadcasts, setBroadcasts] = React.useState(initialBroadcasts)
  const [selectedCenter, setSelectedCenter] = React.useState<string>("East Hub")
  const [messageContent, setMessageContent] = React.useState("")
  const [messagePriority, setMessagePriority] = React.useState<"Low" | "Medium" | "High">("Medium")
  const [broadcastTitle, setBroadcastTitle] = React.useState("")
  const [broadcastContent, setBroadcastContent] = React.useState("")
  const [broadcastPriority, setBroadcastPriority] = React.useState<"Low" | "Medium" | "High">("Medium")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterCenter, setFilterCenter] = React.useState<string>("All")
  const [filterPart, setFilterPart] = React.useState<string>("All")

  const sendAutoMessage = (receiver: string, content: string, priority: "Low" | "Medium" | "High", relatedId?: string) => {
    const newMessage: Message = {
      id: `${messages.length + 1}`,
      messageId: `MSG-2025-${String(messages.length + 50).padStart(3, '0')}`,
      sender: "Admin",
      receiver,
      content,
      timestamp: new Date().toISOString(),
      priority,
      read: false,
      relatedId,
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleApprove = (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    if (request) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "Approved" as const } : r))
      sendAutoMessage(request.center, `✅ Your request ${request.requestId} for ${request.quantity} ${request.partName} has been approved.`, "Medium", request.requestId)
      toast.success("Parts request approved and notification sent!")
      setRequestDialogOpen(false)
    }
  }

  const handleDispatch = (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    if (request) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "Dispatched" as const, dispatchDate: new Date().toLocaleDateString() } : r))
      sendAutoMessage(request.center, `🚚 Your request ${request.requestId} for ${request.quantity} ${request.partName} has been dispatched.`, "High", request.requestId)
      toast.success("Parts dispatched and notification sent!")
      setRequestDialogOpen(false)
    }
  }

  const handleFulfill = (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    if (request) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "Fulfilled" as const, fulfillmentDate: new Date().toLocaleDateString() } : r))
      sendAutoMessage(request.center, `✅ Request ${request.requestId} has been fulfilled. Parts delivered successfully.`, "Medium", request.requestId)
      toast.success("Request marked as fulfilled!")
      setRequestDialogOpen(false)
    }
  }

  const handleReject = (requestId: string) => {
    const request = requests.find(r => r.id === requestId)
    if (request) {
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: "Rejected" as const } : r))
      sendAutoMessage(request.center, `❌ Your request ${request.requestId} has been rejected. Please contact admin for details.`, "High", request.requestId)
      toast.error("Parts request rejected and notification sent")
      setRequestDialogOpen(false)
    }
  }

  const handleMarkReviewed = (feedbackId: string) => {
    const feedback = feedbacks.find(f => f.id === feedbackId)
    if (feedback) {
      setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, status: "Reviewed" as const } : f))
      sendAutoMessage(feedback.center, `📋 Feedback ${feedback.feedbackId} has been reviewed by admin.`, "Medium", feedback.feedbackId)
      toast.info("Feedback marked as reviewed and notification sent")
      setFeedbackDialogOpen(false)
    }
  }

  const handleMarkResolved = (feedbackId: string) => {
    const feedback = feedbacks.find(f => f.id === feedbackId)
    if (feedback) {
      setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, status: "Resolved" as const } : f))
      sendAutoMessage(feedback.center, `✅ Feedback ${feedback.feedbackId} has been marked as resolved.`, "Medium", feedback.feedbackId)
      toast.success("Feedback marked as resolved and notification sent!")
      setFeedbackDialogOpen(false)
    }
  }

  const handleFollowUp = (feedbackId: string) => {
    const feedback = feedbacks.find(f => f.id === feedbackId)
    if (feedback) {
      setFeedbacks(prev => prev.map(f => f.id === feedbackId ? { ...f, status: "Follow-Up" as const } : f))
      sendAutoMessage(feedback.center, `🔄 Follow-up requested for feedback ${feedback.feedbackId}. Please provide additional details.`, "High", feedback.feedbackId)
      toast.info("Follow-up requested and notification sent")
      setFeedbackDialogOpen(false)
    }
  }

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast.error("Message cannot be empty")
      return
    }
    const newMessage: Message = {
      id: `${messages.length + 1}`,
      messageId: `MSG-2025-${String(messages.length + 50).padStart(3, '0')}`,
      sender: "Admin",
      receiver: selectedCenter,
      content: messageContent,
      timestamp: new Date().toISOString(),
      priority: messagePriority,
      read: false,
    }
    setMessages(prev => [...prev, newMessage])
    toast.success(`Message sent to ${selectedCenter}`)
    setMessageContent("")
    setMessageDialogOpen(false)
  }

  const handleBroadcast = () => {
    if (!broadcastTitle.trim() || !broadcastContent.trim()) {
      toast.error("Title and content are required")
      return
    }
    const newBroadcast: Broadcast = {
      id: `${broadcasts.length + 1}`,
      broadcastId: `BRC-2025-${String(broadcasts.length + 10).padStart(3, '0')}`,
      title: broadcastTitle,
      content: broadcastContent,
      priority: broadcastPriority,
      date: new Date().toLocaleDateString(),
      recipients: "All Service Centers",
      acknowledgments: serviceCenters.map(c => ({ center: c.name, confirmed: false })),
    }
    setBroadcasts(prev => [newBroadcast, ...prev])
    serviceCenters.forEach(center => {
      sendAutoMessage(center.name, `🚨 New broadcast: ${broadcastTitle}`, broadcastPriority, newBroadcast.broadcastId)
    })
    toast.success("Broadcast sent to all service centers!")
    setBroadcastTitle("")
    setBroadcastContent("")
    setBroadcastDialogOpen(false)
  }

  // Computed values
  const pendingRequestsCount = requests.filter(r => r.status === "Pending").length
  const highPriorityCount = requests.filter(r => r.priority === "High" && r.status === "Pending").length
  const approvedCount = requests.filter(r => r.status === "Approved").length
  const dispatchedCount = requests.filter(r => r.status === "Dispatched").length
  const rejectedCount = requests.filter(r => r.status === "Rejected").length

  const pendingFeedbacksCount = feedbacks.filter(f => f.status === "Pending Review").length
  const highUrgencyFeedbackCount = feedbacks.filter(f => f.urgency === "High" && f.status === "Pending Review").length

  const unreadMessagesCount = messages.filter(m => !m.read && m.sender !== "Admin").length

  // Filtered data for analytics
  const filteredRequests = requests.filter(r => {
    const matchesCenter = filterCenter === "All" || r.center === filterCenter
    const matchesPart = filterPart === "All" || r.partName === filterPart
    return matchesCenter && matchesPart
  })

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesCenter = filterCenter === "All" || f.center === filterCenter
    const matchesPart = filterPart === "All" || f.partName === filterPart
    return matchesCenter && matchesPart
  })

  const centerMessages = messages.filter(m => m.sender === selectedCenter || m.receiver === selectedCenter)

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold mb-2 text-gradient">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage parts requests, service center feedbacks, and system analytics</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 neon-border glass-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">High Priority Requests</p>
              <p className="text-2xl font-bold text-rose-400">{highPriorityCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-rose-400" />
          </div>
        </Card>
        <Card className="p-5 neon-border glass-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Approved Requests</p>
              <p className="text-2xl font-bold text-green-400">{approvedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>
        <Card className="p-5 neon-border glass-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingRequestsCount}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>
        <Card className="p-5 neon-border glass-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">High Urgency Feedbacks</p>
              <p className="text-2xl font-bold text-primary">{highUrgencyFeedbackCount}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card/50 p-1 grid w-full grid-cols-4">
          <TabsTrigger value="parts-requests" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Package className="w-4 h-4 mr-2" />
            Parts Requests
          </TabsTrigger>
          <TabsTrigger value="feedbacks" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <MessageSquare className="w-4 h-4 mr-2" />
            Service Feedbacks
          </TabsTrigger>
          <TabsTrigger value="messages" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary relative">
            <Bell className="w-4 h-4 mr-2" />
            Messages & Notifications
            {unreadMessagesCount > 0 && (
              <Badge className="ml-2 bg-rose-500 text-white text-xs px-1.5 py-0 h-5 min-w-5 animate-pulse">
                {unreadMessagesCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics & Insights
          </TabsTrigger>
        </TabsList>

        {/* Parts Requests Tab */}
        <TabsContent value="parts-requests" className="space-y-4">
          <Card className="p-6 neon-border glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Parts Request Management
              </h3>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-rose-500/50">
                  🔥 {highPriorityCount} High Priority
                </Badge>
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                  🟢 {approvedCount} Approved
                </Badge>
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                  🟡 {pendingRequestsCount} Pending
                </Badge>
              </div>
            </div>

            {/* Demand Summary Chart */}
            <div className="mb-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="text-sm font-semibold mb-3">Top 5 Most Requested Parts</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={partDemandData}>
                  <XAxis dataKey="part" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RTooltip 
                    contentStyle={{ background: "rgba(0,0,0,0.9)", border: "1px solid #00E0FF" }}
                    cursor={{ fill: "rgba(0,224,255,0.1)" }}
                  />
                  <Bar dataKey="requests" fill="#00E0FF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Part</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-center">Priority</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-mono text-primary">{req.requestId}</TableCell>
                      <TableCell>{req.center}</TableCell>
                      <TableCell className="font-semibold">{req.partName}</TableCell>
                      <TableCell className="text-center font-bold">{req.quantity}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          req.priority === "High" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" :
                          req.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                          "bg-green-500/20 text-green-400 border-green-500/50"
                        }>
                          {req.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          req.status === "Pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                          req.status === "Approved" ? "bg-green-500/20 text-green-400 border-green-500/50" :
                          "bg-rose-500/20 text-rose-400 border-rose-500/50"
                        }>
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(req.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-primary/10 hover:bg-primary/30 border-primary/50 text-primary font-semibold"
                          onClick={() => {
                            setSelectedRequest(req)
                            setRequestDialogOpen(true)
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

        {/* Service Feedbacks Tab */}
        <TabsContent value="feedbacks" className="space-y-4">
          <Card className="p-6 neon-border glass-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Service Center Feedbacks
              </h3>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Feedback ID</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Part / Issue</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Urgency</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-mono text-primary">{feedback.feedbackId}</TableCell>
                      <TableCell>{feedback.center}</TableCell>
                      <TableCell className="font-semibold">{feedback.partName}</TableCell>
                      <TableCell>{feedback.issueType}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          feedback.urgency === "High" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" :
                          feedback.urgency === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                          "bg-green-500/20 text-green-400 border-green-500/50"
                        }>
                          {feedback.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={
                          feedback.status === "Pending Review" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                          feedback.status === "Reviewed" ? "bg-blue-500/20 text-blue-400 border-blue-500/50" :
                          "bg-green-500/20 text-green-400 border-green-500/50"
                        }>
                          {feedback.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(feedback.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="bg-primary/10 hover:bg-primary/30 border-primary/50 text-primary font-semibold"
                          onClick={() => {
                            setSelectedFeedback(feedback)
                            setFeedbackDialogOpen(true)
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

        {/* Messages & Notifications Tab */}
        <TabsContent value="messages" className="space-y-4">
          {/* Broadcast Button and Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-rose-500/20 text-rose-400 border-rose-500/50">
                <Bell className="w-3 h-3 mr-1" />
                {unreadMessagesCount} Unread
              </Badge>
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/50">
                <Megaphone className="w-3 h-3 mr-1" />
                {broadcasts.length} Broadcasts
              </Badge>
            </div>
            <Dialog open={broadcastDialogOpen} onOpenChange={setBroadcastDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Send Broadcast
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0B0E12]/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_0_30px_rgba(0,224,255,0.3)] max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-primary" />
                    Broadcast to All Service Centers
                  </DialogTitle>
                  <DialogDescription>Send urgent alerts, recalls, or platform-wide notifications</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="broadcast-title">Title</Label>
                    <Input
                      id="broadcast-title"
                      placeholder="e.g., Brake Pad Recall Notice"
                      value={broadcastTitle}
                      onChange={(e) => setBroadcastTitle(e.target.value)}
                      className="bg-background/50 border-primary/30 mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="broadcast-content">Message Content</Label>
                    <Textarea
                      id="broadcast-content"
                      placeholder="Enter your broadcast message..."
                      value={broadcastContent}
                      onChange={(e) => setBroadcastContent(e.target.value)}
                      className="bg-background/50 border-primary/30 mt-1 min-h-32"
                    />
                  </div>
                  <div>
                    <Label>Priority Level</Label>
                    <div className="flex gap-2 mt-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={broadcastPriority === "Low" ? "default" : "outline"}
                        onClick={() => setBroadcastPriority("Low")}
                        className={broadcastPriority === "Low" ? "bg-green-500/80" : ""}
                      >
                        Low
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={broadcastPriority === "Medium" ? "default" : "outline"}
                        onClick={() => setBroadcastPriority("Medium")}
                        className={broadcastPriority === "Medium" ? "bg-yellow-500/80" : ""}
                      >
                        Medium
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={broadcastPriority === "High" ? "default" : "outline"}
                        onClick={() => setBroadcastPriority("High")}
                        className={broadcastPriority === "High" ? "bg-rose-500/80" : ""}
                      >
                        High
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={() => setBroadcastDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBroadcast} className="bg-primary/80 hover:bg-primary">
                      <Send className="w-4 h-4 mr-2" />
                      Send to All Centers
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Service Centers List */}
            <Card className="lg:col-span-4 p-4 neon-border glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users2 className="w-5 h-5" />
                Service Centers
              </h3>
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {serviceCenters.map((center) => (
                    <motion.div
                      key={center.name}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedCenter(center.name)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCenter === center.name
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-card/30 hover:bg-primary/10 border border-primary/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${center.online ? "bg-green-400 animate-pulse" : "bg-gray-400"}`} />
                          <span className="font-semibold">{center.name}</span>
                        </div>
                        {center.unreadCount > 0 && (
                          <Badge className="bg-rose-500 text-white text-xs px-2">
                            {center.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {center.online ? "Online" : "Offline"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Message Thread */}
            <Card className="lg:col-span-8 p-4 neon-border glass-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  {selectedCenter}
                </h3>
                <Button size="sm" variant="outline" onClick={() => setMessageDialogOpen(true)}>
                  <Send className="w-4 h-4 mr-2" />
                  New Message
                </Button>
              </div>
              <Separator className="mb-4" />
              <ScrollArea className="h-[400px] mb-4">
                <div className="space-y-3">
                  {centerMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No messages yet with {selectedCenter}
                    </div>
                  ) : (
                    centerMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg ${
                          msg.sender === "Admin"
                            ? "bg-primary/10 border border-primary/30 ml-8"
                            : "bg-card/50 border border-primary/20 mr-8"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-primary">{msg.sender}</span>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                msg.priority === "High"
                                  ? "bg-rose-500/20 text-rose-400 border-rose-500/50"
                                  : msg.priority === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                  : "bg-green-500/20 text-green-400 border-green-500/50"
                              }`}
                            >
                              {msg.priority}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm">{msg.content}</p>
                        {msg.relatedId && (
                          <p className="text-xs text-muted-foreground mt-1">Related: {msg.relatedId}</p>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="bg-background/50 border-primary/30"
                />
                <Button onClick={handleSendMessage} className="bg-primary/80 hover:bg-primary">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Broadcasts Section */}
          <Card className="p-6 neon-border glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Recent Broadcasts
            </h3>
            <div className="space-y-3">
              {broadcasts.map((broadcast) => (
                <motion.div
                  key={broadcast.id}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 cursor-pointer"
                  onClick={() => {
                    setSelectedBroadcast(broadcast)
                    setBroadcastViewOpen(true)
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className={`${
                            broadcast.priority === "High"
                              ? "bg-rose-500/20 text-rose-400 border-rose-500/50"
                              : broadcast.priority === "Medium"
                              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                              : "bg-green-500/20 text-green-400 border-green-500/50"
                          }`}
                        >
                          {broadcast.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{broadcast.date}</span>
                        <span className="text-xs text-muted-foreground">• {broadcast.broadcastId}</span>
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{broadcast.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{broadcast.content}</p>
                      {broadcast.attachment && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                          <Upload className="w-3 h-3" />
                          {broadcast.attachment}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-xs text-muted-foreground mb-1">Acknowledgments</p>
                      <p className="text-lg font-bold text-primary">
                        {broadcast.acknowledgments.filter((a) => a.confirmed).length} / {broadcast.acknowledgments.length}
                      </p>
                      <Button size="sm" variant="outline" className="mt-2 bg-primary/10 hover:bg-primary/30 border-primary/50 text-primary font-semibold">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Analytics & Insights Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Demand & Inventory Trends */}
            <Card className="p-6 neon-border glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Request Trends (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={requestTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <RTooltip 
                    contentStyle={{ background: "rgba(0,0,0,0.9)", border: "1px solid #00E0FF" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} name="Pending" />
                  <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={2} name="Approved" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Feedback Urgency Distribution */}
            <Card className="p-6 neon-border glass-card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Feedback Urgency Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie 
                    data={feedbackUrgencyData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={90}
                    paddingAngle={5}
                    label
                  >
                    {feedbackUrgencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RTooltip 
                    contentStyle={{ background: "rgba(0,0,0,0.9)", border: "1px solid #00E0FF" }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-2 text-sm text-muted-foreground">
                Total: {feedbackUrgencyData.reduce((a, b) => a + b.value, 0)} Feedbacks
              </div>
            </Card>

            {/* Center Performance */}
            <Card className="p-6 neon-border glass-card lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Center Performance Overview
              </h3>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Center</TableHead>
                      <TableHead className="text-center">Total Requests</TableHead>
                      <TableHead className="text-center">Feedbacks</TableHead>
                      <TableHead className="text-center">Avg Resolution Time</TableHead>
                      <TableHead className="text-center">Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {centerPerformanceData.map((center) => (
                      <TableRow key={center.center}>
                        <TableCell className="font-semibold">{center.center}</TableCell>
                        <TableCell className="text-center font-bold text-primary">{center.requests}</TableCell>
                        <TableCell className="text-center">{center.feedbacks}</TableCell>
                        <TableCell className="text-center font-semibold text-green-400">{center.avgResolution} days</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-yellow-400">{center.rating}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="p-6 neon-border glass-card lg:col-span-2 bg-gradient-to-br from-primary/10 to-accent/10">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 text-primary animate-pulse mt-1" />
                <div>
                  <h4 className="font-semibold text-primary mb-2">AI Insights & Recommendations</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Top Performer:</strong> East Hub (Avg resolution 1.2 days, 4.8⭐ rating). 
                      Recommend using East Hub as process benchmark.
                    </p>
                    <p>
                      <strong className="text-foreground">Predictive Insight:</strong> Based on current service load and part requests, 
                      system predicts increased demand for EV Brake Pads (+18%) and Battery Sensors (+12%) next week.
                    </p>
                    <p>
                      <strong className="text-foreground">Quality Alert:</strong> East Hub reports 40% of all high-priority issues. 
                      Brake Pad defects are the most frequent recurring part concern.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Request Details Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="bg-[#0B0E12]/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_0_30px_rgba(0,224,255,0.3)] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Parts Request Details
            </DialogTitle>
            <DialogDescription>Review and manage parts request</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Request ID</p>
                  <p className="font-mono text-primary font-semibold">{selectedRequest.requestId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Center</p>
                  <p className="font-semibold">{selectedRequest.center}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Part Name</p>
                  <p className="font-semibold">{selectedRequest.partName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-bold text-primary">{selectedRequest.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge variant="outline" className={
                    selectedRequest.priority === "High" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" :
                    selectedRequest.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                    "bg-green-500/20 text-green-400 border-green-500/50"
                  }>
                    {selectedRequest.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className={
                    selectedRequest.status === "Pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                    selectedRequest.status === "Approved" ? "bg-green-500/20 text-green-400 border-green-500/50" :
                    selectedRequest.status === "Dispatched" ? "bg-blue-500/20 text-blue-400 border-blue-500/50" :
                    selectedRequest.status === "Fulfilled" ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/50" :
                    "bg-rose-500/20 text-rose-400 border-rose-500/50"
                  }>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Date Requested</p>
                  <p>{new Date(selectedRequest.date).toLocaleDateString()}</p>
                </div>
                {selectedRequest.dispatchDate && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Dispatch Date</p>
                    <p className="text-sm text-blue-400">{selectedRequest.dispatchDate}</p>
                  </div>
                )}
                {selectedRequest.fulfillmentDate && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Fulfillment Date</p>
                    <p className="text-sm text-cyan-400">{selectedRequest.fulfillmentDate}</p>
                  </div>
                )}
                {selectedRequest.reason && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Reason</p>
                    <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">{selectedRequest.reason}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-between pt-4">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCenter(selectedRequest.center)
                    setMessageContent(`Regarding request ${selectedRequest.requestId}...`)
                    setMessageDialogOpen(true)
                    setRequestDialogOpen(false)
                  }}
                  className="bg-primary/10 border-primary/30"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Quick Message
                </Button>
                <div className="flex gap-2">
                  {selectedRequest.status === "Pending" && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => handleReject(selectedRequest.id)}
                        className="bg-rose-500/20 text-rose-400 border-rose-500/50 hover:bg-rose-500/30"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button 
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </>
                  )}
                  {selectedRequest.status === "Approved" && (
                    <Button 
                      onClick={() => handleDispatch(selectedRequest.id)}
                      className="bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30"
                    >
                      <Truck className="w-4 h-4 mr-2" />
                      Dispatch Parts
                    </Button>
                  )}
                  {selectedRequest.status === "Dispatched" && (
                    <Button 
                      onClick={() => handleFulfill(selectedRequest.id)}
                      className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/30"
                    >
                      <CheckCheck className="w-4 h-4 mr-2" />
                      Mark as Fulfilled
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Feedback Details Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="bg-[#0B0E12]/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_0_30px_rgba(0,224,255,0.3)] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Feedback Details
            </DialogTitle>
            <DialogDescription>Review and manage service center feedback</DialogDescription>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Feedback ID</p>
                  <p className="font-mono text-primary font-semibold">{selectedFeedback.feedbackId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Center</p>
                  <p className="font-semibold">{selectedFeedback.center}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Part</p>
                  <p className="font-semibold">{selectedFeedback.partName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issue Type</p>
                  <p>{selectedFeedback.issueType}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Urgency</p>
                  <Badge variant="outline" className={
                    selectedFeedback.urgency === "High" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" :
                    selectedFeedback.urgency === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                    "bg-green-500/20 text-green-400 border-green-500/50"
                  }>
                    {selectedFeedback.urgency}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline" className={
                    selectedFeedback.status === "Pending Review" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                    selectedFeedback.status === "Reviewed" ? "bg-blue-500/20 text-blue-400 border-blue-500/50" :
                    selectedFeedback.status === "Follow-Up" ? "bg-purple-500/20 text-purple-400 border-purple-500/50" :
                    "bg-green-500/20 text-green-400 border-green-500/50"
                  }>
                    {selectedFeedback.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p>{new Date(selectedFeedback.date).toLocaleDateString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">{selectedFeedback.description}</p>
                </div>
              </div>
              <div className="flex gap-2 justify-between pt-4">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCenter(selectedFeedback.center)
                    setMessageContent(`Regarding feedback ${selectedFeedback.feedbackId}...`)
                    setMessageDialogOpen(true)
                    setFeedbackDialogOpen(false)
                  }}
                  className="bg-primary/10 border-primary/30"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Quick Message
                </Button>
                {selectedFeedback.status !== "Resolved" && (
                  <div className="flex gap-2">
                    {selectedFeedback.status === "Pending Review" && (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => handleFollowUp(selectedFeedback.id)}
                          className="bg-purple-500/20 text-purple-400 border-purple-500/50 hover:bg-purple-500/30"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Request Follow-Up
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleMarkReviewed(selectedFeedback.id)}
                          className="bg-blue-500/20 text-blue-400 border-blue-500/50 hover:bg-blue-500/30"
                        >
                          Mark as Reviewed
                        </Button>
                      </>
                    )}
                    <Button 
                      onClick={() => handleMarkResolved(selectedFeedback.id)}
                      className="bg-green-500/20 text-green-400 border-green-500/50 hover:bg-green-500/30"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="bg-[#0B0E12]/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_0_30px_rgba(0,224,255,0.3)] max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Send Message to {selectedCenter}
            </DialogTitle>
            <DialogDescription>Send a direct message to service center</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="message-content">Message</Label>
              <Textarea
                id="message-content"
                placeholder="Type your message..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                className="bg-background/50 border-primary/30 mt-1 min-h-24"
              />
            </div>
            <div>
              <Label>Priority</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  size="sm"
                  variant={messagePriority === "Low" ? "default" : "outline"}
                  onClick={() => setMessagePriority("Low")}
                  className={messagePriority === "Low" ? "bg-green-500/80" : ""}
                >
                  Low
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={messagePriority === "Medium" ? "default" : "outline"}
                  onClick={() => setMessagePriority("Medium")}
                  className={messagePriority === "Medium" ? "bg-yellow-500/80" : ""}
                >
                  Medium
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={messagePriority === "High" ? "default" : "outline"}
                  onClick={() => setMessagePriority("High")}
                  className={messagePriority === "High" ? "bg-rose-500/80" : ""}
                >
                  High
                </Button>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage} className="bg-primary/80 hover:bg-primary">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Broadcast View Dialog */}
      <Dialog open={broadcastViewOpen} onOpenChange={setBroadcastViewOpen}>
        <DialogContent className="bg-[#0B0E12]/95 backdrop-blur-xl border-2 border-primary/50 shadow-[0_0_30px_rgba(0,224,255,0.3)] max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              Broadcast Details
            </DialogTitle>
            <DialogDescription>View broadcast acknowledgments and details</DialogDescription>
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
                  <Badge variant="outline" className={
                    selectedBroadcast.priority === "High" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" :
                    selectedBroadcast.priority === "Medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                    "bg-green-500/20 text-green-400 border-green-500/50"
                  }>
                    {selectedBroadcast.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Recipients</p>
                  <p>{selectedBroadcast.recipients}</p>
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
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Acknowledgment Status
                </h4>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Center</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Time Acknowledged</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBroadcast.acknowledgments.map((ack) => (
                        <TableRow key={ack.center}>
                          <TableCell className="font-semibold">{ack.center}</TableCell>
                          <TableCell className="text-center">
                            {ack.confirmed ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                                ✅ Confirmed
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                                🕒 Pending
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {ack.time || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Resend Alert
                </Button>
                <Button variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Broadcast
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

