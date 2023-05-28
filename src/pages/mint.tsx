import { ethers } from "ethers";
import { NFT_CONTRACT_ADDR } from "../constants";
import { useAccount } from "../hooks/useAccount";
import { Button } from "@mantine/core";
import { useAccountContext } from "../hooks/accountProvider";
import { toast } from "react-toastify";

export default function Mint() {
	const { smartAccount, loading, login, logout } = useAccountContext();

	if (!smartAccount) return <h1>Please log in</h1>;

	console.log(smartAccount.address);

	const nftInterface = new ethers.utils.Interface([
		"function mint(address _to)",
	]);
	const encodedData = nftInterface.encodeFunctionData("mint", [
		smartAccount.address,
	]);

	const tx = {
		to: NFT_CONTRACT_ADDR, // destination smart contract address
		data: encodedData,
	};

	smartAccount.on("txHashGenerated", (response: any) => {
		console.log("txHashGenerated event received via emitter", response);
	});
	smartAccount.on("onHashChanged", (response: any) => {
		console.log("onHashChanged event received via emitter", response);
	});
	// Event listener that gets triggered once a transaction is mined
	smartAccount.on("txMined", (response: any) => {
		console.log("txMined event received via emitter", response);
	});
	// Event listener that gets triggered on any error
	smartAccount.on("error", (response: any) => {
		console.log("error event received via emitter", response);
	});

	async function sendTx(transaction) {
		if (!smartAccount) return;
		toast.info("Transaction initiated");
		const txResponse = await smartAccount.sendTransaction({
			transaction: transaction,
		});
		console.log("userOp hash", txResponse.hash);
		// If you do not subscribe to listener, one can also get the receipt like shown below
		const txReciept = await txResponse.wait();
		console.log("Tx hash", txReciept.transactionHash);
		toast.success(`Success!: ${txReciept.transactionHash}`);
	}

	return (
		<div className="text-center">
			<h1>Mint</h1>
			<p>
				The button below will mint your very own NFT as part of the DEMO
				collection! Gas on the house ;)
			</p>
			<Button
				onClick={() => sendTx(tx)}
				variant="gradient"
				gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
				size="lg"
			>
				Magic mint 🪄
			</Button>
		</div>
	);
}
