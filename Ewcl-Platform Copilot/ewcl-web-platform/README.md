# EWCL Web Platform

## Overview

The **EWCL (Entropy-Weighted Collapse Likelihood)** web platform is designed for researchers to analyze protein structures through entropy-based collapse analysis. Users can upload protein files in `.pdb` or `.json` format and receive detailed insights along with 3D visualizations.

## Features

- **Protein Structure Upload**: Users can easily upload protein structures using a drag-and-drop interface.
- **Entropy Collapse Analysis**: The platform provides entropy-based analysis through a Python API or precomputed JSON data.
- **3D Protein Visualization**: Utilizing the Mol* viewer, users can visualize protein structures with entropy overlays.
- **Per-residue Entropy Trend Charts**: Visualize entropy trends on a per-residue basis using interactive charts.
- **Benchmark Saving**: Save analysis benchmarks using Firestore or JSON-based storage.
- **Summary Panel**: View average, maximum, and minimum entropy values derived from the analysis.

## Technologies Used

- **Frontend**: React (Next.js), Tailwind CSS
- **3D Visualization**: Mol* Viewer
- **Charting**: Chart.js or Recharts
- **Backend**: FastAPI or mock API for analysis
- **Database**: Firebase Firestore (optional)

## Project Structure

```
ewcl-web-platform
├── app
│   ├── page.tsx              → Landing page
│   └── ewcl-analysis
│       └── page.tsx          → Main tool interface
├── components
│   ├── MolstarViewer.tsx     → Renders 3D protein structure + overlay
│   ├── EntropyTrendChart.tsx → Chart component
│   ├── UploadBox.tsx         → Drag-n-drop PDB upload
│   └── SummaryCard.tsx       → Displays entropy stats
├── lib
│   ├── firebase.ts           → Firestore logic
│   └── upload.ts             → Vercel blob uploader
├── public
│   └── maps
│       └── entropy_tau.json   → Sample protein data
├── styles
│   └── globals.css
├── .gitignore
├── README.md
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ewcl-web-platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage Guidelines

- To upload a protein structure, navigate to the analysis page and use the drag-and-drop upload box.
- After uploading, the platform will process the data and display the entropy analysis results along with 3D visualizations.
- Explore the trend charts for detailed insights on per-residue entropy values.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.