const fs = require("node:fs");
const path = require("node:path");
const { ethers } = require("hardhat");

async function main() {
  const CertificateVerification = await ethers.getContractFactory("CertificateVerification");
  const certificateVerification = await CertificateVerification.deploy();
  await certificateVerification.waitForDeployment();

  const contractAddress = await certificateVerification.getAddress();
  const frontendDirectory = path.resolve(__dirname, "../../frontend");
  const localConfigPath = path.join(frontendDirectory, ".env.local");

  fs.writeFileSync(localConfigPath, `VITE_CONTRACT_ADDRESS=${contractAddress}\n`, "utf8");

  console.log(`CertificateVerification deployed to: ${contractAddress}`);
  console.log(`Frontend contract address saved to: ${localConfigPath}`);
  console.log(`Admin account: ${(await ethers.getSigners())[0].address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
