import type React from "react"
import type { Metadata } from "next"
import { Inter, Orbitron } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { RoleProvider } from "@/components/role-provider"
import ClickSpark from "@/components/ui/click-spark"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const orbitron = Orbitron({ 
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"]
})

export const metadata: Metadata = {
  title: "Nexus Drive - Connecting Vehicles, Drivers & Intelligence",
  description: "Next-gen automotive intelligence system for predictive maintenance, quality tracking, and AI-powered insights",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${orbitron.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Particle background effect */}
          <div className="particles fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="particle w-2 h-2" style={{ left: '10%', top: '20%', animationDelay: '0s' }} />
            <div className="particle w-3 h-3" style={{ left: '80%', top: '30%', animationDelay: '2s' }} />
            <div className="particle w-1 h-1" style={{ left: '30%', top: '60%', animationDelay: '4s' }} />
            <div className="particle w-2 h-2" style={{ left: '70%', top: '70%', animationDelay: '6s' }} />
            <div className="particle w-1 h-1" style={{ left: '50%', top: '40%', animationDelay: '8s' }} />
            <div className="particle w-2 h-2" style={{ left: '20%', top: '80%', animationDelay: '10s' }} />
            <div className="particle w-3 h-3" style={{ left: '90%', top: '50%', animationDelay: '12s' }} />
          </div>
          
          <RoleProvider>
            <ClickSpark
              sparkColor="#00E0FF"
              sparkSize={12}
              sparkRadius={20}
              sparkCount={10}
              duration={500}
              easing="ease-out"
              extraScale={1.2}
            >
              <div className="relative z-10">
                {children}
              </div>
            </ClickSpark>
          </RoleProvider>
          
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
