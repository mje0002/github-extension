import React, { FC, useEffect, useState } from "react";
import "./style.css";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Repo } from "./lib/repo";

export const HomePage: FC<{ repos: Array<Repo> }> = ({ repos = [] }) => {

	const listItems = repos.map((repo, i) => {
		if (repo.isEnabled) {
			return <Card variant="outlined" sx={{ backgroundColor: i % 4 == 0 || i == 3 || i % 4 == 3 ? "#A7A4BF" : "#FBF9F9" }}>
				<CardContent>
					<div className="repo-name">{repo.name}</div>
					<div className="pull-request">
						<span>Open</span>
						<span>Requested</span>
					</div>
				</CardContent>
			</Card>
		} else {
			return;
		}
	}
	);

	return (
		<Paper sx={{ display: 'grid', gridTemplateColumns: "auto auto" }}>
			{listItems}
		</Paper>
	);
};

