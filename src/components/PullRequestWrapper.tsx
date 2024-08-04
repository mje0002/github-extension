import { ExpandMore } from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { FC } from "react";
import { PullRequest } from "./PullRequet";
import { pullRequestResult } from "./RepoCard";


export const PullRequestWrapper: FC<{ response: pullRequestResult | null }> = ({ response }) => {

	return (
		<div className="pull-request">
			<Accordion disableGutters square
				sx={{ backgroundColor: 'inherit', boxShadow: 'none', '&:.Mui-disabled': { background: 'inherit' } }}
				disabled={!!!response?.length}
			>
				<AccordionSummary
					sx={{
						minHeight: 'fit-content',
						margin: '0px',
						paddingLeft: '0px',
						'> .MuiAccordionSummary-content': { margin: '0px' }
					}}
					expandIcon={<ExpandMore />}
				>
					<span>Open {response?.length ?? 0} </span>
				</AccordionSummary>
				<AccordionDetails sx={{ padding: '0px' }}>
					<ul style={{ margin: '0px', padding: '0px', paddingLeft: '8px', fontSize: 'small' }}>
						{
							response?.map(
								(pull) => <PullRequest key={pull.pr_number} pr={pull}></PullRequest>
							)
						}
					</ul>
				</AccordionDetails>
			</Accordion>
		</div>
	);
};

