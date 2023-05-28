import React, { createContext, useContext } from "react";
import { useAccount } from "./useAccount";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
	const account = useAccount();

	return (
		<AccountContext.Provider value={account}>
			{children}
		</AccountContext.Provider>
	);
}

export function useAccountContext() {
	const context = useContext(AccountContext);
	if (!context) {
		throw new Error(
			"useAccountContext must be used within an AccountProvider"
		);
	}
	return context;
}
