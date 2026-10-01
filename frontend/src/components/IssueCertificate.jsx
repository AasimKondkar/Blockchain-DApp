import { useState } from "react";
import { ArrowUpRight, LoaderCircle, LockKeyhole } from "lucide-react";

const emptyForm = {
  certificateId: "",
  studentName: "",
  course: "",
  college: "",
  issueDate: "",
};

export default function IssueCertificate({ account, networkCorrect, contractReady, busy, feedback, onIssue }) {
  const [form, setForm] = useState(emptyForm);
  const canSubmit = Boolean(account && networkCorrect && contractReady && !busy);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submitForm(event) {
    event.preventDefault();
    const issued = await onIssue(form);
    if (issued) setForm(emptyForm);
  }

  return (
    <section className="work-card issue-card" aria-labelledby="issue-heading">
      <div className="card-heading">
        <div>
          <p className="eyebrow">COLLEGE ADMINISTRATION</p>
          <h2 id="issue-heading">Issue a certificate</h2>
        </div>
        <span className="heading-icon"><ArrowUpRight size={19} /></span>
      </div>

      <form className="form-stack" onSubmit={submitForm}>
        <label>
          Certificate ID
          <input name="certificateId" value={form.certificateId} onChange={updateField} placeholder="e.g. CERT-2026-001" maxLength={64} required />
        </label>
        <label>
          Student name
          <input name="studentName" value={form.studentName} onChange={updateField} placeholder="Full name as printed" maxLength={120} required />
        </label>
        <div className="field-row">
          <label>
            Course
            <input name="course" value={form.course} onChange={updateField} placeholder="e.g. B.Sc. Computer Science" maxLength={120} required />
          </label>
          <label>
            Issue date
            <input name="issueDate" type="date" value={form.issueDate} onChange={updateField} required />
          </label>
        </div>
        <label>
          College name
          <input name="college" value={form.college} onChange={updateField} placeholder="Official institution name" maxLength={160} required />
        </label>

        <button className="button button-primary submit-button" type="submit" disabled={!canSubmit}>
          {busy ? <LoaderCircle size={17} className="spin-icon" /> : <LockKeyhole size={16} />}
          {busy ? "Waiting for confirmation..." : "Issue Certificate"}
        </button>
      </form>

      {!contractReady && <p className="form-hint" role="status">Deploy the contract to enable certificate issuance.</p>}
      {account && !networkCorrect && <p className="form-hint" role="status">Connect MetaMask to Hardhat Local to issue a certificate.</p>}
      {feedback.status && <p className="feedback success-feedback" role="status">{feedback.status}</p>}
      {feedback.error && <p className="feedback error-feedback" role="alert">{feedback.error}</p>}
      {feedback.hash && (
        <p className="transaction-hash">
          Transaction hash <code title={feedback.hash}>{feedback.hash}</code>
        </p>
      )}
    </section>
  );
}
