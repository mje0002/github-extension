import { FC, useEffect, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button, Stack, Typography, Box } from "@mui/material";
import { Repo } from "../lib/models/repo";
import { Checkbox } from "@mui/material";
import { GithubService } from "../lib/services/github";
import { useRepos, useReposDispatch } from "./ReposContext";
import { useConfiguration } from "./ConfigurationContext";

export const ReposPage: FC = () => {
	const [loading, setLoading] = useState(false);
	const [repoError, setRepoError] = useState<string | null>(null);
	const repos = useRepos();
	const configs = useConfiguration();
	const dispatch = useReposDispatch();

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
		const errorFunc = setRepoError;
		errorFunc(errorMessage);
		if (errorMessage) {
			debounce(errorFunc, 2000)(null);
		}
	}

	useEffect(() => {
		setStorage({ 'repos': repos });
	}, [repos])

	const handleFetch = async () => {
		if (loading) return;
		setLoading(true);
		try {
			const tokens = configs?.tokens ?? [];
			if (tokens.length === 0) throw new Error('At least one Access Token is required');

			const errors: string[] = [];
			const allRepos: Repo[] = [];

			await Promise.all(tokens.map(async (pat) => {
				try {
					const githubService = new GithubService(pat.token);
					const result = await githubService.getRepos();
					result.forEach(r => allRepos.push(new Repo({ ...r, pat_id: pat.id, platform: pat.platform })));
				} catch (e) {
					errors.push(`[${pat.label}]: ${e instanceof Error ? e.message : String(e)}`);
				}
			}));

			if (dispatch) {
				dispatch({ type: 'add', repos: allRepos });
			}
			if (errors.length > 0) modifyErrorState(errors.join(' | '), 'repo');
			else modifyErrorState(null, 'repo');
		} catch (error) {
			if (error instanceof Error) modifyErrorState(error.message, 'repo');
		} finally {
			setLoading(false);
		}
	};

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
					{configs?.tokens?.find(t => t.id === repo.pat_id)?.label ?? '—'}
				</TableCell>
				<TableCell component="th" scope="row">
					<Checkbox checked={repo.isEnabled} onClick={() => {
						if (loading) return;
						repo.isEnabled = !repo.isEnabled;
						if (dispatch) dispatch({ type: 'update', repos: [repo] });
					}}></Checkbox>
				</TableCell>
			</TableRow>);

	}

	return (
		<>
			{/* {Needs validation needs error handling} */}
			{repoError && <div style={{ color: 'red' }}>{repoError}</div>}
			<Box sx={{ p: 0 }}>
				<Stack
					direction="row"
					sx={{ justifyContent: 'space-between', alignItems: 'center' }}
				>
					<Typography gutterBottom variant="h5" component="div">
						Repos' Configuration
					</Typography>
					<Button disabled={loading} variant="outlined" onClick={async () => await handleFetch()}>Fetch</Button>
				</Stack>
			</Box>
			<TableContainer component={Paper} sx={{ overflow: "auto", height: "calc(100% - 35px)" }}>
				<Table sx={{ minWidth: 250 }} size="small" aria-label="Repo Configuration Table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="left">Token</TableCell>
							<TableCell align="left">Enabled</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{listItems}
					</TableBody>
				</Table>
			</TableContainer>
		</>

	);
};
