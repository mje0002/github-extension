import { FC, useEffect, useState } from "react";
import "../style.css";
import CardContent from "@mui/material/CardContent";
import useFetch from "../hooks/useFetch";
import { GithubService } from "../lib/services/github";
import { useConfiguration } from "./ConfigurationContext";

type pullRequestResult = Array<{ pr_number: number, comments: number, update_at: Date, link: string }>;

export const RepoCard: FC<{ name: string }> = ({ name }) => {
	const configs = useConfiguration();
	const [response, setResponse] = useState<pullRequestResult | null>(null)
	const [loading, setLoading] = useState(false)
	const [hasError, setHasError] = useState<{ message: string } | null>(null)

	const service = new GithubService(configs?.personal_access_token ?? '');

	useEffect(() => {
		let ignore = false;
		setLoading(true)
		service.getPullRequests(name)
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
		<CardContent>
			{
				loading ? <div>Loading...</div> :
					(
						hasError ? <div>Error occured. {hasError.message}</div> :
							(
								<>
									<div className="repo-name">{name}</div>
									<div className="pull-request">
										<span>Open {response?.length ?? 0} </span>
									</div>
								</>
							)
					)
			}
		</CardContent>

	);
};

