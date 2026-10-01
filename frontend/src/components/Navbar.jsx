import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#top" aria-label="Certificate verification home">
          <span className="brand-mark"><ShieldCheck size={20} strokeWidth={1.8} /></span>
          <span className="brand-label">VERITAS <small>ACADEMIC RECORDS</small></span>
        </a>
        <span className="network-label"><i aria-hidden="true" /> LOCAL TEST NETWORK</span>
      </div>
    </header>
  );
}
