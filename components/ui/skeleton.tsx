// filepath: /Users/lucascristino/ewcl-protein-toolkit/web-app/components/ui/skeleton.tsx
import { cn } from "@/lib/utils" // Make sure you have this utility function

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }