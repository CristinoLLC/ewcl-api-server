import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="mt-4 text-lg text-slate-600">Page not found</p>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for does not exist.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
} 