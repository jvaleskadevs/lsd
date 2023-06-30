'use client'
import { Framework } from '@superfluid-finance/sdk-core'
import { ethers } from 'ethers'
import React, { useState, useEffect } from 'react'
import { client, getProfiles, getProfilesByHandle, getFollowers, getPublicationsByTags, getPublications } from '../api'
import { dealerAddress, dealerAbi, fDAIxAddress, mumbaiId } from './constants'

declare global {
  interface Window{
    ethereum?:any
  }
}
/// Superfluid SDK-CORE - Create a new CFA (constant flow agreement) also called flow
async function createNewFlow(recipient, flowRate) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()

  const sf = await Framework.create({
    chainId: mumbaiId,
    provider: provider
  })
  const superSigner = sf.createSigner({ signer: signer })
  const fDAIx = await sf.loadSuperToken(fDAIxAddress)

  console.log(fDAIx)

  try {
    const createFlowOperation = fDAIx.createFlow({
      sender: await superSigner.getAddress(),
      receiver: recipient,
      flowRate: flowRate
    })

    console.log(createFlowOperation)
    console.log("Creating your stream...")

    const result = await createFlowOperation.exec(superSigner)
    console.log(result)

    console.log(
      `Congrats - you've just created a money stream!
    `
    )
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  }
}
/// Superfluid SDK-CORE (1 tx per recipient, avoid this) - Create a new CFA per recipient
async function createNewFlows(recipients, flowRate) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()

  const sf = await Framework.create({
    chainId: mumbaiId,
    provider: provider
  })
  const superSigner = sf.createSigner({ signer: signer })
  const fDAIx = await sf.loadSuperToken(fDAIxAddress)

  console.log(fDAIx)

  for (let i = 0; i < recipients.length; i++) {
    try {
      const createFlowOperation = fDAIx.createFlow({
        sender: await superSigner.getAddress(),
        receiver: recipients[i].address,
        flowRate: flowRate
      })

      console.log(createFlowOperation)
      console.log("Creating your stream...")

      const result = await createFlowOperation.exec(superSigner)
      console.log(result)

      console.log("Congrats - you have just created a money stream!")
    } catch (error) {
      console.log("Error: ", error)
      console.error(error)
    }   
  }  
}
/// Superfluid SDK-CORE (BATCH CALL) - Create a new CFA per recipient in a batch call
async function createNewFlowBatch(recipients, flowRate) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()

    const sf = await Framework.create({
      chainId: mumbaiId,
      provider: provider
    })
    const superSigner = sf.createSigner({ signer: signer })
    const fDAIx = await sf.loadSuperToken(fDAIxAddress)

    console.log(fDAIx)
    
    // filtering receiver addresses to met flow constraints
    // may include changes in the flowRate too
    // then, deal with people abusing the system
    recipients = [...new Set(recipients)]
    console.log(recipients)

    let batchCallOps = []
    for (let i = 0; i < recipients.length; i++) {    
      const createFlowOperation = fDAIx.createFlow({
        sender: await superSigner.getAddress(),
        receiver: recipients[i],
        flowRate: flowRate
      })
      console.log(createFlowOperation)
      
      batchCallOps.push(createFlowOperation)
    }
    console.log("Creating your stream...")

    const batchCall = await sf.batchCall(batchCallOps)
    const result = await batchCall.exec(superSigner)
    console.log(result)

    console.log("Congrats - you have just created a money stream!")
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  } 
}
/// Superfluid SDK-CORE - Create a new IDA (instant distribution agreement) index.
/// we call them campaigns, campaignId == indexId
async function createNewCampaign(campaignId) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()

    const sf = await Framework.create({
      chainId: mumbaiId,
      provider: provider
    })
    const superSigner = sf.createSigner({ signer: signer })
    const fDAIx = await sf.loadSuperToken(fDAIxAddress)

    console.log(fDAIx)
   
    const createIndexOperation = fDAIx.createIndex({
      indexId: campaignId ?? "0"
    })
    console.log(createIndexOperation)
    console.log("Creating your IDA index...")

    const result = await createIndexOperation.exec(superSigner)
    console.log(result)

    console.log("Congrats - you have just created a IDA index!")
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  }
}
/// Superfluid SDK-CORE - Updates units of an IDA index. 
/// 1 unit to the recipient
async function updateCampaign(campaignId, subscriber) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()

    const sf = await Framework.create({
      chainId: mumbaiId,
      provider: provider
    })
    const superSigner = sf.createSigner({ signer: signer })
    const fDAIx = await sf.loadSuperToken(fDAIxAddress)

    console.log(fDAIx)
  
    const updateSubscriptionUnitsOperation = fDAIx.updateSubscriptionUnits({
      indexId: campaignId.toString(),
      subscriber: subscriber,
      units: "1"
    })
    console.log(updateSubscriptionUnitsOperation)
    console.log("Updating your campaign...")

    const result = await updateSubscriptionUnitsOperation.exec(superSigner)
    console.log(result)

    console.log("Congrats - you have just updated your campaign!")
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  } 
}
/// Superfluid SDK-CORE (BATCH) - Updates units of an IDA index. 
/// 1 unit per recipient in a batch call
async function updateCampaignBatch(campaignId, subscribers) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()

    const sf = await Framework.create({
      chainId: mumbaiId,
      provider: provider
    })
    const superSigner = sf.createSigner({ signer: signer })
    const fDAIx = await sf.loadSuperToken(fDAIxAddress)

    console.log(fDAIx)

    let batchCallOps = []
    for (let i = 0; i < subscribers.length; i++) {    
      const updateSubscriptionUnitsOperation = fDAIx.updateSubscriptionUnits({
        indexId: campaignId.toString(),
        subscriber: subscribers[i],
        units: "1"
      })
      console.log(updateSubscriptionUnitsOperation)
      
      batchCallOps.push(updateSubscriptionUnitsOperation)
    }
    console.log("Updating your campaign...")

    const batchCall = await sf.batchCall(batchCallOps)
    const result = await batchCall.exec(superSigner)
    console.log(result)

    console.log("Congrats - you have just updated your campaign!")
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  } 
}
/// Superfluid SDK-CORE - Distribute IDA index campaign funds to the subscribers
async function distributeCampaignFunds(campaignId, amount) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()

    const sf = await Framework.create({
      chainId: mumbaiId,
      provider: provider
    })
    const superSigner = sf.createSigner({ signer: signer })
    const fDAIx = await sf.loadSuperToken(fDAIxAddress)

    console.log(fDAIx)
   
    const distributeOperation = fDAIx.distribute({
      indexId: campaignId ?? "0",
      amount: amount
    })
    console.log(distributeOperation)
    console.log("Distributing...")

    const result = await distributeOperation.exec(superSigner)
    console.log(result)

    console.log("Congrats - you have just distributed your amount!")
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  }
}
/// Superfluid Ethereum-contracts - Create a new IDA (instant distribution agreement) index.
//  we call them campaigns, campaignId == indexId, our Dealer contract take care of everything
async function createDealerCampaign() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()
  
  try {
    const dealer = new ethers.Contract(dealerAddress, dealerAbi, signer)
    let tx = await dealer.newCampaign()
    
    provider.once(tx.hash, (transaction) => { logTx(tx.hash) })
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  }  
}
/// Superfluid Ethereum-contracts - Updates units of an unique subscriber of an IDA index. 
/// 1 unit per recipient, our dealer take care of everything
async function updateDealerCampaign(id, recipient, provider) {
  try {
    const dealer = new ethers.Contract(dealerAddress, dealerAbi, provider.getSigner())
    let tx = await dealer.gainShare(recipient, id)    
    provider.once(tx.hash, (transaction) => { logTx(tx.hash) })  
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  }  
}
/// Superfluid Ethereum-contracts - Updates units of an IDA index. 
/// 1 unit per recipient, our dealer take care of everything
async function updateDealerCampaignBatch(id, recipients, provider) {
  try {
    const dealer = new ethers.Contract(dealerAddress, dealerAbi, provider.getSigner())
    let tx = await dealer.gainShareWithLimitBatch(recipients, id, 1)    
    provider.once(tx.hash, (transaction) => { logTx(tx.hash) })  
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  }  
}
async function distributeDealerCampaignFunds(campaignId, campaignFunds) {
  if (!campaignFunds) return
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    const signer = provider.getSigner()
    console.log(signer)

    const sf = await Framework.create({
      chainId: mumbaiId,
      provider: provider
    })
    const superSigner = sf.createSigner({ signer: signer })
    console.log(sf)
    const fDAIx = await sf.loadSuperToken(fDAIxAddress)

    let approveOperation = fDAIx.approve({
      receiver: dealerAddress,
      amount: ethers.utils.parseEther(campaignFunds.toString())
    })
    let approveTx = await approveOperation.exec(superSigner)
    await approveTx.wait()

    const dealer = new ethers.Contract(dealerAddress, dealerAbi, signer)
    let tx = await dealer.distribute(campaignId, ethers.utils.parseEther(campaignFunds.toString()))
    
    provider.once(tx.hash, (transaction) => { logTx(tx.hash) })
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)  
  }  
}
// The Dealer, it controls everything about LSD!
// Calling the dealer to manage everything about LSD!
async function callingTheDealer(recipients, tags, flowRate, sfAgreement, campaignId) {
  if (!recipients || recipients.length === 0) return
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", [])
    
    // filter by tags if any, then extract addresses from publications
    if (recipients.length > 1) {
      recipients = recipients.filter(publication => {
        return tags.length === 0 || tags.some(tag => publication.metadata.tags.includes(tag))
      }).map(recipient => recipient["address"])
      console.log(recipients)
      // maybe show modal before send transaction to confirm recipients
    }
    
    switch (sfAgreement) {
      case "cfa":
        recipients.length === 1 
          ? createNewFlow(recipients[0], flowRate)
          : createNewFlowBatch(recipients, flowRate)  
        break
      case "ida":
        recipients.length === 1 
          ? updateCampaign(campaignId, recipients[0])
          : updateCampaignBatch(campaignId, recipients)    
        break
      case "cfa-dealer":
        recipients.length === 1 
          ? createDealerFlow(recipients[0], flowRate, provider)
          : createDealerFlowBatch(recipients, flowRate, provider)
        break
      case "ida-dealer":
        recipients.length === 1 
          ? updateDealerCampaign(campaignId, recipients[0], provider)
          : updateDealerCampaignBatch(campaignId, recipients, provider)
        break
      default:
        break
    }
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)  
  }
}


