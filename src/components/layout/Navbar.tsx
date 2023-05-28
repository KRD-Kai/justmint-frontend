import { useState } from "react";
import {
	createStyles,
	Navbar,
	Group,
	Code,
	getStylesRef,
	rem,
	Button,
} from "@mantine/core";
import {
	IconFingerprint,
	IconKey,
	IconSettings,
	Icon2fa,
	IconDatabaseImport,
	IconReceipt2,
	IconSearch,
	IconSwitchHorizontal,
	IconLogout,
	IconZoomMoney,
	IconAlertOctagon,
	IconPlus,
} from "@tabler/icons-react";
import { useAccount } from "../../hooks/useAccount";
import { truncateHash } from "../../utils";
import Link from "next/link";

const useStyles = createStyles((theme) => ({
	header: {
		paddingBottom: theme.spacing.md,
		marginBottom: `calc(${theme.spacing.md} * 1.5)`,
		borderBottom: `${rem(1)} solid ${
			theme.colorScheme === "dark"
				? theme.colors.dark[4]
				: theme.colors.gray[2]
		}`,
	},

	footer: {
		paddingTop: theme.spacing.md,
		marginTop: theme.spacing.md,
		borderTop: `${rem(1)} solid ${
			theme.colorScheme === "dark"
				? theme.colors.dark[4]
				: theme.colors.gray[2]
		}`,
	},

	link: {
		...theme.fn.focusStyles(),
		display: "flex",
		alignItems: "center",
		textDecoration: "none",
		fontSize: theme.fontSizes.sm,
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[1]
				: theme.colors.gray[7],
		padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
		borderRadius: theme.radius.sm,
		fontWeight: 500,

		"&:hover": {
			backgroundColor:
				theme.colorScheme === "dark"
					? theme.colors.dark[6]
					: theme.colors.gray[0],
			color: theme.colorScheme === "dark" ? theme.white : theme.black,

			[`& .${getStylesRef("icon")}`]: {
				color: theme.colorScheme === "dark" ? theme.white : theme.black,
			},
		},
	},

	linkIcon: {
		ref: getStylesRef("icon"),
		color:
			theme.colorScheme === "dark"
				? theme.colors.dark[2]
				: theme.colors.gray[6],
		marginRight: theme.spacing.sm,
	},

	linkActive: {
		"&, &:hover": {
			backgroundColor: theme.fn.variant({
				variant: "light",
				color: theme.primaryColor,
			}).background,
			color: theme.fn.variant({
				variant: "light",
				color: theme.primaryColor,
			}).color,
			[`& .${getStylesRef("icon")}`]: {
				color: theme.fn.variant({
					variant: "light",
					color: theme.primaryColor,
				}).color,
			},
		},
	},
}));

const data = [
	{ link: "", label: "Explore", icon: IconZoomMoney },
	{ link: "", label: "Disputes", icon: IconAlertOctagon },
	{ link: "mint", label: "Mint", icon: IconPlus },
	{ link: "", label: "Settings", icon: IconSettings },
];

export default function NavbarSimple() {
	const { smartAccount, loading, login, logout } = useAccount();

	const { classes, cx } = useStyles();
	const [active, setActive] = useState("Billing");

	const links = data.map((item) => (
		<Link key={item.label} href={item.link} legacyBehavior>
			<a
				className={cx(classes.link, {
					[classes.linkActive]: item.label === active,
				})}
				key={item.label}
				onClick={(event) => {
					setActive(item.label);
				}}
			>
				<item.icon className={classes.linkIcon} stroke={1.5} />
				<span>{item.label}</span>
			</a>
		</Link>
	));

	return (
		<Navbar height="100vh" width={{ sm: 300 }} p="md">
			<Navbar.Section grow>
				<Group className={classes.header} position="apart">
					{!smartAccount && !loading && (
						<Button fullWidth onClick={login}>
							Login
						</Button>
					)}
					{loading && <p>Loading account details...</p>}
					{!!smartAccount && (
						<div>
							<h3>Smart account address:</h3>
							<p>{truncateHash(smartAccount.address, 8, 8)}</p>
						</div>
					)}
				</Group>
				<div></div>
				{links}
			</Navbar.Section>
			{smartAccount && (
				<Navbar.Section className={classes.footer}>
					<a
						href="#"
						className={classes.link}
						onClick={(event) => event.preventDefault()}
					>
						<IconSwitchHorizontal
							className={classes.linkIcon}
							stroke={1.5}
						/>
						<span>Change account</span>
					</a>

					<a
						href="#"
						className={classes.link}
						onClick={(event) => event.preventDefault()}
					>
						<IconLogout className={classes.linkIcon} stroke={1.5} />
						<span onClick={logout}>Logout</span>
					</a>
				</Navbar.Section>
			)}
		</Navbar>
	);
}
