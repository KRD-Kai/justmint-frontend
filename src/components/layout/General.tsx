import React from "react";
import Navbar from "./Navbar";
import { AppShell, Header } from "@mantine/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface LayoutProps {
	children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
	return (
		<>
			<AppShell
				padding="md"
				navbar={<Navbar />}
				header={<></>}
				styles={(theme) => ({
					main: {
						backgroundColor:
							theme.colorScheme === "dark"
								? theme.colors.dark[8]
								: theme.colors.gray[0],
					},
				})}
			>
				<main>{children}</main>
			</AppShell>
			<ToastContainer />
		</>
	);
};

export default Layout;
