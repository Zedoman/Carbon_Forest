# Carbon Forest: RWA-Backed Stablecoin & Tokenized Forest Marketplace

A blockchain platform that enables users to invest in tokenized forest land that generates carbon credits, with a yield-bearing stablecoin pegged to carbon credit values and an interactive metaverse component.

## Key Features

- **Tokenization Dashboard**: Interface showing available forest parcels for investment, with real-time data on carbon sequestration potential and expected yields
- **Stablecoin Wallet**: Displays user's token balance, accumulated yield from carbon credits, and transaction history
- **Metaverse Forest Viewer**: 3D interactive representation of owned forest plots where users can monitor growth and complete conservation tasks
- **Marketplace**: Trading platform for buying/selling forest tokens with price charts, filtering options, and integration with the Pharos payment system
- **Sustainability**: Visual dashboard showing environmental impact metrics (CO2 sequestered, biodiversity supported) from user investments

## Project Architecture

```mermaid
graph TD
    A[User Enters Platform] --> B[Main Dashboard]
    
    %% Tokenization Dashboard Flow
    B --> C[Tokenization Dashboard]
    C --> C1[Browse Available Forest Parcels]
    C1 --> C2[View Parcel Details]
    C2 --> C3{Invest in Forest Parcel?}
    C3 -->|Yes| C4[Select Investment Amount]
    C4 --> C5[Confirm Transaction]
    C5 --> C6[Receive Forest Tokens]
    C6 --> B
    C3 -->|No| C1
    
    %% Stablecoin Wallet Flow
    B --> D[Stablecoin Wallet]
    D --> D1[View Token Balance]
    D --> D2[Check Carbon Credit Yield]
    D --> D3[Review Transaction History]
    D --> D4{Perform Transaction?}
    D4 -->|Yes| D5[Select Transaction Type]
    D5 --> D6[Enter Transaction Details]
    D6 --> D7[Confirm Transaction]
    D7 --> D
    D4 -->|No| B
    
    %% Metaverse Forest Viewer Flow
    B --> E[Metaverse Forest Viewer]
    E --> E1[Load 3D Forest Representation]
    E1 --> E2[Navigate Through Forest]
    E2 --> E3[Monitor Tree Growth]
    E2 --> E4{Complete Conservation Task?}
    E4 -->|Yes| E5[Select Task]
    E5 --> E6[Complete Task Actions]
    E6 --> E7[Receive Rewards]
    E7 --> E2
    E4 -->|No| E2
    E2 --> E8[Return to Dashboard]
    E8 --> B
    
    %% Marketplace Flow
    B --> F[Marketplace]
    F --> F1[Browse Forest Tokens]
    F1 --> F2[Apply Filters]
    F1 --> F3[View Price Charts]
    F1 --> F4{Buy/Sell Token?}
    F4 -->|Buy| F5[Select Token to Buy]
    F5 --> F6[Enter Purchase Amount]
    F6 --> F7[Connect to Pharos Payment]
    F7 --> F8[Confirm Purchase]
    F8 --> F
    F4 -->|Sell| F9[Select Token to Sell]
    F9 --> F10[Enter Sale Amount]
    F10 --> F11[Set Price]
    F11 --> F12[List on Marketplace]
    F12 --> F
    F4 -->|No| F
    F --> B
    
    %% Impact Tracker Flow
    B --> G[Impact Tracker]
    G --> G1[View CO2 Sequestration Metrics]
    G --> G2[Check Biodiversity Impact]
    G --> G3[Review Historical Impact Data]
    G --> G4[Share Impact Results]
    G4 --> G5[Select Sharing Platform]
    G5 --> G6[Post Impact Results]
    G6 --> G
    G --> B
```

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **Visualization**: Recharts for data visualization
- **3D Rendering**: (To be implemented for Metaverse Forest Viewer)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Project Structure

The application is organized into several main components:

- **Dashboard**: Main entry point with overview and navigation
- **Tokenization**: Components for browsing and investing in forest parcels
- **Wallet**: Components for managing stablecoin and transactions
- **Metaverse**: Components for 3D forest visualization and interaction
- **Marketplace**: Components for trading forest tokens
- **Impact**: Components for tracking and sharing environmental impact

