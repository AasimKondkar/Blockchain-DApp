export const CONTRACT_ABI = [
  "function issueCertificate(string certificateId, string studentName, string course, string college, string issueDate)",
  "function verifyCertificate(string certificateId) view returns (string studentName, string course, string college, string issueDate, bool exists)",
];

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";
export const LOCAL_RPC_URL = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";
