import { FC } from "react";
import "../style.css";
import CardContent from "@mui/material/CardContent";
import { RepoSchema } from "../lib/models/repo";
import Link from "@mui/material/Link";
import { PullRequestWrapper } from "./PullRequestWrapper";

export type basePullRequest = { pr_number: number, title: string, comments: number, update_at: Date, link: string, created_at: Date };
export type pullRequestResult = Array<basePullRequest>;

export const RepoCard: FC<{ repo: RepoSchema, pulls: pullRequestResult | null, loading: boolean }> = ({ repo, pulls, loading }) => {
	return (
		<CardContent sx={[
			{ padding: '8px', paddingBottom: '8px' },
			{ "&:last-child": { paddingBottom: '8px' } }
		]}>
			{loading ? <div>Loading...</div> : (
				<>
					<div className="repo-name">
						<Link
							component="button"
							variant="body1"
							color="inherit"
							onClick={() => {
								if (chrome.tabs) {
									chrome.tabs.create({ url: `${repo.url}/pulls` })
								} else {
									window.open(`${repo.url}/pulls`, "_blank")
								}
								return false;
							}}>
							{repo.full_name}
						</Link>
					</div>
					<PullRequestWrapper response={pulls} />
				</>
			)}
		</CardContent>
	);
};
