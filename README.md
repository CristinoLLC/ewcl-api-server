# EWCL Protein Toolkit

## Overview
The EWCL Protein Toolkit is a scientific web application for analyzing protein structures using the Entropy-Weighted Collapse Likelihood (EWCL) model. It provides researchers with tools to upload protein structures, visualize them in 3D, and analyze entropy and collapse metrics through an intuitive, research-focused interface.

## Project Structure
```
web-app/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── components/         # Reusable UI components
│   │   │   ├── MolstarViewer.tsx    # 3D protein visualization using Mol*
│   │   │   ├── UploadDropzone.tsx   # File upload with drag-and-drop
│   │   │   ├── EntropySummaryCard.tsx # Analysis summary display
│   │   │   └── ui/            # UI component library (shadcn/ui)
│   │   ├── ewcl-analysis/     # Analysis feature
│   │   │   └── page.tsx       # Main analysis page
│   │   ├── benchmarks/        # Benchmark viewing
│   │   │   └── page.tsx       # Benchmark display page
│   │   └── simulation/        # Simulation feature (future)
│   ├── lib/                   # Utility functions
│   │   ├── upload.ts          # File upload utilities
│   │   └── utils.ts           # General utilities
│   └── styles/                # Global styles
└── public/                    # Static assets
```

## Key Features

### 🧬 Protein Visualization
- Interactive 3D visualization using Mol* (Molstar)
- Multiple representation styles:
  - Cartoon (default)
  - Surface
  - Ball-and-stick
  - Spacefill
- Entropy-based coloring
- Residue labeling
- Responsive viewer that adapts to screen size

### 📊 Analysis Tools
- Upload and process PDB files
- Real-time entropy analysis
- Collapse likelihood prediction
- Interactive charts and visualizations
- Export capabilities for analysis results

### 🔍 Scientific Interface
- Clean, research-focused design
- Clear data hierarchy and visualization
- Intuitive controls and interactions
- Scientific context and tooltips

## Technical Stack
- **Framework**: Next.js 14 with App Router
- **3D Visualization**: Mol* (Molstar)
- **UI Components**: 
  - Tailwind CSS
  - shadcn/ui
  - Lucide icons
- **State Management**: React Hooks
- **File Handling**: react-dropzone
- **Styling**: Tailwind CSS

## Requirements
- Node.js 18.x or later
- npm or yarn package manager

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   Visit `http://localhost:3000` in your browser

## Development Guidelines

### 🧪 Scientific Accuracy
- Maintain scientific integrity in all visualizations
- Ensure entropy calculations are clearly documented
- Keep visualization parameters consistent with research standards
- Protect IP by not exposing backend logic in public views

### 🎨 UI/UX Principles
- White background, black/slate-gray text, light borders
- Use subtle gradients only for entropy/energy/biological meaning
- Clean, readable sans-serif fonts (Inter, Roboto, Helvetica)
- Prioritize clarity of scientific data over decorative animations
- Build each section as an independent module
- Keep side panels collapsible, use tabs for multi-tool pages

### 🔧 Component Development
- Build modular, reusable components
- Separate logic from presentation
- Document component props and usage
- Include loading and error states
- Follow the 2-step flow: Upload → Render
- Ensure responsive design across devices

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
[Add your license information here]

## Contact
[Add contact information for project maintainers]
