// SPDX-License-Identifier: MIT
pragma solidity ^0.8.14;

import {ISuperfluid, ISuperToken } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBase.sol";
import {IInstantDistributionAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IInstantDistributionAgreementV1.sol";

import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";

contract Dealer {
    /// @notice Super token to be distributed.
    ISuperToken public token;

    /// @notice SuperToken Library
    using SuperTokenV1Library for ISuperToken;
/*
    /// @notice Index ID. Never changes. 
    uint32 public constant INDEX_ID = 0;
*/    
    /// @notice CampaignID. The IDA Index of the current campaign.
    uint32 public INDEX_ID = 0;
    
    /// @notice noly
    address private owner;

    constructor(ISuperToken _token) {
        owner = msg.sender;
        token = _token;

         // Creates a new campaign (IDA Index through which tokens will be distributed)
        _token.createIndex(INDEX_ID);
    }
    
    /// @notice Starts a new campaign, only the owner is able to call this function
    /// previous campaigns remains active. This does not cancel them.
    function newCampaign() public {
        require(msg.sender == owner, "Forbidden");
        INDEX_ID++; // campaignId
        // Creates a new campaign (IDA Index through which tokens will be distributed)
        token.createIndex(INDEX_ID);
    }
    
    // ---------------------------------------------------------------------------------------------
    // CFA OPERATIONS (the Dealer needs to be funded before call these functions)
    function createFlow(address receiver, int96 flowRate) public {
        require(msg.sender == owner, "Forbidden");
        token.createFlow(receiver, flowRate);
    }

    function createFlowBatch(address[] calldata receivers, int96 flowRate) public {
        for (uint i = 0; i < receivers.length; i++) {
            createFlow(receivers[i], flowRate);
        }
    }    

    // ---------------------------------------------------------------------------------------------
    // IDA OPERATIONS

    /// @notice Takes the entire balance of the designated token in the contract and distributes it out to unit holders w/ IDA
    function distribute(uint32 campaignId, uint256 amount) public {
        require(msg.sender == owner, "Forbidden");
        require(campaignId <= INDEX_ID, "InvalidCampaign");
        
        token.transferFrom(msg.sender, address(this), amount);
        
        uint256 tokenBalance = token.balanceOf(address(this));

        (uint256 actualDistributionAmount, ) = token.calculateDistribution(
            address(this),
            campaignId, // INDEX_ID
            tokenBalance
        );

        token.distribute(campaignId, actualDistributionAmount);
    }

    /// @notice lets multiple accounts gain a single distribution unit
    /// @param subscribers subscribers addresses whose units are to be incremented     
    function gainShareBatch(address[] calldata subscribers, uint32 campaignId) public {
        for (uint i = 0; i < subscribers.length; i++) {
            gainShare(subscribers[i], campaignId);
        }
    }

    /// @notice lets an account gain a single distribution unit
    /// @param subscriber subscriber address whose units are to be incremented
    function gainShare(address subscriber, uint32 campaignId) public {
        require(msg.sender == owner, "Forbidden");
        require(campaignId <= INDEX_ID, "InvalidCampaign");
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = token.getSubscription(
            address(this),
            campaignId, //INDEX_ID,
            subscriber
        );

        // Update to current amount + 1
        token.updateSubscriptionUnits(
            campaignId, //INDEX_ID,
            subscriber,
            uint128(currentUnitsHeld + 1)
        );
    }

    /// @notice lets multiple accounts gain a single distribution unit with a limit
    /// @param subscribers subscribers addresses whose units are to be incremented    
    function gainShareWithLimitBatch(address[] calldata subscribers, uint32 campaignId, uint256 limit) public {
        for (uint i = 0; i < subscribers.length; i++) {
            gainShareWithLimit(subscribers[i], campaignId, limit);
        }
    }
    
    /// @notice lets an account gain a single distribution unit with a limit
    /// @param subscriber subscriber address whose units are to be incremented
    function gainShareWithLimit(address subscriber, uint32 campaignId, uint256 limit) public {
        require(msg.sender == owner, "Forbidden");
        require(campaignId <= INDEX_ID, "InvalidCampaign");
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = token.getSubscription(
            address(this),
            campaignId, //INDEX_ID,
            subscriber
        );
        if (limit > currentUnitsHeld) {
            // Update to current amount + 1
            token.updateSubscriptionUnits(
                campaignId, //INDEX_ID,
                subscriber,
                uint128(currentUnitsHeld + 1)
            );            
          }
    }
/*  the utility of this function is lower than the risk, imo.

    /// @notice lets an account lose a single distribution unit
    function loseShare(uint32 campaignId) public {
        require(msg.sender == owner, "Forbidden");
        require(campaignId <= INDEX_ID, "InvalidCampaign");
        // Get current units subscriber holds
        (, , uint256 currentUnitsHeld, ) = token.getSubscription(
            address(this),
            campaignId, //INDEX_ID,
            msg.sender // only the sender is able to decrease their shares
        );

        // Update to current amount - 1 (reverts if currentUnitsHeld - 1 < 0, so basically if currentUnitsHeld = 0)
        token.updateSubscriptionUnits(
            campaignId, //INDEX_ID,
            msg.sender,
            uint128(currentUnitsHeld - 1)
        );
    }
*/
    /// @notice allows an account owner to delete its entire subscription to this contract
    function deleteShares(uint32 campaignId) public {
        require(campaignId <= INDEX_ID, "InvalidCampaign");
        token.deleteSubscription(address(this), campaignId, msg.sender);
    }
}
