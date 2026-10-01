import { useState } from "react";
import { LoaderCircle, Search } from "lucide-react";
import CertificateCard from "./CertificateCard.jsx";

export default function VerifyCertificate({ busy, result, onVerify }) {
  const [certificateId, setCertificateId] = useState("");

  function submitForm(event) {
    event.preventDefault();
    onVerify(certificateId);
  }

  return (
    <section className="work-card verify-card" aria-labelledby="verify-heading">
      <div className="card-heading">
        <div>
          <p className="eyebrow">PUBLIC LOOKUP</p>
          <h2 id="verify-heading">Verify a certificate</h2>
        </div>
        <span className="heading-icon heading-icon-light"><Search size={19} /></span>
      </div>

      <form className="lookup-form" onSubmit={submitForm}>
        <label htmlFor="verify-certificate-id">Certificate ID</label>
        <div className="lookup-controls">
          <input
            id="verify-certificate-id"
            value={certificateId}
            onChange={(event) => setCertificateId(event.target.value)}
            placeholder="Enter the certificate ID"
            maxLength={64}
            required
          />
          <button className="button button-dark" type="submit" disabled={busy}>
            {busy ? <LoaderCircle size={16} className="spin-icon" /> : <Search size={16} />}
            {busy ? "Checking..." : "Verify"}
          </button>
        </div>
      </form>

      <div className="verification-result" aria-live="polite">
        {result.status === "idle" && (
          <div className="empty-state">
            <span className="empty-state-mark"><Search size={19} /></span>
            <p>Enter a certificate ID to check its record.</p>
            <small>Verification is a public, read-only blockchain lookup.</small>
          </div>
        )}
        {result.status === "loading" && <p className="feedback">Reading the local blockchain...</p>}
        {result.status === "found" && <CertificateCard certificate={result.certificate} />}
        {result.status === "not-found" && (
          <div className="result-banner result-not-found" role="status">
            <span className="result-symbol" aria-hidden="true">&#10007;</span>
            <div><strong>Certificate Not Found</strong><span>No record matches this certificate ID.</span></div>
          </div>
        )}
        {result.status === "error" && <p className="feedback error-feedback" role="alert">{result.error}</p>}
      </div>
    </section>
  );
}
