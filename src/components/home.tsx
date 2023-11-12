import React, { FC, useEffect, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { RepoSchema } from "../lib/models/repo";
import { useRepos } from "./ReposContext";

export const HomePage: FC = () => {
	const repos = useRepos();
	let listItems: (JSX.Element | undefined)[] = [];
	if (repos) {
		listItems = repos.map((repo, i) => {
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
		});
	}

	return (
		<Paper sx={{ display: 'grid', gridTemplateColumns: "auto auto" }}>
			{listItems}
		</Paper>
	);
};

