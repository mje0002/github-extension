import { Octokit } from 'octokit';
import { UserRepo } from '../models/github/UserRepo';

export class GithubService {
	private readonly _octo: Octokit;
	private readonly nexRegex = /(?<=<)([\S]*)(?=>; rel="Next")/i;

	private _repos: UserRepo[] = [];

	constructor(personal_access: string) {
		this._octo = new Octokit({ auth: personal_access });
	}

	async getRepos(): Promise<Array<UserRepo>> {
		const result = await this.processPagedData(
			'/user/repos',
			this.processRepos.bind(this),
		);

		return this._repos;
	}
	/**
	 * Fetches the pull requests from github
	 * @param start
	 * @param end
	 */
	async getPullRequests(repo: string) {
		const q = encodeURIComponent(
			`is:pr state:open repo:${repo}`,
		);
		let result: Array<{ pr_number: number, comments: number, update_at: Date, link: string }> = [];
		const url = `/search/issues?q=${q}`;
		await this.processPagedData(url, (data: any) => {
			const parsedData: any[] = data.items ?? [];
			result = parsedData.reduce((prev, curr) => {
				prev.push({
					pr_number: curr.number,
					comments: curr.comments,
					update_at: curr.update_at,
					link: curr.html_url
				});
				return prev;
			}, [])
		});

		return result;
	}

	protected processPullRequests(data: any) {
		const parsedData: any[] = data.items ?? [];
		let result = parsedData.reduce((prev, curr) => {
			prev.push({
				pr_number: curr.number,
				comments: curr.comments,
				update_at: curr.update_at,
				link: curr.html_url
			});
			return prev;
		}, [])
	}

	protected processRepos(data: any) {
		const parsedData: any[] = data ?? [];

		for (const p of parsedData) {
			this._repos.push(p);
		}
	}

	/**
	 * processes the pages for the github request
	 * @param url
	 */
	protected async processPagedData(
		url: string,
		processData: (data: any) => void,
	) {
		let morePages = true;
		while (morePages) {
			const response = await this._octo.request({
				method: 'GET',
				url: url,
				per_page: 100,
				headers: {
					'X-GitHub-Api-Version': '2022-11-28', //env
				},
			});
			processData(response.data);

			const linkHeader = response.headers.link;

			morePages = !!(linkHeader && linkHeader.includes(`rel=\"next\"`));

			if (morePages && linkHeader) {
				const i = linkHeader.match(this.nexRegex);
				url = i ? i[0] : '';
			}
		}
	}
}
