import type { ComponentType, SVGProps } from "react"
import {
  Printer,
  Shirt,
  Sparkles,
  Building2,
  Layers,
  Scissors,
  Package,
  Hotel,
} from "lucide-react"

export const serviceIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  printing: Printer,
  branding: Shirt,
  "uv-printing": Sparkles,
  signage: Building2,
  displays: Layers,
  "laser-cutting": Scissors,
  hotel: Hotel,
  additional: Package,
}

