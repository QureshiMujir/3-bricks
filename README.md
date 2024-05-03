<p align="center">
  <a href="" rel="noopener">
 <img src="./frontend/public/logo.png" alt="Project logo"></a>
</p>
<h1 align="center">Rentify</h1>

<div align="center" >

[![Hackathon](https://img.shields.io/badge/hackathon-BitNBuild-purple.svg)](http://hackathon.url.com)

## </div>

<h2 align="center"> 
Making Housing Affordable. 
</h2>

## 🧐 Problem Statement <a name = "problem_statement"></a>

The process of buying and selling property is currently time-consuming, expensive and prone to errors, especially when it comes to the transfer of ownership. This is due to the need for intermediaries such as lawyers and real estate agents, and the lack of transparency and security in the process. The goal of this project is to develop a decentralized platform using Polygon and NFTs that simplifies the process of buying and selling property, increases transparency and security, and reduces the need for intermediaries.

## 💡 Idea / Solution <a name = "idea"></a>

<img src="./frontend/public/assets/idea_initial.png">

## 🏁 Getting Started <a name = "getting_started"></a>

### Frontend

1. Navigate to frontend folder

```bash
cd frontend
```

2. Install dependencies

```bash
npm i
```

3. Start react server

```bash
npm start
```

### MetaMask Setup

1. Install Metamask

2. connect to polygon mumbai network. By clicking on the `Add Polygon Network` in the footer of [this site](https://mumbai.polygonscan.com/)

3. Request some matic from [Polygon Mumbai Faucet](https://faucet.polygon.technology/).

### Deploying smart contract

1. Create a new app on [alchemy](https://dashboard.alchemy.com/) select `chain` as `Polygon` and `network` as `Polygon Mumbai`.

2. Create a `.env` in the `/hardhat` folder

```
ALCHEMY_URL=alchemy_api_key_here
MATIC_PRIVATE_KEY=private_key_here
```

3. Deploy smart contract. In `/hardhat` run:

```bash
npx hardhat test
npm run deploy
```

4. Update contract address in `/frontend/src/constants/index.js`

```tsx
export const contractAddress = "0xaaaaaaaaaaaa";
```

## ⛓️ Dependencies / Limitations <a name = "limitations"></a>

-   **Integration with Legacy Systems**: Integrating the `escrow system` with existing `property registration systems` may be a challenge and could require significant time and effort.

-   **Scalability**: As the use of `NFTs` in the property market grows, the escrow system may need to be scaled to accommodate increasing amounts of transactions, which could also be a challenge.

-   **Regulation**: The use of NFTs in the property market may be subject to various `regulations`, which could impact the implementation and adoption of the escrow system.

-   **Adoption**: The success of the escrow system may depend on widespread adoption by the property market, which could be a challenge if there are concerns about security, `trust`, and ease of use.

## 🚀 Future Scope <a name = "future_scope"></a>

-   Incorporating additional features such as **dispute resolution mechanisms**.

-   Expansion to cover **other types of assets** and properties across different countries.

-   Allowing for the creation of **NFT-based investment products** such as real estate investment trusts.

## ⛏️ Built With <a name = "tech_stack"></a>

-   **Blockchain**
    -   [Polygon](https://polygon.technology/)
    -   [Hardhat](https://hardhat.org/)
-   **Backend**
    -   [Firebase](https://firebase.google.com/)
-   **Frontend**
    -   [React](https://reactjs.org/)

