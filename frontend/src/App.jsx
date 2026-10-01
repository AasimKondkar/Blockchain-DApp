import { useEffect, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider, isAddress } from "ethers";
import Navbar from "./components/Navbar.jsx";
import WalletConnect from "./components/WalletConnect.jsx";
import IssueCertificate from "./components/IssueCertificate.jsx";
import VerifyCertificate from "./components/VerifyCertificate.jsx";
import { CONTRACT_ABI, CONTRACT_ADDRESS, LOCAL_RPC_URL } from "./contract.js";

const LOCAL_CHAIN_ID = 31337n;
const LOCAL_CHAIN_ID_HEX = "0x7a69";

function errorMessage(error) {
  if (error?.code === 4001) return "The wallet request was cancelled.";
  return error?.shortMessage || error?.reason || error?.message || "Something went wrong.";
}

export default function App() {
  const [account, setAccount] = useState("");
  const [networkCorrect, setNetworkCorrect] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [issueBusy, setIssueBusy] = useState(false);
  const [issueFeedback, setIssueFeedback] = useState({ status: "", hash: "", error: "" });
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verification, setVerification] = useState({ status: "idle", certificate: null, error: "" });

  const contractReady = isAddress(CONTRACT_ADDRESS);

  useEffect(() => {
    const ethereum = window.ethereum;
    if (!ethereum?.on) return undefined;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || "");
      if (accounts.length === 0) setNetworkCorrect(false);
    };
    const handleChainChanged = (chainId) => {
      setNetworkCorrect(BigInt(chainId) === LOCAL_CHAIN_ID);
    };

    ethereum.on("accountsChanged", handleAccountsChanged);
    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  async function connectWallet() {
    const ethereum = window.ethereum;
    if (!ethereum) {
      setWalletError("MetaMask was not found. Install the browser extension, then reload this page.");
      return;
    }

    setConnecting(true);
    setWalletError("");
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: LOCAL_CHAIN_ID_HEX }],
        });
      } catch (switchError) {
        if (switchError.code !== 4902) throw switchError;
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: LOCAL_CHAIN_ID_HEX,
              chainName: "Hardhat Local",
              nativeCurrency: { name: "Test Ether", symbol: "ETH", decimals: 18 },
              rpcUrls: [LOCAL_RPC_URL],
            },
          ],
        });
      }

      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      setAccount(await signer.getAddress());
      setNetworkCorrect(true);
      if (accounts.length === 0) setAccount("");
    } catch (error) {
      setWalletError(errorMessage(error));
    } finally {
      setConnecting(false);
    }
  }

  async function issueCertificate(details) {
    if (!contractReady) {
      setIssueFeedback({ status: "", hash: "", error: "Deploy the contract first, then restart the frontend." });
      return false;
    }

    setIssueBusy(true);
    setIssueFeedback({ status: "Waiting for wallet confirmation...", hash: "", error: "" });
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const transaction = await contract.issueCertificate(
        details.certificateId.trim(),
        details.studentName.trim(),
        details.course.trim(),
        details.college.trim(),
        details.issueDate
      );

      setIssueFeedback({ status: "Transaction submitted. Waiting for confirmation...", hash: transaction.hash, error: "" });
      await transaction.wait();
      setIssueFeedback({ status: "Certificate issued successfully.", hash: transaction.hash, error: "" });
      return true;
    } catch (error) {
      setIssueFeedback({ status: "", hash: "", error: errorMessage(error) });
      return false;
    } finally {
      setIssueBusy(false);
    }
  }

  async function verifyCertificate(certificateId) {
    if (!contractReady) {
      setVerification({ status: "error", certificate: null, error: "Deploy the contract first, then restart the frontend." });
      return;
    }

    setVerifyBusy(true);
    setVerification({ status: "loading", certificate: null, error: "" });
    try {
      const provider = new JsonRpcProvider(LOCAL_RPC_URL);
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const [studentName, course, college, issueDate, exists] =
        await contract.verifyCertificate(certificateId.trim());

      if (!exists) {
        setVerification({ status: "not-found", certificate: null, error: "" });
      } else {
        setVerification({
          status: "found",
          certificate: { certificateId: certificateId.trim(), studentName, course, college, issueDate },
          error: "",
        });
      }
    } catch (error) {
      setVerification({ status: "error", certificate: null, error: errorMessage(error) });
    } finally {
      setVerifyBusy(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="page-shell">
        <section className="intro-row" aria-label="Project overview">
          <div>
            <p className="eyebrow">ACADEMIC CREDENTIALS / ETHEREUM</p>
            <h1>Blockchain Certificate Verification</h1>
            <p className="intro-copy">Secure and Transparent Student Certificate Verification using Ethereum</p>
          </div>
          <div className="record-note">
            <span className="record-note-number">01</span>
            <span>Issue once.<br />Verify any time.</span>
          </div>
        </section>

        <WalletConnect
          account={account}
          networkCorrect={networkCorrect}
          connecting={connecting}
          walletError={walletError}
          onConnect={connectWallet}
        />

        <div className="workflow-grid">
          <IssueCertificate
            account={account}
            networkCorrect={networkCorrect}
            contractReady={contractReady}
            busy={issueBusy}
            feedback={issueFeedback}
            onIssue={issueCertificate}
          />
          <VerifyCertificate
            busy={verifyBusy}
            result={verification}
            onVerify={verifyCertificate}
          />
        </div>

        <footer className="page-footer">
          <span>Student Certificate Verification</span>
          <span>Hardhat Local Network <i aria-hidden="true" /></span>
        </footer>
      </main>
    </>
  );
}
