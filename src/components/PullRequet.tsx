import { FC } from "react";
import { Update } from "@mui/icons-material";
import Link from "@mui/material/Link";

export const PullRequest: FC<{ pr: { pr_number: number, comments: number, update_at: Date, link: string } }> = ({ pr }) => {

	return (
		<li key={pr.pr_number} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
			<Link style={{ paddingRight: '5px' }}
				component="button"
				variant="body2"
				onClick={() => {
					if (chrome.tabs) {
						chrome.tabs.create({ url: `${pr.link}` })
					} else {
						window.open(`${pr.link}`, "_blank")
					}
					return false;
				}}>{pr.pr_number}</Link>
			<span style={{ flex: '1 0 50%' }}><Update style={{ verticalAlign: 'middle' }} fontSize="small" /> {pr.update_at ? new Date(pr.update_at).toDateString() : ''}</span>
		</li>
	);
};

