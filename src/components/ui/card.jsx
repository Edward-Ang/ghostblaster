import * as React from "react"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/ThemeContext"

const Card = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        theme === "dark" ? "bg-[var(--bg-dark-card)] text-white border-[var(--border-dark-card)]" : "",
        className
      )}
      {...props} />
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 p-6",
        theme === "dark" ? "bg-[var(--bg-dark-card)] text-white" : "",
        className
      )}
      {...props} />
  )
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  return (
    <div
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight",
        theme === "dark" ? "text-white" : "",
        className
      )}
      {...props} />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  return (
    <div
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        theme === "dark" ? "text-white" : "",
        className
      )}
      {...props} />
  )
})
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  return (
    <div
      ref={ref}
      className={cn(
        "p-6 pt-0",
        theme === "dark" ? "bg-[var(--bg-dark-card)] text-white" : "",
        className
      )}
      {...props} />
  )
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
  const { theme } = useTheme()
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center p-6 pt-0",
        theme === "dark" ? "bg-[var(--bg-dark-card)] text-white" : "",
        className
      )}
      {...props} />
  )
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
