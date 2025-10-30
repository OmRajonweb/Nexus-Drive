"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { OverviewDashboard } from "@/components/pages/overview-dashboard"
import { DataAnalysisPage } from "@/components/pages/data-analysis"
import { PredictionPage } from "@/components/pages/prediction"
import { EngagementPage } from "@/components/pages/engagement"
import { ServiceLogisticsPage } from "@/components/pages/service-logistics"
import { FeedbackPage } from "@/components/pages/feedback"
import { ManufacturingPage } from "@/components/pages/manufacturing"
import { SecurityPage } from "@/components/pages/security"
import { FleetPage } from "@/components/pages/fleet"
import { AdminPage } from "../components/pages/admin"
import { ServiceCenterPage } from "@/components/pages/service-center"
import { LoginPage } from "@/components/pages/login"
import { useRole } from "@/components/role-provider"

const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.98,
  },
}

export default function Home() {
  const { isAuthenticated, role } = useRole()
  const [currentPage, setCurrentPage] = useState("overview")

  // Redirect after login based on role
  // On first authentication, send admin to admin panel, user to overview
  // Keep user navigation otherwise
  React.useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage(role === "admin" ? "admin" : role === "center" ? "center" : "overview")
    }
  }, [isAuthenticated, role])

  const renderPage = () => {
    switch (currentPage) {
      case "overview":
        return <OverviewDashboard />
      case "admin":
        return <AdminPage />
      case "center":
        return <ServiceCenterPage />
      case "data-analysis":
        return <DataAnalysisPage />
      case "prediction":
        return <PredictionPage />
      case "engagement":
        return <EngagementPage />
      case "service-logistics":
        return <ServiceLogisticsPage />
      case "feedback":
        return <FeedbackPage />
      case "manufacturing":
        return <ManufacturingPage />
      case "security":
        return <SecurityPage />
      case "fleet":
        return <FleetPage />
      default:
        return <OverviewDashboard />
    }
  }

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => { /* page will route via effect */ }} />
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={true} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => {}} sidebarOpen={true} />
        
        <main className="flex-1 overflow-auto p-6 pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
