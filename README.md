# Satoshi's Legacy: Block Explorer

A world-class, educational Bitcoin block explorer built to demystify the inner workings of the blockchain, starting from the Genesis block.

## 🌟 Overview

Satoshi's Legacy is more than just a block explorer; it's a pedagogical tool designed to help developers and enthusiasts understand the structural elegance of the Bitcoin protocol. By combining real-time blockchain data with AI-driven insights, users can traverse the chain, analyze transaction inputs/outputs, and decode historical messages hidden in the coinbase.

## 🚀 Features

- **Genesis & Beyond**: Immediate access to Block #0 with the ability to traverse forwards and backwards through the chain.
- **AI-Powered Insights**: Integrated with Google Gemini API to provide technical and historical context for every block.
- **Deep Transaction Analysis**: Visualize transaction structures, including coinbase decodings and fee distributions.
- **Universal Search**: Search for blocks by their numerical height or unique cryptographic hash.
- **Visual vs. Raw Data**: Toggle between a beautiful, user-friendly interface and the raw JSON data for developers.
- **High-Performance Navigation**: Lightning-fast state management for seamless chain traversal.

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Data Source**: Blockchain.info Public API
- **Fonts**: Space Grotesk (UI) & JetBrains Mono (Data)

## 📖 Educational Value

This explorer highlights key Bitcoin concepts:
- **The Coinbase**: Observe the first transaction in every block where new BTC is born.
- **Merkle Roots**: Understand how transaction integrity is summarized in the block header.
- **Difficulty & Bits**: See how the network adjusts to maintain consistent block times.
- **Immutability**: Visualize how blocks are cryptographically linked via `prevblockhash`.

## 🛠 Development

The project uses a modern ESM-based architecture, importing dependencies directly via `esm.sh` to eliminate complex build steps while maintaining high performance and type safety.

---
*Built for the Soluf Community.*