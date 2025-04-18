# EWCL Bio-Medicine Platform

A scientific bio-medicine platform for analyzing and visualizing protein collapse behavior using the Entropy-Weighted Collapse Likelihood (EWCL) model.

## Features

- Interactive 3D protein visualization using Mol*
- PDB and JSON file upload support
- Real-time EWCL analysis
- Entropy-based heatmaps and visualizations
- Benchmark tracking via Firebase
- Publication-ready outputs
- ClinVar/Ensembl mutation tracking

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript
- 3D Visualization: Mol*
- Data Visualization: Plotly.js
- Backend: FastAPI
- Database: Firebase
- Styling: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.8+
- Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ewcl-protein-toolkit.git
cd ewcl-protein-toolkit
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd ewcl_toolkit
pip install -r requirements.txt
```

4. Set up Firebase:
- Create a new Firebase project
- Enable Authentication and Firestore
- Add your Firebase configuration to `.env.local`

5. Start the development servers:
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd ewcl_toolkit
uvicorn main:app --reload
```

## Project Structure

```
ewcl-protein-toolkit/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   └── lib/             # Utility functions
├── ewcl_toolkit/        # Python backend
│   ├── main.py          # FastAPI server
│   └── requirements.txt # Python dependencies
└── public/              # Static assets
```

## Usage

1. Upload a protein structure (PDB or JSON format)
2. View the 3D structure in the Mol* viewer
3. Run EWCL analysis
4. Explore the entropy maps and collapse likelihood visualizations
5. Export results for publication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Mol* for 3D protein visualization
- Plotly.js for data visualization
- FastAPI for the backend framework
- Firebase for data storage and authentication
