import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import "@biconomy/web3-auth/dist/src/style.css";
import Layout from "../components/layout/General";
import { AccountProvider } from "../hooks/accountProvider";
// import { Inter } from "@next/font/google";
// const inter = Inter({ subsets: ["latin"] });

export default function App(props: AppProps) {
	const { Component, pageProps } = props;

	return (
		<>
			<Head>
				<title>EscrowDao</title>
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width"
				/>
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					/** Put your mantine theme override here */
					colorScheme: "light",
				}}
			>
				<AccountProvider>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</AccountProvider>
			</MantineProvider>
		</>
	);
}
