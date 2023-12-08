import "./style.css";
import Web3 from 'web3';
import CrowdFundingContract from './abis/Crowd_Funding.json';

// Ensure that window.ethereum is available
if (window.ethereum) {
    const web3 = new Web3(window.ethereum);

    // Request account access if needed
    window.ethereum
        .request({ method: 'eth_requestAccounts' })
        .then(() => {
            // Your contract address
            const contractAddress = '0x398FA211D68FDC4443E480857C5276bff2FA874D';

            // Your contract instance
            const crowdFundingContract = new web3.eth.Contract(
                CrowdFundingContract.abi,
                contractAddress
            );
            console.log(crowdFundingContract);

            // Example: Get the current amount for a campaign
            crowdFundingContract.methods.showCampaigns(0).call()
                .then((result) => {
                    console.log('The First Campaign', result);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        })
        .catch((error) => {
            console.error('MetaMask account access denied:', error);
        });
} else {
    console.error('MetaMask not found. Please install MetaMask extension.');
}

