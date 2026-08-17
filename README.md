# CAFI Wallet

A real, Ethereum-only mobile-first web wallet built with Next.js 14 + ethers v6. Supports the CarbonFi ecosystem (carbonfi.app & athlasverity.xyz).

## Features

- **Ethereum Mainnet only** — all other chains (Arbitrum, Base, Polygon, BNB) removed.
- **Real wallet** — no mock `window.ethereum`; connects via injected wallets (MetaMask/Rabby) or self-custody private key (`ethers.Wallet`).
- **Send & Receive ETH** — real `sendTransaction` with transaction hash + Etherscan link.
- **Mobile-first responsive UI** — works as a mobile wallet and Chrome extension.
- **CarbonFi green theme** — dominant sustainable green palette matching carbonfi.io.

## Getting Started

```bash
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_ETH_RPC_URL
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Structure

- `app/page.tsx` — splash → login → self-custody setup → dashboard flow
- `providers/carbonfi-web3-provider.tsx` — real EIP-1193 provider context (connectInjected / connectPrivateKey, balance, sendTransaction, sendERC20, signMessage)
- `components/mobile-wallet-dashboard.tsx` — main dashboard (portfolio, send, receive, carbon, DAO)
- `components/send-eth-dialog.tsx` / `receive-dialog.tsx` — real send/receive flows

## Scripts

```bash
pnpm build   # production build (ignores TS lint by design via next.config)
pnpm lint
```

## Security

- Self-custody private keys stay in-browser and are never sent to a server.
- The app enforces Ethereum Mainnet (chainId `0x1`).
