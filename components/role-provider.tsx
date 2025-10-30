"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Role = "user" | "admin" | "center"

type RoleContextValue = {
  role: Role
  isAuthenticated: boolean
  login: (opts: { email: string; password: string; role: Role; remember?: boolean }) => Promise<boolean>
  logout: () => void
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("user")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // hydrate from localStorage
    try {
      const stored = typeof window !== "undefined" ? window.localStorage.getItem("nexus-auth") : null
      if (stored) {
        const parsed = JSON.parse(stored) as { role: Role; isAuthenticated: boolean }
        if (parsed?.isAuthenticated && (parsed.role === "user" || parsed.role === "admin" || parsed.role === "center")) {
          setRole(parsed.role)
          setIsAuthenticated(true)
        }
      }
    } catch {}
  }, [])

  async function login(opts: { email: string; password: string; role: Role; remember?: boolean }) {
    const { email, password, role, remember } = opts
    // mock credentials
    const ok =
      (role === "user" && (
        (email === "user@nexus.ai" && password === "1234") ||
        (email === "omraj@nexus.com" && password === "1234")
      )) ||
      (role === "admin" && (
        (email === "admin@nexus.ai" && password === "1234") ||
        (email === "admin@nexus.com" && password === "admin")
      )) ||
      (role === "center" && (
        (email === "easthub@nexus.com" && password === "service123") ||
        (email === "center@nexus.ai" && password === "service123")
      ))

    if (ok) {
      setRole(role)
      setIsAuthenticated(true)
      if (remember && typeof window !== "undefined") {
        window.localStorage.setItem("nexus-auth", JSON.stringify({ role, isAuthenticated: true }))
      }
      return true
    }
    return false
  }

  function logout() {
    setIsAuthenticated(false)
    setRole("user")
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("nexus-auth")
    }
  }

  return <RoleContext.Provider value={{ role, isAuthenticated, login, logout }}>{children}</RoleContext.Provider>
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error("useRole must be used within RoleProvider")
  return ctx
}