/// testOnly function - helps removing the IDA units, to remove all evidences
/// don't recommended on production
async function removeAllEvidencesTestOnly(recipients) {
  if (recipients.length === 0) return
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()

  try {
    const dealer = new ethers.Contract(dealerAddress, dealerAbi, signer)
    let tx = await dealer.removeAllEvidencesOnlyTest(recipients, 0 /* campaignId */)
    
    provider.once(tx.hash, (transaction) => { logTx(tx.hash) })
  } catch (error) {
    console.log("Error: ", error)
    console.error(error)
  }  
}


export default function LSD () {
  const [address, setAddress] = useState("")
  const [lensHandle, setLensHandle] = useState("")
  const [lensAddress, setLensAddress] = useState("") 
  const [sfAgreement, setSfAgreement] = useState("cfa")
  const [profiles, setProfiles] = useState<any>([])
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState<string>([])
  const [publicationsWithTags, setPublicationsWithTags] = useState<any>([])
  const [currentTab, setCurrentTab] = useState("followers")
  const [showEditLens, setShowEditLens] = useState(false)
  const [recipient, setRecipient] = useState("")
  const [flowRate, setFlowRate] = useState("")
  const [flowRateDisplay, setFlowRateDisplay] = useState("") 
  const [campaignId, setCampaignId] = useState(0)
  const [campaignFunds, setCampaignFunds] = useState(0)

  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      })
      console.log("Connected", accounts[0])
      setAddress(accounts[0])
      fetchFollowersByAddress(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window

    if (!ethereum) {
      console.log("Make sure you have metamask!")
      return
    } else {
      console.log("We have the ethereum object", ethereum)
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" })
    if (accounts.length !== 0) {
      const account = accounts[0]
      console.log("Found an authorized account:", account)
      setAddress(account)
      fetchFollowersByAddress(account)
    } else {
      console.log("No authorized account found")
    }
  }
  
  async function fetchFollowersByHandle(handle) {
    if (!handle || handle.includes('.test') === false) return
    try {
      let response = await client.query({
        query: getProfilesByHandle,
        variables: {
          handles: [handle]
        }
      })

      const profileId = response.data.profiles.items[0].id
      const ownedBy = response.data.profiles.items[0].ownedBy
      console.log('response: ', response)
            
      response = await client.query({
        query: getFollowers,
        variables: {
          profileId
        }
      })
      
      console.log('response: ', response)
      let profileData = response.data.followers.items.filter(profile => {
        if (profile.wallet.defaultProfile) {
          return true
        } else {
          return false
        }
      })
      profileData = profileData.map(p => {
        return {
          ...p.wallet.defaultProfile,
          address: p.wallet.address
        }
      }).filter(p => p.picture)
      console.log('profileData:', profileData)
      
      setProfiles(profileData)
      setLensAddress(ownedBy)
    } catch (err) {
      console.log('error getting followers:', err)
    }    
  }

  async function fetchFollowersByAddress(address) {
    if (!address) return
    try {
      let response = await client.query({
        query: getProfiles,
        variables: {
          addresses: [address]
        }
      })

      const profileId = response.data.profiles.items[0].id
      const handle = response.data.profiles.items[0].handle
      console.log('response: ', response)
      
      response = await client.query({
        query: getFollowers,
        variables: {
          profileId
        }
      })      
      console.log('response: ', response)
      
      let profileData = response.data.followers.items.filter(profile => {
        if (profile.wallet.defaultProfile) {
          return true
        } else {
          return false
        }
      })
      profileData = profileData.map(p => {
        return {
          ...p.wallet.defaultProfile,
          address: p.wallet.address
        }
      }).filter(p => p.picture)
      console.log('profileData:', profileData)
      
      setProfiles(profileData)
      setLensHandle(handle)
    } catch (err) {
      console.log('error getting followers:', err)
    }
  }
  
  async function fetchPublicationsByTags() {
    if (profiles.length === 0) return
    try {
      let publications = []
      for (let i = 0; i < profiles.length; i++) {
        let response = await client.query({
          query: getPublications,
          variables: {
            profileId: profiles[i].id
          }
        })
        
        console.log('publicationWithMetadata:', response)
        
        response.data.publications.items.map(publication => {
          let pub = { address: profiles[i].address, ...publication }
          publications.push(pub)
        })
      }
      
      console.log('publicationsWithTags:', publications)
      setPublicationsWithTags(publications)
      setRecipient("")
    } catch (err) {
      console.log('error getting publications by tags:', err)
    }
  }
/*  
  async function fetchPublicationsByTags(tags) {
    if (profiles.length === 0) return;
    try {
      let publicationsWithTags = []
      for (let i = 0; i < profiles.length; i++) {
        let response = await client.query({
          query: getPublicationsByTags,
          variables: {
            profileId: profiles[i].id,
            request: {
              tags: {
                all: ["metaverse"]
              }
            }
          }
        })
        if (response.length > 0) { 
          publicationsWithTags.push(response)
        }
      }
      
      console.log('publicationsWithTags:', publicationsWithTags)
      setPublicationsByTags(publicationsWithTags)
    } catch (err) {
      console.log('error getting publications by tags:', err)
    }
  }
*/

  function calculateFlowRate(amount) {
    if (Number(amount) === 0) {
      return 0
    }
    const amountInWei = ethers.BigNumber.from(amount)
    const monthlyAmount = ethers.utils.formatEther(amountInWei.toString())
    // @ts-ignore
    const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30
    return calculatedFlowRate
  }

  const handleRecipientChange = (e) => {
    setRecipient(() => ([e.target.name] = e.target.value))
  }

  const handleFlowRateChange = (e) => {
    setFlowRate(() => ([e.target.name] = e.target.value))
    let newFlowRateDisplay = calculateFlowRate(e.target.value)
    if (newFlowRateDisplay) {
      setFlowRateDisplay(newFlowRateDisplay.toString())
    }
  }

  const handleLensHandleChange = (e) => {
    setLensHandle(e.target.value)
  }
  
  const handleLensAddressChange = (e) => {
    setLensAddress(e.target.value)
  }
  
  const handleTagChange = (e) => {
    setTag(e.target.value)
  }
  
  const handleRemoveTag = (e) => {
    setTags(prevTags => prevTags.filter(t => t !== e.target.name))
  }
  
  const handleTagKeyPress = (e) => {
    if (e.key !== "Enter") return
    setTags(prevTags => [...prevTags, e.target.value])
    setTag("")
  }
  
  const handleCurrentTabChange = (e) => {
    setCurrentTab(e.target.value)
  }
  
  const handleCreateNewCampaign = async () => {
    await createNewCampaign(campaignId)
  }
  
  const handleCreateDealerCampaign = async () => {
    await createDealerCampaign()
  }
  
  const handleDistributeCampaign = async () => {
    await distributeCampaignFunds(campaignId, campaignFunds)
  }
  
  const handleDistributeDealerCampaign = async () => {
    await distributeDealerCampaignFunds(campaignId, campaignFunds)
  }
  
  const handleCampaignFundsChange = (e) => {
    setCampaignFunds(e.target.value)
  }
  
  const handleCampaignIdChange = (e) => {
    setCampaignId(e.target.value)
  }
  
  const onSfAgreementChange = (e) => {
    setSfAgreement(e.target.value)
  }
  
  useEffect(() => {
    fetchFollowersByHandle(lensHandle)
  }, [lensHandle])
  
  useEffect(() => {
    fetchFollowersByAddress(lensAddress)
  }, [lensAddress])
  
  useEffect(() => {
    fetchPublicationsByTags()
  }, [profiles])
/*  
  useEffect(() => {
    fetchPublicationsByTags(tags)
  }, [tags])
*/  


  return (
    <div className="p-12">
      <h2 className="text-4xl text-fuchsia-500">Lens Social Dealer</h2>
      {/*           wallet         */}
      { address === "" ? (
        <button  onClick={connectWallet}
          className="px-8 py-2 rounded-3xl bg-white text-black my-4"
        >
          Connect Wallet
        </button>
      ) : (
        <p className="mt-4 mb-2">
          Connected to: {`${address.substring(0, 6)}...${address.substring(38)}`}
        </p>
      )}
      {/*           lens         */}
      { address && !lensHandle && (
        <>
          <p className="mt-4 mb-2">Looks like your address is not associated with any Lens profile.
          </p>
          <p className="mt-2 mb-4">Do you want to create one? Use our app</p>
        </>  
      )}
      { lensHandle && (
        <>
          <p className="mt-2 mb-2">
            Lens address: {`${lensAddress.substring(0, 6)}...${lensAddress.substring(38)}`}
          </p>
          <p className="mt-2 mb-4">
            Lens handle: {lensHandle}
          </p>
        </>
      )}
      {/*           LSD form         */}
      <div className="flex flex-col max-w-[320px] items-center">
        { true && (
        <>
          <p className="mt-2 mb-4">See the dashboard as any Lens Profile:</p>
          <input
            value={lensAddress}
            placeholder="Enter a valid address"
            onChange={handleLensAddressChange}
            className='text-black py-2 px-4 mb-2 w-72 rounded-3xl'
          /> 
          <p className="mt-2 mb-4">
            - OR -
          </p>          
          <input
            value={lensHandle}
            placeholder="Enter a lens handle"
            onChange={handleLensHandleChange}
            className='text-black py-2 px-4 mb-2 w-72 rounded-3xl'
          />         
        </>
        )}
        
        <label htmlFor="sf-agreement" className="py-2 px-4 mb-2 mt-2">
          Choose a Superfluid agreement:
        </label>
        <select
          name="sf-agreement"
          id="sf-agreement"
          onChange={onSfAgreementChange}
          className="text-black py-2 px-4 mb-2 w-72 rounded-3xl"
        >
          <option value="cfa">CFA</option>
          <option value="ida">IDA</option>
          <option value="cfa-dealer">CFA (Dealer)</option>
          <option value="ida-dealer">IDA (Dealer)</option>
        </select>
 
        { currentTab === "followers" && (
          <input
            value={recipient}
            placeholder="Enter recipient address"
            onChange={handleRecipientChange}
            className='text-black py-2 px-4 mb-2 w-72 rounded-3xl'
          /> 
        )}
       
        { (sfAgreement === "cfa" || sfAgreement === "cfa-dealer") && (
          <input
            value={flowRate}
            onChange={handleFlowRateChange}
            placeholder="Enter a flowRate in wei/second"
            className='text-black py-2 px-4 mb-2 mt-2 w-72 rounded-3xl'
          />
        )}
        
        { (sfAgreement === "cfa" || sfAgreement === "cfa-dealer")  && (
          <div className="border-green-400 border rounded-3xl px-2 py-1 mx-auto">
            <p>
              <b>~ ${flowRateDisplay !== "" ? flowRateDisplay : 0}</b> in fDAIx/month
            </p>
          </div>
        )}
        
        { (sfAgreement === "ida" || sfAgreement === "ida-dealer") && (
          <input
            value={campaignId}
            type="number"
            onChange={handleCampaignIdChange}
            placeholder="Enter campaign ID"
            className='text-black py-2 px-4 mb-2 mt-2 w-72 rounded-3xl'
          />
        )}

        <button
          className="px-8 py-2 rounded-3xl bg-green-400 text-black mt-2 w-72"
          onClick={ () => callingTheDealer(recipient ? [recipient] : publicationsWithTags, tags, flowRate, sfAgreement, campaignId) }
        >
          Call Dealer
        </button>
        <a className="mt-4 text-green-400" href="https://app.superfluid.finance/" target="_blank" rel='no-opener'>View Superfluid Dashboard</a>
      </div>
      {/*           tabs         */}
      <div>
        <button
          className="px-6 mt-6"
          value={"followers"}
          onClick={handleCurrentTabChange}
        >
          All Followers
        </button>
        <button
          className="px-6 mt-6"
          value={"tags"}
          onClick={handleCurrentTabChange}
        >
          Search Tags
        </button>
        <button
          className="px-6 mt-6"
          value={"campaign"}
          onClick={handleCurrentTabChange}
        >
          Campaigns
        </button>  
      </div>
      {/*           followers         */}
      {
        currentTab === "followers" && profiles.map(profile => (
          <div key={profile.handle} className="
            p-3 border-white border rounded-3xl mt-4 border-slate-400 max-w-sm flex flex-row gap-6 items-center
          "
          >
            {
              profile.picture?.original?.url && (
                <img
                  className="w-32 rounded-2xl"
                  src={getGateway(profile.picture?.original?.url)}
                />
              )
            }
            {
              profile.picture?.url && (
                <img
                  className="w-32 rounded-2xl"
                  src={getGateway(profile.picture.url)}
                />
              )
            }
            {
              profile.picture?.uri && (
                <img
                  className="w-32 rounded-2xl"
                  src={getGateway(profile.picture.uri)}
                />
              )
            }
            <div>
              <p className="mt-2 text-xl text-fuchsia-400">@{profile.handle}</p>
              <p>{profile.name}</p>
              <button
                className="px-8 py-2 rounded-3xl bg-green-400 text-black mt-4 mx-2 w-66"
                value={"tags"}
                onClick={() => setRecipient(profile.address)}
              >
                Send Flow
              </button>
            </div>
          </div>
        ))
      }
      {/*           tags         */}
      { currentTab === "tags" && (
        <>
          <input
            value={tag}
            onChange={handleTagChange}
            placeholder="Enter a tag to filter publications"
            className='text-black py-2 px-4 mt-8 mb-2 w-72 rounded-3xl'
            data-te-chips-init
            data-te-editable="true"
            onKeyDown={handleTagKeyPress}
          />
          
          <div className="flex flex-row mx-2">
          { tags.length > 0 && tags.map((t) => (
            <div key={t} className="flex flex-row items-center text-black bg-green-400 max-w-fit mt-4 mb-2 mx-2 px-4 py-2 rounded-3xl">
              <p>{t}</p>
              <img
                className="w-5 h-5 ml-2 cursor-pointer"
                src="remove.svg"
                alt="remove"
                name={t}
                onClick={handleRemoveTag}
              />             
            </div>  
          ))}
          </div>
        </>
      )}      
      {/*           publications         */}
      {
        currentTab === "tags" && publicationsWithTags.map(publication => {
          return tags.map(t => {
            if (publication.metadata.tags.includes(t)) {
              
              return (
                <div key={publication.id} className="
                  p-3 border-white border rounded-2xl mt-4 border-slate-400 max-w-full flex flex-row gap-6 items-center
                "
                //onClick={(e) => setRecipient(publication.address)}
                >
                  {
                    publication.profile?.picture?.original?.url && (
                      <img
                        className="w-32 rounded-2xl"
                        src={getGateway(publication.profile?.picture?.original?.url)}
                      />
                    )
                  }
                  {
                    publication.profile?.picture?.url && (
                      <img
                        className="w-32 rounded-2xl"
                        src={getGateway(publication.profile?.picture.url)}
                      />
                    )
                  }
                  {
                    publication.profile?.picture?.uri && (
                      <img
                        className="w-32 rounded-2xl"
                        src={getGateway(publication.profile?.picture.uri)}
                      />
                    )
                  }
                  <div>
                    <p className="mt-2 text-xl text-fuchsia-300">@{publication.profile?.handle}</p>
                    <p>{publication.profile?.name}</p>
                    <p className="mt-2 text-xl text-fuchsia-400">{publication.metadata?.content}</p>
                  </div>
                </div>
              )
            }
          })
        })
      }
      {/*           tags + publications         */}
      {
        currentTab === "tags" && tags.length === 0 && publicationsWithTags.map(publication => (
                <div key={publication.id+publication.__typename} className="
                  p-3 border-white border rounded-2xl mt-4 border-slate-400 max-w-full flex flex-row gap-6 items-center
                "
                //onClick={(e) => setRecipient(publication.address)}
                >
                  {
                    publication.profile?.picture?.original?.url && (
                      <img
                        className="w-32 rounded-2xl"
                        src={getGateway(publication.profile?.picture?.original?.url)}
                      />
                    )
                  }
                  {
                    publication.profile?.picture?.url && (
                      <img
                        className="w-32 rounded-2xl"
                        src={getGateway(publication.profile?.picture.url)}
                      />
                    )
                  }
                  {
                    publication.profile?.picture?.uri && (
                      <img
                        className="w-32 rounded-2xl"
                        src={getGateway(publication.profile?.picture.uri)}
                      />
                    )
                  }
                  <div>
                    <p className="mt-2 text-xl text-fuchsia-300">@{publication.profile?.handle}</p>
                    <p>{publication.profile?.name}</p>
                    <p className="mt-2 text-xl text-fuchsia-400">{publication.metadata?.content}</p>
                  </div>
                </div>
              )
           )
        }
        {/*           campaigns         */}
        {
          currentTab === "campaign" && (
            <div className="flex flex-col max-w-[320px] items-center mt-8">
              <h3 className="mb-3 text-lg"><b>Start Campaign</b></h3>
              <p>Campaign ID:</p>
              <input
                value={campaignId}
                type="number"
                placeholder="Enter campaignId"
                onChange={handleCampaignIdChange}
                className='text-black py-2 px-4 mb-2 mt-2 w-72 rounded-3xl'
              />              
              <button
                className="px-8 py-2 rounded-3xl bg-green-400 text-black mt-2 w-72"
                onClick={handleCreateNewCampaign}
              >
                Start Campaign
              </button>  
              <p className="mt-4 mb-4">
                - OR -
              </p>             
              <button
                className="px-8 py-2 rounded-3xl bg-fuchsia-400 text-black mb-8 w-72"
                onClick={handleCreateDealerCampaign}
              >
                Start Dealer Campaign
              </button>
              
              
              <h3 className="mt-3 mb-3 text-lg"><b>Distribute Campaign Funds</b></h3>
              <p>Campaign ID:</p>
              <input
                value={campaignId}
                type="number"
                placeholder="Enter campaignId"
                onChange={handleCampaignIdChange}
                className='text-black py-2 px-4 mb-2 w-72 rounded-3xl mt-2'
              />
              <p>Amount to be distributed:</p>
              <input
                value={campaignFunds}
                type="number"
                placeholder="Enter amount to distribute"
                onChange={handleCampaignFundsChange}
                className='text-black py-2 px-4 mb-2 w-72 rounded-3xl mt-2'
              />
              <button
                className="px-8 py-2 rounded-3xl bg-green-400 text-black mt-2 w-72"
                onClick={handleDistributeCampaign}
              >
                Distribute
              </button>  
              <p className="mt-4 mb-4">
                - OR -
              </p>             
              <button
                className="px-8 py-2 rounded-3xl bg-fuchsia-400 text-black mb-4 w-72"
                onClick={handleDistributeDealerCampaign}
              >
                Distribute (Dealer)
              </button>            
            </div>
          )
        }
    </div>
  )
}
/// ipfs gateway helper to deal with PFPs
function getGateway(hashOrUri) {
  if (hashOrUri.includes('https')) {
    return hashOrUri
  }
  if (hashOrUri.includes('ipfs://')) {
    console.log("ipfs: ", hashOrUri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
    return hashOrUri.replace('ipfs://', 'https://ipfs.io/ipfs/')
  }
  if (hashoruri.includes('ar://')) {
    console.log('ar: ', hashOrUri.replace('ar://', 'https://arweave.net/'))
    return hashOrUri.replace('ar://', 'https://arweave.net/')
  }
} 
/// a helper function to print logs from the blockchain
function logTx(txHash) {
  console.log(`Congrats - transaction mined with hash ${txHash}`)
  console.log(`See in the explorer: https://mumbai.polygonscan.com/tx/${txHash}`)
}
