import { BadgeCheck, BookOpen, CalendarDays, GraduationCap, Landmark } from "lucide-react";

export default function CertificateCard({ certificate }) {
  const details = [
    { label: "Student", value: certificate.studentName, icon: GraduationCap },
    { label: "Course", value: certificate.course, icon: BookOpen },
    { label: "College", value: certificate.college, icon: Landmark },
    { label: "Issue date", value: certificate.issueDate, icon: CalendarDays },
  ];

  return (
    <div className="certificate-result">
      <div className="result-banner result-verified" role="status">
        <BadgeCheck size={21} />
        <div><strong>Certificate Verified</strong><span>Record found on the local Ethereum network.</span></div>
      </div>
      <div className="certificate-id-row">
        <span>Certificate ID</span>
        <code>{certificate.certificateId}</code>
      </div>
      <dl className="certificate-details">
        {details.map(({ label, value, icon: Icon }) => (
          <div className="detail-row" key={label}>
            <dt><Icon size={15} />{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
