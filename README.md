# Blockchain-Based Student Certificate Verification DApp

A beginner-friendly college mini-project that issues certificates through a Solidity contract and lets anyone look them up on a local Ethereum network. It uses Hardhat, MetaMask, React, Vite, and ethers.js. No backend, database, real ETH, or external network is needed.

## Architecture

```text
React + Vite browser app
  |-- ethers.js + MetaMask signer --> issueCertificate transaction
  |                                     |
  |                                     v
  |                              Hardhat local node
  |                                     |
  |                                     v
  |                         CertificateVerification.sol
  |
  |-- ethers.js read-only RPC call --> verifyCertificate view call
```

Issuing a certificate changes contract state, so the administrator signs a transaction in MetaMask. Verification only reads contract state; it uses a local JSON-RPC provider and requires no wallet or transaction. The local chain's test ETH is only for development and has no real-world value.

## Prerequisites

- Windows 10/11, VS Code, Node.js 20 or later, and npm.
- MetaMask installed in a browser supported by its extension.
- The project dependencies are installed separately in `blockchain` and `frontend` with the commands below.

## Run the local demo

Use three PowerShell terminals. Leave the local node running while deploying and using the frontend.

### 1. Install and test the contract

```powershell
cd D:\EducationBlockchainDApp\blockchain
npm install
npm run compile
npm test
```

Expected: the contract compiles and all five tests pass.

### 2. Start the local Ethereum network

In PowerShell terminal 1:

```powershell
cd D:\EducationBlockchainDApp\blockchain
npm run node
```

Expected: Hardhat reports that the JSON-RPC server is listening at `http://127.0.0.1:8545` and prints test accounts. Keep this terminal open. The printed private keys are public test keys: use them only on this local network, never with real funds or another network.

### 3. Deploy the contract

In PowerShell terminal 2:

```powershell
cd D:\EducationBlockchainDApp\blockchain
npm run deploy
```

Expected: the deployed contract address and administrator address are printed. The script also writes the address to `frontend/.env.local`; that local-only file is ignored by Git. The first Hardhat node account is the administrator. Import its private key from the node terminal into MetaMask for the demo.

### 4. Start the frontend

In PowerShell terminal 3:

```powershell
cd D:\EducationBlockchainDApp\frontend
npm install
npm run dev
```

Open the URL Vite prints, usually `http://localhost:5173`. If the dev server was already running before deployment, stop and restart it so Vite reloads `.env.local`.

Click **Connect MetaMask**. The app prompts MetaMask to add or switch to **Hardhat Local**, chain ID `31337`, at `http://127.0.0.1:8545`. Confirm the network, then issue a test certificate and verify it by ID. A fresh local chain has no previous records.

## Smart contract

`CertificateVerification.sol` stores a `Certificate` struct in `mapping(string => Certificate)`. Each record has a student name, course, college, issue-date string, and existence flag. The deploying account is saved as `admin`; the `onlyAdmin` modifier protects issuance. The contract rejects empty fields and duplicate IDs. `verifyCertificate` is `external view`, so lookups do not submit transactions.

The contract stores certificate details in plaintext on a public ledger. This demo should use fictional student information; do not publish real personal data to a public blockchain.

## Important terms

- **Ethereum / blockchain:** a network and append-only record on which programs and transactions can be executed. Hardhat runs an isolated local development network for this project.
- **Smart contract / Solidity:** a program deployed to the network, written here in Solidity, which enforces the issuance rules and stores the certificate records.
- **MetaMask / wallet address:** MetaMask is the browser wallet that selects an account and approves writes. Its public address identifies that account; its private key must remain secret.
- **Transaction / gas:** a signed request that changes blockchain state. Issuing needs a transaction and gas; Hardhat supplies valueless test ETH locally.
- **Contract address / ABI:** the deployed contract's address identifies where it lives. Its ABI describes callable functions and data so software can interact with it.
- **ethers.js:** the JavaScript library used by this frontend to encode contract calls and communicate with MetaMask or the local RPC endpoint.
- **Read vs. write:** a read (`verifyCertificate`) returns data without changing state or paying gas. A write (`issueCertificate`) changes state, must be signed, and is recorded as a transaction.

## Project structure

```text
EducationBlockchainDApp/
|-- blockchain/
|   |-- contracts/CertificateVerification.sol
|   |-- scripts/deploy.js
|   |-- test/CertificateVerification.test.js
|   |-- hardhat.config.js
|   `-- package.json
|-- frontend/
|   |-- src/components/
|   |   |-- Navbar.jsx
|   |   |-- WalletConnect.jsx
|   |   |-- IssueCertificate.jsx
|   |   |-- VerifyCertificate.jsx
|   |   `-- CertificateCard.jsx
|   |-- src/App.jsx
|   |-- src/contract.js
|   |-- src/main.jsx
|   |-- src/index.css
|   `-- package.json
`-- README.md
```

