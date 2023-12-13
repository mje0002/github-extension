import { FC } from "react";

export const Loading: FC<{ isLoading: boolean }> = ({ isLoading }) => {
	return (
		<div id="overlay" className={isLoading ? 'active' : ''}>
			<div className={`lds-ellipsis ${isLoading ? 'active' : ''}`}><div></div><div></div><div></div><div></div></div>
		</div>
	);
};

