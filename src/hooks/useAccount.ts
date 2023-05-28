import { useState, useEffect, useRef } from "react";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import SmartAccount from "@biconomy/smart-account";
import type SocialLogin from "@biconomy/web3-auth";

export function useAccount() {
	const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
	const [interval, enableInterval] = useState(false);
	const sdkRef = useRef<SocialLogin | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const isClient = typeof window !== "undefined";

	useEffect(() => {
		async function checkProvider() {
			if (!isClient) return;
			console.log(typeof window);
			let configureLogin;
			if (interval) {
				configureLogin = setInterval(() => {
					if (!!sdkRef.current?.provider) {
						setupSmartAccount();
						clearInterval(configureLogin);
					}
				}, 1000);
			}
			return () => clearInterval(configureLogin);
		}
		checkProvider();
	}, [interval, isClient]);

	async function login() {
		if (!sdkRef.current) {
			const SocialLogin = (await import("@biconomy/web3-auth")).default;
			const socialLoginSDK = new SocialLogin();
			const signature1 = await socialLoginSDK.whitelistUrl("myurl");
			await socialLoginSDK.init({
				chainId: ethers.utils.hexValue(ChainId.POLYGON_MAINNET),
				whitelistUrls: {
					myurl: signature1,
				},
			});
			sdkRef.current = socialLoginSDK;
		}
		if (!sdkRef.current.provider) {
			// sdkRef.current.showConnectModal()
			sdkRef.current.showWallet();
			enableInterval(true);
		} else {
			setupSmartAccount();
		}
	}

	async function setupSmartAccount() {
		if (!sdkRef?.current?.provider) return;
		sdkRef.current.hideWallet();
		setLoading(true);
		const web3Provider = new ethers.providers.Web3Provider(
			sdkRef.current.provider
		);
		try {
			const smartAccount = new SmartAccount(web3Provider, {
				activeNetworkId: ChainId.POLYGON_MAINNET,
				supportedNetworksIds: [ChainId.POLYGON_MAINNET],
			});
			await smartAccount.init();
			setSmartAccount(smartAccount);
			setLoading(false);
		} catch (err) {
			console.log("error setting up smart account... ", err);
		}
	}

	const logout = async () => {
		if (!sdkRef.current) {
			console.error("Web3Modal not initialized.");
			return;
		}
		await sdkRef.current.logout();
		sdkRef.current.hideWallet();
		setSmartAccount(null);
		enableInterval(false);
	};

	return {
		smartAccount,
		loading,
		login,
		logout,
	};
}
