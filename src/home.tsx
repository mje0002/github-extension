import React, { FC, useEffect, useState } from "react";
import "./style.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

export const HomePage: FC<{ repos: Array<string> }> = ({ repos = [] }) => {

	const listItems = repos.map((repo, i) =>
		<Card variant="outlined" sx={{ backgroundColor: i % 4 == 0 || i == 3 || i % 4 == 3 ? "#A7A4BF" : "#FBF9F9" }}>
			<CardContent>
				<div className="repo-name">{repo}</div>
				<div className="pull-request">
					<span>Open</span>
					<span>Requested</span>
				</div>
			</CardContent>
		</Card>);

	return (
		<Paper sx={{ display: 'grid', gridTemplateColumns: "auto auto" }}>
			{listItems}
		</Paper>
	);
};

