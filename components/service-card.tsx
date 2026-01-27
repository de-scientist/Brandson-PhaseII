"use client"

import { motion } from "framer-motion"
import { serviceIcons } from "./icons"
import { Button } from "@/components/ui/button"

type ServiceCardProps = {
  service: any
  categoryIconKey?: string
  onQuote?: (service: any) => void
  onPay?: (service: any) => void
}

export function ServiceCard({ service, categoryIconKey, onQuote, onPay }: ServiceCardProps) {
  const Icon = serviceIcons[categoryIconKey || "printing"] ?? serviceIcons.printing
  const ctaType = service.ctaType ?? "quote"
  const ctaLabel = service.ctaLabel ?? (ctaType === "pay" ? "Pay Now" : "Request Quote")

  const handleClick = () => {
    if (ctaType === "pay" && onPay) onPay(service)
    else if (onQuote) onQuote(service)
  }

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4"
    >
      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
          aria-label={service.name}
        >
          <Icon className="h-5 w-5 text-primary" />
        </motion.div>
        <div>
          <h3 className="font-semibold text-card-foreground">{service.name}</h3>
          {service.shortDescription && (
            <p className="mt-1 text-sm text-muted-foreground">{service.shortDescription}</p>
          )}
        </div>
      </div>

      {service.pricingTiers?.length ? (
        <div className="mt-2 space-y-1">
          {service.pricingTiers.map((tier: any) => (
            <div key={tier.label} className="flex justify-between text-xs text-muted-foreground">
              <span>{tier.label}</span>
              <span className="font-medium text-primary">
                {tier.currency ?? "KES"} {tier.price}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-3">
        <Button size="sm" className="w-full" onClick={handleClick}>
          {ctaLabel}
        </Button>
      </div>
    </motion.div>
  )
}

