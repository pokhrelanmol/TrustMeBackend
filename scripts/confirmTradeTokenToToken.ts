import {parseEther} from 'ethers/lib/utils';
import {deployments, ethers} from 'hardhat';
import {BuyerToken, SellerNFT, SellerToken, TrustMe} from '../typechain';

const signer = process.env.BUYER_PRIVATE_KEY;
const trustMeaddress = process.env.TRUSTME_ADDRESS;
const provider = new ethers.providers.InfuraProvider('goerli', process.env.INFURA_API_KEY_GOERLI);
const buyerTokenAddress = process.env.BUYER_TOKEN_ADDRESS;
const confirmTrade = async () => {
	const wallet = new ethers.Wallet(signer as string, provider);
	const trustMe: TrustMe = await ethers.getContractAt('TrustMe', trustMeaddress as string);
	const buyerToken: BuyerToken = await ethers.getContractAt('BuyerToken', buyerTokenAddress as string);

	console.log('================================Confirming Trade================================');

	const approveTx = await buyerToken.connect(wallet).approve(trustMeaddress as string, parseEther('10'));
	await approveTx.wait();
	console.log('================================Approved================================');
	const tx = await trustMe.connect(wallet).confirmTrade(5);
	console.log('Confirmed waiting for block confirmation...');
	const receipt = await tx.wait();
	console.log('================================Trade Confirmed================================');
};
confirmTrade()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
