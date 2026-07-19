import { FC, useEffect, useMemo, useState } from "react";
import "../style.css";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import { useRepos } from "./ReposContext";
import { useConfiguration } from "./ConfigurationContext";
import { RepoCard, pullRequestResult } from "./RepoCard";
import { GithubService } from "../lib/services/github";
import { MockGithubService } from "../lib/services/github.mock";
import { Typography } from "@mui/material";

export const HomePage: FC = () => {
	const repos = useRepos();
	const configs = useConfiguration();
	const [prData, setPrData] = useState<Record<string, pullRequestResult>>({});
	const [loading, setLoading] = useState(false);

	const filtered = useMemo(
		() => repos?.filter(f => f.isEnabled) ?? [],
		[repos]
	);

	const token = configs?.tokens?.[0]?.token ?? '';

	useEffect(() => {
		if (filtered.length === 0) return;

		const service = DEVELOPMENT
			? new MockGithubService(token)
			: new GithubService(token);

		setLoading(true);
		service.getAllRepoPullRequests(filtered.map(r => r.full_name))
			.then(setPrData)
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [filtered, token]);

	return (
		<>
			{filtered.length > 0 ?
				<Paper sx={{ display: 'grid', gridTemplateColumns: "50% 50%" }}>
					{filtered.map((repo, i) =>
						<Card key={repo.id} variant="outlined" sx={
							(theme) => ({
								backgroundColor: i % 4 == 0 || i == 3 || i % 4 == 3 ?
									theme.palette.primary.light : theme.palette.background.paper,
								color: i % 4 == 0 || i == 3 || i % 4 == 3 ?
									theme.palette.primary.contrastText : theme.palette.text.primary,
							})
						}>
							<RepoCard
								repo={repo}
								pulls={prData[repo.full_name] ?? null}
								loading={loading}
							/>
						</Card>
					)}
				</Paper>
				:
				<Paper>
					<Typography variant="subtitle1" gutterBottom>
						No repos are configured. Configure repos on the Configuration page.
					</Typography>
				</Paper>
			}
		</>
	);
};
