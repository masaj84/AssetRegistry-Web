# TRVE Deployment Guide

Przewodnik wdrożenia smart contractu na Polygon.

---

## Wymagania wstępne

### Narzędzia

| Narzędzie | Wersja | Do czego | Instalacja |
|-----------|--------|----------|------------|
| Node.js | 18+ | Hardhat, deployment | https://nodejs.org |
| Git | 2.0+ | Klonowanie repo | https://git-scm.com |
| Metamask | - | Zarządzanie walletem | https://metamask.io |

### Sprawdzenie wersji

```bash
node --version   # v18.0.0+
npm --version    # v9.0.0+
git --version    # 2.0.0+
```

---

## Krok 1: Utworzenie walleta

### Opcja A: Metamask (zalecane dla testów)

1. Zainstaluj [Metamask](https://metamask.io) w przeglądarce
2. Utwórz nowy wallet lub zaimportuj istniejący
3. **ZAPISZ SEED PHRASE** w bezpiecznym miejscu!
4. Dodaj sieć Polygon Amoy:

```
Network Name: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology
Chain ID: 80002
Currency Symbol: MATIC
Block Explorer: https://amoy.polygonscan.com
```

5. Eksportuj klucz prywatny:
   - Metamask → Account details → Export Private Key
   - **NIGDY nie udostępniaj klucza prywatnego!**

### Opcja B: Programatycznie (dla produkcji)

```javascript
const { ethers } = require('ethers');

// Generowanie nowego walleta
const wallet = ethers.Wallet.createRandom();
console.log('Address:', wallet.address);
console.log('Private Key:', wallet.privateKey);
console.log('Mnemonic:', wallet.mnemonic.phrase);

// ZAPISZ TE DANE BEZPIECZNIE!
```

### Bezpieczeństwo klucza prywatnego

**DO:**
- Przechowuj w zmiennych środowiskowych
- Używaj secrets manager (Azure Key Vault, AWS Secrets, HashiCorp Vault)
- Dla produkcji: Hardware wallet + multisig

**DON'T:**
- Nie commituj do Git
- Nie hardcoduj w kodzie
- Nie przesyłaj przez niezabezpieczone kanały

---

## Krok 2: Pobranie testowego MATIC

### Polygon Amoy Faucet

1. Przejdź do: https://faucet.polygon.technology/
2. Wybierz **Polygon Amoy**
3. Wklej adres swojego walleta
4. Potwierdź CAPTCHA
5. Kliknij "Submit"

**Otrzymasz: 0.5 MATIC** (wystarczy na ~500 transakcji testowych)

### Alternatywne faucety

| Faucet | URL | Limit |
|--------|-----|-------|
| Polygon Official | https://faucet.polygon.technology | 0.5 MATIC/24h |
| Alchemy | https://www.alchemy.com/faucets/polygon-amoy | 0.5 MATIC/24h |
| QuickNode | https://faucet.quicknode.com/polygon/amoy | 0.1 MATIC/24h |

### Sprawdzenie balansu

```bash
# Przez curl
curl -X POST https://rpc-amoy.polygon.technology \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBalance","params":["TWÓJ_ADRES","latest"],"id":1}'
```

Lub na: `https://amoy.polygonscan.com/address/TWÓJ_ADRES`

---

## Krok 3: Przygotowanie projektu Hardhat

### 3.1 Inicjalizacja

```bash
# Utwórz folder na kontrakty
mkdir truvalue-contracts
cd truvalue-contracts

# Inicjalizacja projektu
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv

# Inicjalizacja Hardhat
npx hardhat init
# Wybierz: "Create a JavaScript project"
```

### 3.2 Konfiguracja Hardhat

Utwórz/edytuj `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    amoy: {
      url: process.env.RPC_URL || "https://rpc-amoy.polygon.technology",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 80002,
      gasPrice: 30000000000, // 30 gwei
    },
    polygon: {
      url: process.env.POLYGON_RPC_URL || "https://polygon-rpc.com",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 137,
    }
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
      polygon: process.env.POLYGONSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "polygonAmoy",
        chainId: 80002,
        urls: {
          apiURL: "https://api-amoy.polygonscan.com/api",
          browserURL: "https://amoy.polygonscan.com"
        }
      }
    ]
  }
};
```

### 3.3 Zmienne środowiskowe

Utwórz `.env`:

```env
# Klucz prywatny walleta (bez 0x)
PRIVATE_KEY=your_private_key_here

# RPC URLs
RPC_URL=https://rpc-amoy.polygon.technology
POLYGON_RPC_URL=https://polygon-rpc.com

# Polygonscan API (opcjonalne, do weryfikacji)
POLYGONSCAN_API_KEY=your_api_key
```

**WAŻNE:** Dodaj `.env` do `.gitignore`!

```bash
echo ".env" >> .gitignore
```

---

## Krok 4: Smart Contract

Skopiuj kontrakt do `contracts/TruvalueAnchor.sol`:

Zobacz pełny kod w [SMART-CONTRACT.md](./SMART-CONTRACT.md)

---

## Krok 5: Skrypt deploymentu

Utwórz `scripts/deploy.js`:

```javascript
const hre = require("hardhat");

async function main() {
  console.log("Deploying TruvalueAnchor...");
  console.log("Network:", hre.network.name);
  console.log("Chain ID:", hre.network.config.chainId);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "MATIC");

  // Deploy
  const TruvalueAnchor = await hre.ethers.getContractFactory("TruvalueAnchor");
  const anchor = await TruvalueAnchor.deploy();

  await anchor.waitForDeployment();

  const contractAddress = await anchor.getAddress();
  console.log("\n========================================");
  console.log("TruvalueAnchor deployed to:", contractAddress);
  console.log("========================================\n");

  // Weryfikacja na Polygonscan (opcjonalne)
  if (process.env.POLYGONSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await anchor.deploymentTransaction().wait(5);

    console.log("Verifying contract on Polygonscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified!");
    } catch (e) {
      console.log("Verification failed:", e.message);
    }
  }

  // Output dla konfiguracji
  console.log("\n========================================");
  console.log("CONFIGURATION FOR BACKEND:");
  console.log("========================================");
  console.log(`ANCHOR_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`CHAIN_ID=${hre.network.config.chainId}`);
  console.log(`RPC_URL=${hre.network.config.url}`);
  console.log("========================================\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## Krok 6: Deploy!

```bash
# Kompilacja
npx hardhat compile

# Deploy na Polygon Amoy (testnet)
npx hardhat run scripts/deploy.js --network amoy
```

### Oczekiwany output

```
Deploying TruvalueAnchor...
Network: amoy
Chain ID: 80002
Deployer address: 0x1234...
Deployer balance: 0.5 MATIC

========================================
TruvalueAnchor deployed to: 0xABCD1234...
========================================

CONFIGURATION FOR BACKEND:
========================================
ANCHOR_CONTRACT_ADDRESS=0xABCD1234...
CHAIN_ID=80002
RPC_URL=https://rpc-amoy.polygon.technology
========================================
```

**ZAPISZ ADRES KONTRAKTU!**

---

## Krok 7: Weryfikacja kontraktu

Weryfikacja pozwala widzieć kod źródłowy na Polygonscan.

```bash
npx hardhat verify --network amoy ADRES_KONTRAKTU
```

Sprawdź na: `https://amoy.polygonscan.com/address/ADRES_KONTRAKTU`

---

## Quick Start - Podsumowanie

```bash
# 1. Utwórz wallet i pobierz testowe MATIC

# 2. Setup Hardhat
mkdir truvalue-contracts && cd truvalue-contracts
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts dotenv
npx hardhat init

# 3. Skopiuj kontrakt i konfigurację (z tego dokumentu)

# 4. Konfiguracja .env
echo "PRIVATE_KEY=twój_klucz" > .env

# 5. Deploy
npx hardhat compile
npx hardhat run scripts/deploy.js --network amoy

# 6. Zapisz adres kontraktu!
```

---

## Powiązane dokumenty

- [Smart Contract](./SMART-CONTRACT.md) - Kod kontraktu
- [Backend Integration](./BACKEND-INTEGRATION.md) - Konfiguracja backendu
- [Mainnet Migration](./MAINNET-MIGRATION.md) - Przejście na produkcję

---

**Ostatnia aktualizacja:** 2025-01-29
