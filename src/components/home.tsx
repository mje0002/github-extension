import { FC, useEffect, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import { useRepos } from "./ReposContext";
import { RepoCard } from "./RepoCard";
import { RepoSchema } from "../lib/models/repo";
import { Typography } from "@mui/material";

export const HomePage: FC = () => {
	const repos = useRepos();
	const [filtered, setFiltered] = useState<Array<RepoSchema>>([]);

	useEffect(() => {
		const next = repos ? repos.filter((f) => f.isEnabled) : [];
		setFiltered(next);
	}, [repos])

	return (
		<>
			{filtered.length > 0 ?
				<Paper sx={{ display: 'grid', gridTemplateColumns: "50% 50%" }}>
					{filtered && filtered.length > 0 ? filtered.map((repo, i) =>
						<Card key={repo.id} variant="outlined" sx={{ backgroundColor: i % 4 == 0 || i == 3 || i % 4 == 3 ? "#A7A4BF" : "#FBF9F9" }}>
							<RepoCard repo={repo}></RepoCard>
						</Card>
					) : undefined}
				</Paper>
				:
				<Paper>
					<Typography variant="subtitle1" gutterBottom>
						No Repos are configured. Configure repos on configureation page.
					</Typography>
				</Paper>
			}

		</>
	);
};

