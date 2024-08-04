import { Octokit } from 'octokit';
import * as OctokitTypes from "@octokit/types";
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
		let result: Array<{ pr_number: number, comments: number, update_at: Date, link: string, created_at: Date }> = [];
		const url = `/search/issues?q=${q}`;
		await this.processPagedData(url, (data: any) => {
			const parsedData: any[] = data.items ?? [];
			result = parsedData.reduce((prev, curr) => {
				console.log("Current Pull", curr.number, curr);
				prev.push({
					pr_number: curr.number,
					comments: curr.comments,
					update_at: curr.updated_at,
					link: curr.html_url,
					created_at: curr.created_at
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
		let delay = 0;
		while (morePages) {
			if (delay > 0) await this.delayAPI(delay);
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
			delay = this.getBackOff(response.headers);
			url = this.getNextPage(linkHeader);
			morePages = url != '';
		}
	}

	private delayAPI(delay: number = 0) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve(true);
			}, delay);
		})
	}

	private getNextPage(linkHeader: string | undefined) {
		let url = '';
		const hasNext = !!(linkHeader && linkHeader.includes(`rel=\"next\"`));

		if (hasNext && linkHeader) {
			const i = linkHeader.match(this.nexRegex);
			url = i ? i[0] : '';
		}

		return url;
	}

	private getBackOff(headers: OctokitTypes.ResponseHeaders) {
		/*
		if x-ratelimit-remaining == 0 Then Pull value from x-ratelimit-reset and set timeout for next call to wait till after time
		if retry-after is present then use value retry-after and set timeout for next call to wait till after time

		if either is true return correct value for hold pattern!
		*/
		console.log('Hitting back off check', headers)
		let backoff = 0;

		if (headers['x-ratelimit-remaining'] && headers['x-ratelimit-remaining'] == '0') {
			//utc epoch seconds
			//convert seconds to time subtract NOW - minus SECONDS return value
			const reset = headers['x-ratelimit-reset'] ?? '0';
			if (!isNaN(reset as unknown as number) && reset != '0') {
				var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
				d.setUTCSeconds(parseInt(reset));
				backoff = d.getUTCSeconds() - new Date().getUTCSeconds();
			}
		}

		if (headers['retry-after']) {
			const retryAfter = headers['retry-after'];
			if (!isNaN(retryAfter as number)) {
				backoff = parseInt(headers['retry-after'].toString());
			}
		}

		return backoff * 1000;
	}
}
