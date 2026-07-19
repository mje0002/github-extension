export type Platform = 'github' | 'gitlab';

export type PATEntry = {
	id: string;
	label: string;
	platform: Platform;
	token: string;
}
