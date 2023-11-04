import React, { FC, useEffect, useState } from "react";
import "./style.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

export const SettingsPage: FC<{ repos: Array<string> }> = ({ repos = [] }) => {

	const listItems = repos.map((repo, i) =>
		<TableRow
			key={repo.name}
			sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
		>
			<TableCell component="th" scope="row">
				{repo.name}
			</TableCell>
			<TableCell component="th" scope="row">
				{repo.enabled}
			</TableCell>
		</TableRow>);

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Dessert (100g serving)</TableCell>
						<TableCell align="right">Calories</TableCell>
						<TableCell align="right">Fat&nbsp;(g)</TableCell>
						<TableCell align="right">Carbs&nbsp;(g)</TableCell>
						<TableCell align="right">Protein&nbsp;(g)</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
				</TableBody>
			</Table>
		</TableContainer>
	);
};

