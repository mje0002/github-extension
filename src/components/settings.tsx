import React, { FC, useContext, useEffect, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Accordion, AccordionSummary, Typography, AccordionDetails, IconButton, TextField, Button } from "@mui/material";
import { Repo } from "../lib/models/repo";
import { Checkbox } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { Add, Delete, Update } from "@mui/icons-material";
import { GithubService } from "../lib/services/github";
import { useRepos, useReposDispatch } from "./ReposContext";

export const SettingsPage: FC = () => {
	const [fetching, setFetching] = useState(false);

	const repos = useRepos();
	const dispatch = useReposDispatch();

	const githubService = new GithubService('');
	const handleFetch = async () => {
		if (fetching) return;
		setFetching(true);
		try {
			const result = await githubService.getRepos();
			if (dispatch) {
				dispatch({ type: 'add', repos: result.map((m) => new Repo(m)) })
			}
		} catch (error) {
			//TODO error handling
			console.log(error);
		} finally {
			setFetching(false);
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
						if (fetching) return;
						repo.isEnabled = true;
						if (dispatch) dispatch({ type: 'update', repos: [repo] });
					}}></Checkbox>
				</TableCell>
			</TableRow>);

	}

	return (
		<div className="wrapper">
			<div id="overlay" className={fetching ? 'active' : ''}>
				<div className={`lds-ellipsis ${fetching ? 'active' : ''}`}><div></div><div></div><div></div><div></div></div>
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
					<Box paddingRight="5px">
						<TextField id="PAT" label="Personal Access Token" variant="standard" />
						<IconButton aria-label="add">
							<Add />
						</IconButton>

						<IconButton aria-label="update">
							<Update />
						</IconButton>

						<IconButton aria-label="delete">
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
					<Button disabled={fetching} variant="outlined" onClick={async () => await handleFetch()}>Fetch</Button>
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
