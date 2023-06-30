export const mumbaiId = 80001
export const fDAIxAddress = "0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f"
export const dealerAddress = "0x068300cE7E324Ae9AEa95826EB07c347B8D6E954"
export const dealerAbi = [
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "_token",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "INDEX_ID",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "int96",
          "name": "flowRate",
          "type": "int96"
        }
      ],
      "name": "createFlow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "receivers",
          "type": "address[]"
        },
        {
          "internalType": "int96",
          "name": "flowRate",
          "type": "int96"
        }
      ],
      "name": "createFlowBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "campaignId",
          "type": "uint32"
        }
      ],
      "name": "deleteShares",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint32",
          "name": "campaignId",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "distribute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "campaignId",
          "type": "uint32"
        }
      ],
      "name": "gainShare",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "subscribers",
          "type": "address[]"
        },
        {
          "internalType": "uint32",
          "name": "campaignId",
          "type": "uint32"
        }
      ],
      "name": "gainShareBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "subscriber",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "campaignId",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "limit",
          "type": "uint256"
        }
      ],
      "name": "gainShareWithLimit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "subscribers",
          "type": "address[]"
        },
        {
          "internalType": "uint32",
          "name": "campaignId",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "limit",
          "type": "uint256"
        }
      ],
      "name": "gainShareWithLimitBatch",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "newCampaign",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
