import { FC } from "react";
import { Create, Update } from "@mui/icons-material";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import CommentIcon from '@mui/icons-material/Comment';
import { basePullRequest } from "./RepoCard";

export const PullRequest: FC<{ pr: basePullRequest }> = ({ pr }) => {
	const updateDate = new Intl.DateTimeFormat('en-US', {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(new Date(pr.update_at));

	const createDate = new Intl.DateTimeFormat('en-US', {
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(new Date(pr.created_at));

	return (
		<li key={pr.pr_number} style={{ marginBottom: '6px' }}>
			<Link
				component="button"
				variant="body2"
				color="inherit"
				onClick={() => {
					if (chrome.tabs) {
						chrome.tabs.create({ url: `${pr.link}` })
					} else {
						window.open(`${pr.link}`, "_blank")
					}
					return false;
				}}
				sx={{ display: 'block', textAlign: 'left', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
			>
				<strong>#{pr.pr_number}</strong> {pr.title}
			</Link>
			<div style={{ display: 'flex', flexDirection: 'row', gap: '8px', color: 'inherit' }}>
				<div className="created-at">
					<Tooltip title="Created At" placement="top-start">
						<Create style={{ verticalAlign: 'middle' }} fontSize="small" color="action" />
					</Tooltip>
					{pr.created_at ? createDate : ''}
				</div>
				<div className="update-at">
					<Tooltip title="Updated At" placement="left">
						<Update style={{ verticalAlign: 'middle' }} fontSize="small" />
					</Tooltip>
					{pr.update_at ? updateDate : ''}
				</div>
				<div className="comments">
					<Badge badgeContent={pr.comments} color="primary">
						<Tooltip title="Comments" placement="left">
							<CommentIcon style={{ verticalAlign: 'middle' }} fontSize="small" color="action" />
						</Tooltip>
					</Badge>
				</div>
			</div>
		</li>
	);
};

