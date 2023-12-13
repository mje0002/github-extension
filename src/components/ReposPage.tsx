import { FC, useEffect, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";
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
		<>
			{/* {Needs validation needs error handling} */}
			{repoError && <div style={{ color: 'red' }}>{repoError}</div>}
			<Button disabled={loading} variant="outlined" onClick={async () => await handleFetch()}>Fetch</Button>
			<TableContainer component={Paper}>
				<Table sx={{ minWidth: 250 }} size="small" aria-label="Repo Configuration Table">
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
		</>

	);
};
