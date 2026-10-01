import { Check, CircleAlert, Link2, WalletCards } from "lucide-react";

export default function WalletConnect({ account, networkCorrect, connecting, walletError, onConnect }) {
  return (
    <section className="wallet-panel" aria-labelledby="wallet-heading">
      <div className="wallet-icon"><WalletCards size={21} /></div>
      <div className="wallet-copy">
        <h2 id="wallet-heading">Administrator wallet</h2>
        <p>
          {account
            ? account
            : "Connect the account that deployed the contract to issue certificates."}
        </p>
        {account && !networkCorrect && <span className="inline-warning">Switch MetaMask to Hardhat Local (chain ID 31337).</span>}
        {walletError && <span className="inline-error" role="alert">{walletError}</span>}
      </div>
      {account && networkCorrect ? (
        <span className="connected-badge"><Check size={15} /> Connected</span>
      ) : (
        <button className="button button-dark" type="button" onClick={onConnect} disabled={connecting}>
          {connecting ? <Link2 size={16} className="spin-icon" /> : <WalletCards size={16} />}
          {connecting ? "Connecting..." : account ? "Switch network" : "Connect MetaMask"}
        </button>
      )}
      {account && !networkCorrect && <CircleAlert className="wallet-alert-icon" size={18} aria-hidden="true" />}
    </section>
  );
}
