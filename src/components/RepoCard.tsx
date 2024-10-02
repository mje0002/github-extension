import { FC, useEffect, useState } from "react";
import "../style.css";
import CardContent from "@mui/material/CardContent";
import { GithubService } from "../lib/services/github";
import { useConfiguration } from "./ConfigurationContext";
import API from "../lib/services/api";
import { RepoSchema } from "../lib/models/repo";
import Link from "@mui/material/Link";
import { PullRequestWrapper } from "./PullRequestWrapper";

export type basePullRequest = { pr_number: number, comments: number, update_at: Date, link: string, created_at: Date };
export type pullRequestResult = Array<basePullRequest>;

export const RepoCard: FC<{ repo: RepoSchema }> = ({ repo }) => {
	const configs = useConfiguration();
	const [response, setResponse] = useState<pullRequestResult | null>(null)
	const [loading, setLoading] = useState(false)
	const [hasError, setHasError] = useState<{ message: string } | null>(null)

	const service = new GithubService(configs?.personal_access_token ?? '');

	useEffect(() => {
		let ignore = false;
		setLoading(true);
		API.queue(() => service.getPullRequests(repo.full_name))
			.then((res: any) => {
				if (res && !ignore) {
					setResponse(res);
				}
			})
			.catch((e) => {
				console.log(e);
				if (e instanceof Error) {
					setHasError({ message: e.message });
				}
			}).finally(() => {
				setLoading(false);
			});
		return () => {
			ignore = true;
		}
	}, []);



	return (
		<CardContent sx={[
			{ padding: '8px', paddingBottom: '8px' },
			{ "&:last-child": { paddingBottom: '8px' } }
		]}>
			{
				loading ? <div>Loading...</div> :
					(
						hasError ? <div>Error occured. {hasError.message}</div> :
							(
								<>
									<div className="repo-name">
										<Link
											component="button"
											variant="body1"
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
									<PullRequestWrapper response={response} />
								</>
							)
					)
			}
		</CardContent>

	);
};

