// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract CertificateVerification {
    struct Certificate {
        string studentName;
        string course;
        string college;
        string issueDate;
        bool exists;
    }

    address public immutable admin;
    mapping(string => Certificate) private certificates;

    event CertificateIssued(string certificateId, address indexed issuedBy);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can issue certificates");
        _;
    }

    function issueCertificate(
        string calldata certificateId,
        string calldata studentName,
        string calldata course,
        string calldata college,
        string calldata issueDate
    ) external onlyAdmin {
        require(bytes(certificateId).length > 0, "Certificate ID cannot be empty");
        require(!certificates[certificateId].exists, "Certificate ID already exists");
        require(bytes(studentName).length > 0, "Student name cannot be empty");
        require(bytes(course).length > 0, "Course cannot be empty");
        require(bytes(college).length > 0, "College cannot be empty");
        require(bytes(issueDate).length > 0, "Issue date cannot be empty");

        certificates[certificateId] = Certificate({
            studentName: studentName,
            course: course,
            college: college,
            issueDate: issueDate,
            exists: true
        });

        emit CertificateIssued(certificateId, msg.sender);
    }

    function verifyCertificate(string calldata certificateId)
        external
        view
        returns (
            string memory studentName,
            string memory course,
            string memory college,
            string memory issueDate,
            bool exists
        )
    {
        Certificate storage certificate = certificates[certificateId];
        return (
            certificate.studentName,
            certificate.course,
            certificate.college,
            certificate.issueDate,
            certificate.exists
        );
    }
}
