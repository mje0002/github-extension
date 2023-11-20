import React, { FC, useContext, useEffect, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, AccordionSummary, Typography, AccordionDetails, IconButton, Button, InputAdornment, InputLabel, Input, styled } from "@mui/material";
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import { Repo } from "../lib/models/repo";
import { Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Add, Delete, Update, Visibility, VisibilityOff } from "@mui/icons-material";
import { GithubService } from "../lib/services/github";
import { useRepos, useReposDispatch } from "./ReposContext";
import { useConfiguration, useConfigurationDispatch } from "./ConfigurationContext";

const Accordion = styled((props: AccordionProps) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:not(:last-child)': {
		borderBottom: 0,
	},
	'&:before': {
		display: 'none',
	},
}));

export const SettingsPage: FC = () => {
	const [loading, setLoading] = useState(false);
	const [repoError, setRepoError] = useState<string | null>(null);
	const [configerror, setConfigError] = useState<string | null>(null);
	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};


	const repos = useRepos();
	const dispatch = useReposDispatch();

	const configs = useConfiguration();
	const dispatchConfig = useConfigurationDispatch();

	const setStorage = (items: { [key: string]: any }) => {
		if (chrome.storage) {
			chrome.storage.sync.set(items)
		}
	}

	function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
		func: F,
		waitFor: number,
	): (...args: Parameters<F>) => void {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: Parameters<F>): void => {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				console.log('debounce')
				func(...args)
			}, waitFor);
		};
	}

	const modifyErrorState = (errorMessage: string | null, type: 'repo' | 'config') => {
		const errorFunc = type == 'repo' ? setRepoError : setConfigError;
		errorFunc(errorMessage);
		if (errorMessage) {
			debounce(errorFunc, 2000)(null);
		}
	}

	useEffect(() => {
		setStorage({ 'configs': configs });
		setStorage({ 'repos': repos });
	}, [repos, configs])

	const handleConfig = async (action: 'update' | 'add' | 'delete', field: any, value: any) => {
		if (loading) return;
		setLoading(true);
		try {
			if (dispatchConfig) {
				if (!value && ['update', 'add'].includes(action)) { throw new Error(`Invalid Value. Please provide ${field} with the correct value.`); }
				dispatchConfig({ type: action, field: field, value: value });
				modifyErrorState(null, 'config');
			}
		} catch (error) {
			if (error instanceof Error)
				modifyErrorState(error.message, 'config');
		} finally {
			setLoading(false);
		}
	}

	const handleFetch = async () => {
		if (loading) return;
		setLoading(true);
		try {
			if (!configs || !configs.personal_access_token) {
				throw new Error('Access Token Required');
			}
			const githubService = new GithubService(configs.personal_access_token);
			const result = await githubService.getRepos();
			if (dispatch) {
				dispatch({ type: 'add', repos: result.map((m) => new Repo(m)) });
				modifyErrorState(null, 'repo');
			}
		} catch (error) {
			if (error instanceof Error) {
				modifyErrorState(error.message, 'repo')
			}

		} finally {
			setLoading(false);
		}
	}

	let listItems: (JSX.Element | undefined)[] = [];

	if (repos) {
		listItems = repos.map((repo, i) =>
			<TableRow
				data-key={repo.name}
				key={repo.name}
				sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
			>
				<TableCell component="th" scope="row">
					{repo.name}
				</TableCell>
				<TableCell component="th" scope="row">
					<Checkbox checked={repo.isEnabled} onClick={() => {
						if (loading) return;
						repo.isEnabled = true;
						if (dispatch) dispatch({ type: 'update', repos: [repo] });
					}}></Checkbox>
				</TableCell>
			</TableRow>);

	}

	return (
		<div className="wrapper">
			<div id="overlay" className={loading ? 'active' : ''}>
				<div className={`lds-ellipsis ${loading ? 'active' : ''}`}><div></div><div></div><div></div><div></div></div>
			</div>
			<Accordion>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography>Base Configuration</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{/* Needs validation needs error handling */}
					{configerror && <div style={{ color: 'red' }}>{configerror}</div>}
					<Box paddingRight="5px">

						{/* <TextField id="pat" label="Personal Access Token" variant="standard" /> */}
						<InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
						<Input
							id="standard-adornment-password"
							type={showPassword ? 'text' : 'password'}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
						<IconButton aria-label="add" onClick={async (e) => {
							e.preventDefault();
							const v = document.getElementById('standard-adornment-password') as HTMLInputElement;
							if (v) {
								await handleConfig("add", 'personal_access_token', v.value);
								v.value = "";
							}
						}}>
							<Add />
						</IconButton>

						<IconButton aria-label="update" onClick={async (e) => {
							e.preventDefault();
							const v = document.getElementById('standard-adornment-password') as HTMLInputElement;
							if (v) {
								await handleConfig("update", 'personal_access_token', v.value);
								v.value = "";
							}
						}}>
							<Update />
						</IconButton>

						<IconButton aria-label="delete" onClick={
							async (e) => {
								e.preventDefault();
								await handleConfig("delete", 'personal_access_token', undefined)
							}}>
							<Delete />
						</IconButton>
					</Box>
				</AccordionDetails>
			</Accordion>
			<Accordion TransitionProps={{ unmountOnExit: true }} >
				<AccordionSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel2a-content"
					id="panel2a-header"
				>
					<Typography>Repo Configuration</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{/* Needs validation needs error handling */}
					{repoError && <div style={{ color: 'red' }}>{repoError}</div>}
					<Button disabled={loading} variant="outlined" onClick={async () => await handleFetch()}>Fetch</Button>
					<TableContainer component={Paper}>
						<Table sx={{ minWidth: 250 }} aria-label="Repo Configuration Table">
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell align="right">Enabled</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{listItems}
							</TableBody>
						</Table>
					</TableContainer>
				</AccordionDetails>
			</Accordion>
		</div>

	);
};
