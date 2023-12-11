// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.4.22 <0.8.23;

contract Crowd_Funding {
    mapping(address => uint256) public ContributersBalance;

    struct Campaign {
        string campaignName;
        address payable creatorsAddress;
        uint256 goalAmount;
        uint256 currentAmount;
        bool hasReachedGoal;
    }

    mapping(uint256 => Campaign) public Campaigns;
    uint256 public campaignCounter;

    function campaignCreator(
        string memory campaignName,
        address payable creatorAddress,
        uint256 goalAmount
    ) public {
        Campaign memory campaign = Campaign(
            campaignName,
            creatorAddress,
            goalAmount,
            0,
            false
        );
        Campaigns[campaignCounter++] = campaign;
    }

    function showCampaigns(uint256 campaignIndex)
        public
        view
        returns (
            string memory,
            address,
            uint256,
            uint256,
            bool
        )
    {
        Campaign storage campaign = Campaigns[campaignIndex];
        return (
            campaign.campaignName,
            campaign.creatorsAddress,
            campaign.goalAmount,
            campaign.currentAmount,
            campaign.hasReachedGoal
        );
    }

    event CampaignGoalReached(uint256 indexed campaignIndex);

    function contribute(uint256 campaignIndex) public payable {
        require(
            !Campaigns[campaignIndex].hasReachedGoal,
            "Campaign has already reached its goal"
        );

        Campaigns[campaignIndex].currentAmount += msg.value;
        ContributersBalance[msg.sender] += msg.value;

        // Transfer the contributed funds to the campaign creator
        Campaigns[campaignIndex].creatorsAddress.transfer(msg.value);

        if (
            Campaigns[campaignIndex].currentAmount >=
            Campaigns[campaignIndex].goalAmount
        ) {
            Campaigns[campaignIndex].hasReachedGoal = true;
            emit CampaignGoalReached(campaignIndex);
        }
    }
}
