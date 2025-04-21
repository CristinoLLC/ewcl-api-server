"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"

interface UploadDropzoneProps {
  onFileUpload: (file: File) => Promise<void>
  isLoading?: boolean
}

export function UploadDropzone({ onFileUpload, isLoading = false }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      if (!file.name.endsWith(".pdb") && !file.name.endsWith(".json")) {
        toast.error("Please upload a .pdb or .json file")
        return
      }

      setFile(file)
      try {
        await onFileUpload(file)
      } catch (error) {
        console.error("Upload error:", error)
        setFile(null)
      }
    },
    [onFileUpload]
  )

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    accept: {
      "chemical/x-pdb": [".pdb"],
      "application/json": [".json"],
    },
    multiple: false,
    disabled: isLoading,
  })

  return (
    <Card
      {...getRootProps()}
      className={`relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
        isDragReject
          ? "border-red-500 bg-red-50"
          : isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-slate-200 bg-slate-50 hover:bg-slate-100"
      } ${isLoading ? "pointer-events-none opacity-50" : ""}`}
    >
      <input {...getInputProps()} />
      {isDragReject ? (
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
      ) : file ? (
        <FileText className="mb-4 h-12 w-12 text-slate-400" />
      ) : (
        <Upload className="mb-4 h-12 w-12 text-slate-400" />
      )}
      <div className="text-center">
        <p className="mb-2 text-sm font-medium text-slate-900">
          {isLoading
            ? "Uploading..."
            : file
            ? file.name
            : "Upload protein structure"}
        </p>
        <p className="text-xs text-slate-500">
          {isDragReject ? (
            "Please upload a .pdb or .json file"
          ) : (
            <>
              Drag & drop a <code className="text-slate-700">.pdb</code> or{" "}
              <code className="text-slate-700">.json</code> file
              <br />
              or click to select
            </>
          )}
        </p>
      </div>
    </Card>
  )
} 