const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CertificateVerification", function () {
  let certificateContract;
  let admin;
  let otherAccount;

  const certificate = {
    id: "CERT-2026-001",
    studentName: "Asha Patel",
    course: "B.Sc. Computer Science",
    college: "North Valley College",
    issueDate: "2026-06-15",
  };

  beforeEach(async function () {
    [admin, otherAccount] = await ethers.getSigners();
    const CertificateVerification = await ethers.getContractFactory("CertificateVerification");
    certificateContract = await CertificateVerification.deploy();
    await certificateContract.waitForDeployment();
  });

  it("allows the admin to issue a certificate", async function () {
    await expect(
      certificateContract.issueCertificate(
        certificate.id,
        certificate.studentName,
        certificate.course,
        certificate.college,
        certificate.issueDate
      )
    )
      .to.emit(certificateContract, "CertificateIssued")
      .withArgs(certificate.id, admin.address);
  });

  it("returns the issued certificate details for verification", async function () {
    await certificateContract.issueCertificate(
      certificate.id,
      certificate.studentName,
      certificate.course,
      certificate.college,
      certificate.issueDate
    );

    const [studentName, course, college, issueDate, exists] =
      await certificateContract.verifyCertificate(certificate.id);

    expect(studentName).to.equal(certificate.studentName);
    expect(course).to.equal(certificate.course);
    expect(college).to.equal(certificate.college);
    expect(issueDate).to.equal(certificate.issueDate);
    expect(exists).to.equal(true);
  });

  it("reports a non-existent certificate without reverting", async function () {
    const [studentName, course, college, issueDate, exists] =
      await certificateContract.verifyCertificate("CERT-DOES-NOT-EXIST");

    expect([studentName, course, college, issueDate, exists]).to.deep.equal(["", "", "", "", false]);
  });

  it("rejects duplicate certificate IDs", async function () {
    await certificateContract.issueCertificate(
      certificate.id,
      certificate.studentName,
      certificate.course,
      certificate.college,
      certificate.issueDate
    );

    await expect(
      certificateContract.issueCertificate(
        certificate.id,
        "Another Student",
        certificate.course,
        certificate.college,
        certificate.issueDate
      )
    ).to.be.revertedWith("Certificate ID already exists");
  });

  it("does not allow another account to issue certificates", async function () {
    await expect(
      certificateContract.connect(otherAccount).issueCertificate(
        certificate.id,
        certificate.studentName,
        certificate.course,
        certificate.college,
        certificate.issueDate
      )
    ).to.be.revertedWith("Only admin can issue certificates");
  });
});
