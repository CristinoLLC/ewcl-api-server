'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "@radix-ui/react-icons"
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

// Define the structure of a benchmark record
export interface Benchmark {
  id: string; // Firestore document ID
  proteinName: string;
  blobUrl: string; // PDB file URL
  resultUrl: string; // JSON result file URL
  timestamp: Timestamp; // Use Firestore Timestamp
  length?: number; // Optional fields based on schema
  avgScore?: number;
  maxEntropyResidue?: number;
  collapseScore?: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface BenchmarkTableProps {
  benchmarks: Benchmark[];
}

// Helper function to format Firestore Timestamp
const formatTimestamp = (timestamp: Timestamp): string => {
  if (!timestamp) return 'N/A';
  return timestamp.toDate().toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// Helper function to get badge color based on risk level
const getRiskBadgeVariant = (riskLevel: Benchmark['riskLevel']): "default" | "secondary" | "destructive" | "outline" | null | undefined => {
  switch (riskLevel) {
    case 'Low':
      return 'default'; // Greenish (default shadcn badge)
    case 'Medium':
      return 'secondary'; // Yellowish/Greyish
    case 'High':
      return 'destructive'; // Reddish
    default:
      return 'outline';
  }
};

export default function BenchmarkTable({ benchmarks }: BenchmarkTableProps) {
  if (!benchmarks || benchmarks.length === 0) {
    return <p className="text-gray-500 text-center py-8">No benchmark data available.</p>;
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Protein</TableHead>
            <TableHead className="hidden md:table-cell">Avg Score</TableHead>
            <TableHead>Collapse Score</TableHead>
            <TableHead className="hidden lg:table-cell">Max Entropy Residue</TableHead>
            <TableHead>Risk Level</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {benchmarks.map((benchmark) => (
            <TableRow key={benchmark.id}>
              <TableCell className="font-medium">{benchmark.proteinName}</TableCell>
              <TableCell className="hidden md:table-cell">{benchmark.avgScore?.toFixed(3) ?? 'N/A'}</TableCell>
              <TableCell>{benchmark.collapseScore?.toFixed(3) ?? 'N/A'}</TableCell>
              <TableCell className="hidden lg:table-cell">{benchmark.maxEntropyResidue ?? 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getRiskBadgeVariant(benchmark.riskLevel)}>
                  {benchmark.riskLevel}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell">{formatTimestamp(benchmark.timestamp)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(benchmark.blobUrl, '_blank')}
                    title="Download PDB"
                  >
                    <DownloadIcon className="h-4 w-4 mr-1" /> PDB
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(benchmark.resultUrl, '_blank')}
                    title="Download JSON Results"
                  >
                    <DownloadIcon className="h-4 w-4 mr-1" /> JSON
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}