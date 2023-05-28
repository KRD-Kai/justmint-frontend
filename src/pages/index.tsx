import { useAccount } from "../hooks/useAccount";
import { Button } from "@mantine/core";

function Index() {
	const { smartAccount, loading, login, logout } = useAccount();

	return (
		<>
			{!smartAccount && !loading && (
				<Button onClick={login}>Login</Button>
			)}
			{loading && <p>Loading account details...</p>}
			{!!smartAccount && (
				<div>
					<h3>Smart account address:</h3>
					<p>{smartAccount.address}</p>
					<Button onClick={logout}>Logout</Button>
				</div>
			)}
		</>
	);
}

export default Index;
