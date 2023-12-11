import "./style.css";
import Web3 from 'web3';
import CrowdFundingContract from './abis/Crowd_Funding.json';

// Reference to the container element
const campaignsContainer = document.getElementById('campaigns-container');
const header = document.getElementById('header');
const createCampaign = document.getElementById('create-campaign');
const closeOverlayButton = document.getElementById('close-overlay');
const createCampaignOverlay = document.getElementById('create-campaign-overlay');
// overlay
const campaignsNameField = document.getElementById('campaigns-name-field');
const creatorsAddressField = document.getElementById('creators-address-field');
const goalAmountField = document.getElementById('goal-amount');

const createCampaignButton = document.getElementById('create-campaign-button');
const loadingOverlay = document.getElementById('loading-overlay');

// Ensure that window.ethereum is available
if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    // Request account access if needed
    window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
            // Your contract address
            const contractAddress = '0x86cF9D087C366375D80116694a692aB34Edd70C0';

            // Your contract instance
            const crowdFundingContract = new web3.eth.Contract(
                CrowdFundingContract.abi,
                contractAddress
            );

            // Example: Get the current campaign count
            crowdFundingContract.methods.campaignCounter().call()
                .then((campaignCounter) => {
                    // Iterate over campaigns
                    for (let i = 0; i < campaignCounter; i++) {
                        // Example: Get details of each campaign
                        crowdFundingContract.methods.Campaigns(i).call()
                            .then((campaign) => {
                                // Create a div for each campaign
                                const campaignDiv = document.createElement('div');
                                campaignDiv.classList.add("flex", "flex-col", "items-center", "justify-center", "space-y-2", "max-w-sm", "p-3", "bg-white", "border",
                                    "border-gray-200", "rounded-lg", "shadow", "dark:bg-gray-800", "dark:border-gray-700", "dark:text-gray-100")

                                // Populate the div with campaign details
                                if (campaign.goalAmount === campaign.currentAmount) {
                                    campaignDiv.classList.add("hidden");
                                } else {
                                    campaignDiv.innerHTML = `
                                <p class="text-xl"><span class="text-green-500">${campaign.campaignName}</span></p>
                                <p>Creator: ${truncateAddress(campaign.creatorsAddress)}</p>
                                <p>Goal Amount: ${campaign.goalAmount}</p>
                                    <p>Current Amount: ${campaign.currentAmount}</p>
                                    <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                                    <div class="relative">
                                        <div class="absolute inset-y-0 start-0 flex items-center  pointer-events-none">
                                        <div>
                                            <svg xmlns="http://www.w3.org/2000/svg" aria-label="Ethereum" role="img" viewBox="0 0 512 512" width="40px" height="40px" fill="#000000">
                                            <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="17.408"/>
                                            <g id="SVGRepo_iconCarrier">
                                                <rect width="512" height="512" rx="15%" fill="#ffffff" fill-opacity="0"/>                                                
                                                <path fill="#3C3C3B" d="m256 362v107l131-185z"/>                                                
                                                <path fill="#343434" d="m256 41l131 218-131 78-132-78"/>                                                
                                                <path fill="#8C8C8C" d="m256 41v158l-132 60m0 25l132 78v107"/>                                                
                                                <path fill="#141414" d="m256 199v138l131-78"/>
                                                <path fill="#393939" d="m124 259l132-60v138"/>
                                            </g>
                                            </svg>
                                        </div>
                                        </div>
                                        <input type="number" id="contributeAmount-${i}" class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="enter amount in Wei" required>
                                        <button type="submit" id="btn-${i}" class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Donate</button>
                                        </div>
                                `;
                                    // Append the div to the container
                                    campaignsContainer.appendChild(campaignDiv);
                                    document.getElementById(`btn-${i}`).addEventListener('click', function () {
                                        contribute(i);
                                    });
                                }
                            })
                            .catch((error) => {
                                console.error('Error fetching campaign details:', error);
                            });
                    }
                })
                .catch((error) => {
                    console.error('Error fetching campaign count:', error);
                });

            // Contribute function to be called when the contribute button is clicked
            function contribute(campaignIndex) {
                const contributeAmount = document.getElementById(`contributeAmount-${campaignIndex}`).value;
                // Ensure contributeAmount is a positive number before proceeding
                if (contributeAmount > 0) {
                    // Call your contribute function with the campaignIndex and contributeAmount
                    crowdFundingContract.methods.contribute(campaignIndex).send({ from: accounts[0], value: contributeAmount })
                        .then((result) => {
                            console.log('Contribution successful:', result);
                            location.reload();

                        })
                        .catch((error) => {
                            console.error('Error contributing to campaign:', error);
                        });
                } else {
                    console.error('Invalid contribution amount');
                }
            }

            createCampaign.addEventListener('click', () => {

                createCampaignOverlay.classList.remove("hidden");
                header.classList.add("blur-filter");
                campaignsContainer.classList.add("blur-filter");

            })
            createCampaignButton.addEventListener('click', async () => {
                const campaignName = campaignsNameField.value;
                const creatorAddress = creatorsAddressField.value;
                const goalAmount = goalAmountField.value;

                // Show loading overlay
                loadingOverlay.classList.remove('hidden');
                console.log("Hey");

                try {
                    loadingOverlay.classList.remove('hidden');
                    // Call the campaignCreator function
                    const result = await crowdFundingContract.methods
                        .campaignCreator(campaignName, creatorAddress, goalAmount)
                        .send({ from: creatorAddress });

                    console.log('Transaction successful:', result);

                    // Hide loading overlay after the transaction is confirmed
                    loadingOverlay.classList.add('hidden');
                    header.classList.remove("blur-filter");
                    campaignsContainer.classList.remove("blur-filter");
                    createCampaignOverlay.classList.add("hidden");
                    location.reload();
                } catch (error) {
                    console.error('Error creating campaign:', error);
                    // Hide loading overlay on error
                    loadingOverlay.classList.add('hidden');
                }
            });

            closeOverlayButton.addEventListener('click', () => {
                header.classList.remove("blur-filter");
                campaignsContainer.classList.remove("blur-filter");
                createCampaignOverlay.classList.add("hidden");

            })
        })
        .catch((error) => {
            console.error('MetaMask account access denied:', error);
        });
} else {
    console.error('MetaMask not found. Please install MetaMask extension.');
}

function truncateAddress(address) {
    const prefixLength = 4; // Number of characters to display at the beginning
    const suffixLength = 3; // Number of characters to display at the end
    return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

