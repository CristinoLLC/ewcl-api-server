import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">EWCL Research Lab</h3>
            <p className="mt-2 text-sm text-slate-600">
              Advancing protein structure analysis through entropy-weighted modeling and machine learning.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Resources</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  href="/documentation"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Publications
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Contact</h3>
            <ul className="mt-2 space-y-2">
              <li className="text-sm text-slate-600">
                Email: research@ewcl-lab.org
              </li>
              <li className="text-sm text-slate-600">
                Twitter: @EWCLResearch
              </li>
              <li className="text-sm text-slate-600">
                GitHub: github.com/ewcl-lab
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-600">
            © {new Date().getFullYear()} EWCL Research Lab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}