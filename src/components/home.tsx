import { FC, useEffect } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import { useRepos } from "./ReposContext";
import { RepoCard } from "./RepoCard";

export const HomePage: FC = () => {
	const repos = useRepos();

	return (
		<Paper sx={{ display: 'grid', gridTemplateColumns: "auto auto" }}>
			{repos ? repos.filter((f) => f.isEnabled).map((repo, i) =>
				<Card key={repo.full_name} variant="outlined" sx={{ backgroundColor: i % 4 == 0 || i == 3 || i % 4 == 3 ? "#A7A4BF" : "#FBF9F9" }}>
					<RepoCard name={repo.full_name}></RepoCard>
				</Card>
			) : undefined}
		</Paper>
	);
};

