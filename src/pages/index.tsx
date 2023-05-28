import { useAccount } from "../hooks/useAccount";

function Index() {
	const { smartAccount, loading, login, logout } = useAccount();

	return (
		<>
			{!smartAccount && !loading && (
				<button onClick={login}>Login</button>
			)}
			{loading && <p>Loading account details...</p>}
			{!!smartAccount && (
				<div>
					<h3>Smart account address:</h3>
					<p>{smartAccount.address}</p>
					<button onClick={logout}>Logout</button>
				</div>
			)}
		</>
	);
}

export default Index;
