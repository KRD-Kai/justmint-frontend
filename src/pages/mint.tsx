import { ethers } from "ethers";
import { NFT_CONTRACT_ADDR } from "../constants";
import { useAccount } from "../hooks/useAccount";
import { Button } from "@mantine/core";
import { useAccountContext } from "../hooks/accountProvider";
import { toast } from "react-toastify";
import { useState } from "react";

export default function Mint() {
	const { smartAccount, loading, login, logout } = useAccountContext();
	const [initiated, setInitiated] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const [hash, setHash] = useState<string>("");

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
		setInitiated(true);
		const txResponse = await smartAccount.sendTransaction({
			transaction: transaction,
		});
		console.log("userOp hash", txResponse.hash);
		// If you do not subscribe to listener, one can also get the receipt like shown below
		const txReciept = await txResponse.wait();
		console.log("Tx hash", txReciept.transactionHash);
		setInitiated(false);
		setSuccess(true);
		setHash(txReciept.transactionHash);
		toast.success(`Success!: ${txReciept.transactionHash}`);
	}

	return (
		<div className="text-center mt-32">
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
				loading={initiated}
			>
				Magic mint 🪄
			</Button>

			{success && !initiated && (
				<p>
					NFT minteeed! Tx hash: <b>{hash}</b>
				</p>
			)}
		</div>
	);
}
