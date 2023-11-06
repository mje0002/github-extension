import React, { FC, useEffect, useState } from "react";
import "./style.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { Repo } from "./lib/repo";
import { Checkbox } from "@mui/material";

export const SettingsPage: FC<{ repos: Array<Repo> }> = ({ repos = [] }) => {

	const listItems = repos.map((repo, i) =>
		<TableRow
			data-key={repo.name}
			key={repo.name}
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
		>
			<TableCell component="th" scope="row">
				{repo.name}
			</TableCell>
			<TableCell component="th" scope="row">
				<Checkbox checked={repo.isEnabled}></Checkbox>
			</TableCell>
		</TableRow>);

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="Repo Configuration Table">
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
	);
};

