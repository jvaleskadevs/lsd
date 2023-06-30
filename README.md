# Lens Superfluid Dashboard or Lens Social Dealer (LSD)

Lens Superfluid Dashboard or Lens Social Dealer (LSD) is a powerful tool for social payments powered by Superfluid on Lens protocol.

This project is built on the Nader Dabit Lens x Superfluid repo, `app/lens-superfluid`, and a hardhat environment has been implemented to deploy `contracts/Dealer.sol`.

## Main Features

LSD is able to send any type of Superfluid Agreement based on publications made by followers of any address or handle in the Lens protocol.

Inspired by the Superfluid dashboard, in LSD you can view and filter by tags, the publications of the followers of any Lens profile (address or handle) aka you can view the Lens Superfluid Dashboard as any address or Lens handle. 

So, for example, a Superfluid employee might not have access to the Superfluid profile in Lens, but could be in charge of the wallet making payments to Lens users participating in the promotional campaign.

Allowing you to assign payments based on the tags of the publications, without needing to be the owner of the profile.

Payments can be made via CFA or IDA, using the core SDK or using ethereum/contracts to communicate with the Superfluid protocol on the blockchain.

### CFA

Constant flow agreements can be created for a manually selected recipient or for multiple recipients filtered by tags. 

There are two versions, one that leverages batchCall from the Superfluid core SDK and one that uses our Dealer, both allow you to create multiple flows with a single signature. The Dealer is more customizable and flexible. But it is limited by the calldata size (it could be improved by using a Merkle tree like the whitelist system of the NFTs).

### IDA (Campaign Mode)

Instant distribution agreements enable us to create campaigns in parallel using the `INDEX_ID` of each IDA to identify each campaign. This way we can create campaigns based on one tag (or more), update the share units and when the campaign ends simply distribute the funds to the participants while we have as many different campaigns as we wish.

There are two versions, one that leverages batchCall from the Superfluid core SDK and one that uses our Dealer, both allow you to create multiple campaigns and update shares to one or muliple recipients with a single signature. The Dealer has the ability to limit the number of units per address, preventing abuse and it is more customizable and flexible. But it is limited by the calldata size (it could be improved by using a Merkle tree like the whitelist system of the NFTs). 

#### Campaign Flow
- Create Campaign. (1 tx)
- Update recipients share units based on contraints. (1-?? tx(s), update it as many times as you wish)
- Fund the campaign and Distribute. (approve + distribute, 2 tx)

### Followers and Publications

LSD is able to make queries based on followers of a Lens profile by address or by handle.

It is also able to get all the publications of all followers of a Lens profile and filter them by one or more tags.

Currently the application is limited and does not collect all publications or all followers to avoid excessive and useless use of resources. 
You can change that on the `app/lens-superfluid/api.tsx` file.

## Dealer contract
- Address: 0x068300ce7e324ae9aea95826eb07c347b8d6e954
- Mumbai Scan: https://mumbai.polygonscan.com/address/0x068300ce7e324ae9aea95826eb07c347b8d6e954
- Superfluid app: https://app.superfluid.finance/history?view=0x068300cE7E324Ae9AEa95826EB07c347B8D6E954

## Build
First clone the repo:
```
git clone https://github.com/jvaleskadevs/lsd.git
```
This repo contains 2 projects, the Hardhat environment and the frontend inside the app folder, so you will need to build both of them.
The app is a next application, choose your fav package manager (I used npm this time), install dependencies and run the app:
```
cd lsd/app/lens-superfluid

npm install

npm run dev
```
To compile and deploy the Dealer contract, install dependencies, follow the Hardhat flow, add your network url and account, compile and run the  `scripts/deploy.ts`.
```
npm install

npx hardhat run scripts/deploy.ts
```
You may need to change the Dealer contract address on the `app/lens-superfluid/app/constants.tsx`.
