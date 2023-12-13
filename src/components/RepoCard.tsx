import { FC, useEffect, useState } from "react";
import "../style.css";
import CardContent from "@mui/material/CardContent";
import useFetch from "../hooks/useFetch";
import { GithubService } from "../lib/services/github";
import { useConfiguration } from "./ConfigurationContext";
import API from "../lib/services/api";
import { RepoSchema } from "../lib/models/repo";
import Link from "@mui/material/Link";
import { ExpandMore, Update } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { PullRequest } from "./PullRequet";

type pullRequestResult = Array<{ pr_number: number, comments: number, update_at: Date, link: string }>;

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
					const response = res;
					setResponse(response);
				}
				setLoading(false);
			})
			.catch((e) => {
				console.log(e);
				if (e instanceof Error) {
					setHasError({ message: e.message });
				}
				setLoading(false);
			})
		return () => {
			ignore = true;
		}
	}, []);



	return (
		<CardContent sx={{ padding: '8px', paddingBottom: '16px' }}>
			{
				loading ? <div>Loading...</div> :
					(
						hasError ? <div>Error occured. {hasError.message}</div> :
							(
								<>
									<div className="repo-name">
										<Link
											component="button"
											variant="h6"
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
									<div className="pull-request">
										<Accordion disableGutters square sx={{ backgroundColor: 'inherit', boxShadow: 'none' }}>
											<AccordionSummary
												sx={{ minHeight: 'fit-content', margin: '0px' }}
												expandIcon={<ExpandMore />}
												aria-controls="panel1a-content"
												id="panel1a-header"
											>
												<span>Open {response?.length ?? 0} </span>
											</AccordionSummary>
											<AccordionDetails>
												<ul style={{ margin: '0px', padding: '0px', paddingLeft: '8px', fontSize: 'small' }}>
													{response?.map((pull) => <PullRequest pr={pull}></PullRequest>)}
												</ul>
											</AccordionDetails>
										</Accordion>
									</div>
								</>
							)
					)
			}
		</CardContent>

	);
};