## Test cases

| Case | Expected result |
| --- | --- |
| Admin issues a certificate | Transaction emits `CertificateIssued` with the ID and issuing account. |
| Verify an issued certificate | All stored fields are returned and `exists` is true. |
| Verify an unknown ID | Empty fields and `exists == false` are returned without reverting. |
| Issue a duplicate ID | Transaction reverts with `Certificate ID already exists`. |
| Another account issues a certificate | Transaction reverts with `Only admin can issue certificates`. |

Run them from `blockchain` with `npm test`.

## Project report material

### Abstract

This project demonstrates a decentralized application for issuing and verifying college certificates. An administrator records certificate details in an Ethereum smart contract, while a verifier retrieves them using a unique certificate ID. A local Hardhat network provides a no-cost environment for demonstrating the workflow. The design illustrates how smart-contract rules can make issued records tamper-resistant, while keeping the application small enough to understand and test.

### Problem statement

Paper certificates and centralized records can be difficult to validate quickly and may be altered or misrepresented. A verifier needs a simple way to confirm whether a certificate ID corresponds to a record issued by the college administrator.

### Objectives

- Store certificate details against unique IDs in a Solidity contract.
- Restrict issuance to the contract deployer and reject duplicate IDs.
- Let anyone verify a record with a read-only call.
- Connect a React interface to MetaMask and a local Ethereum network using ethers.js.
- Demonstrate and test the complete workflow without real cryptocurrency or a backend.

### Methodology

Write and compile the Solidity contract with Hardhat; test issuance, lookup, duplicate rejection, and access control; launch a local Hardhat node; deploy the contract; connect the React/Vite frontend through ethers.js; use MetaMask to approve an issuance transaction; and verify records through a read-only RPC call.

### System architecture and data flow

The administrator fills in the form. React validates required fields, ethers.js builds the contract call, and MetaMask asks the administrator to sign it. The local Ethereum node executes the transaction and stores the record in the contract mapping. For verification, the user enters an ID; ethers.js calls the contract's `view` function through the local RPC endpoint, and the interface displays either the returned details or “Certificate Not Found.”

### Advantages

- Issued entries are recorded in a tamper-resistant ledger.
- Anyone with access to the network can verify a certificate without an account.
- The contract enforces administrator-only issuance and unique IDs.
- The local demo needs no backend, database, real ETH, or paid cloud service.

### Limitations

- The local chain is temporary; restarting it creates a new chain and requires redeployment.
- Certificate text is visible to anyone who can inspect the chain; this is not appropriate for real personal data.
- The prototype trusts one deployer/admin and does not support revocation or correction.
- Local testing does not prove production security or provide public internet access.

### Future scope

Add a document hash (for example, SHA-256) so a verifier can compare a supplied file with the on-chain hash. Other extensions could include certificate revocation, a production test network, and privacy-preserving storage. These are deliberately outside the basic demo.

### Conclusion

The mini-project implements the core certificate lifecycle: an authorized college account issues a unique record, and any verifier can retrieve it by ID. It demonstrates the flow from React through MetaMask and ethers.js to an Ethereum smart contract, with Hardhat providing a safe local environment.

### Suggested screenshots

1. The application home page with wallet disconnected.
2. MetaMask connected to Hardhat Local, showing the wallet address.
3. A completed issue form and the confirmed transaction hash.
4. A successful certificate verification card.
5. The “Certificate Not Found” result for an unknown ID.
6. The passing Hardhat test output.

### Viva questions and answers

1. **What is a smart contract?** A program deployed to a blockchain that executes according to its code.
2. **Why use Solidity?** Solidity is a widely used language for Ethereum smart contracts.
3. **What does Hardhat do here?** It compiles and tests the contract and runs a local Ethereum network.
4. **Why is the administrator address stored?** The contract uses it to restrict certificate issuance to its deployer.
5. **Why can verification be read-only?** Looking up a mapping entry does not change contract state, so it can use a `view` call without a signed transaction.
6. **What is gas?** A measure of the computation required to execute a blockchain operation; local Hardhat test ETH pays for demo transactions.
7. **What is an ABI?** A description of a contract's functions and data formats used by applications to call it.
8. **What is ethers.js used for?** It connects JavaScript code to Ethereum providers, wallets, and smart contracts.
9. **How are duplicate IDs prevented?** The contract checks the existing flag before writing a new record.
10. **What is a limitation of putting details on-chain?** Data is public and hard to remove, so real personal information should not be stored this way.
