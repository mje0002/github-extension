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
	 * Get the Pull Request Metrics
	 * @param start
	 * @param end
	 * @returns Object { Date: { Open: PullRequests[], closed: PullRequests:[] }}
	 */
	// async GetPullRequestMetrics(start?: string, end?: string) {
	//   const { firstDay, lastDay } = this.generateRange(start, end);
	//   this.getDates(firstDay, lastDay);
	//   await this.getPullRequests(firstDay, lastDay);

	//   let first = firstDay;
	//   let last = lastDay;
	//   if (start && isValid(new Date(start)) && end && isValid(new Date(end))) {
	//     first = new Date(start);
	//     last = new Date(end);
	//   }
	//   return this.getResultsSet(first, last);
	// }
	/**
	 * Filters the internal Cache set to find the correct result set
	 * @param firstDay
	 * @param lastDay
	 * @returns Object { Date: { Open: PullRequests[], closed: PullRequests:[] }}
	 */
	// protected getResultsSet(firstDay: Date, lastDay: Date) {
	//   const result: ResultMetric = {};
	//   for (const key of this._internalCache.keys()) {
	//     if (isWithinInterval(new Date(key), { start: firstDay, end: lastDay })) {
	//       const i = this._internalCache.get(key);
	//       result[key] = i as PullRequestMetic;
	//     }
	//   }
	//   return result;
	// }

	/**
	 * Fetches the pull requests from github
	 * @param start
	 * @param end
	 */
	// protected async getPullRequests(start: Date, end: Date) {
	//   const created = `created:${format(start, 'yyyy-MM-dd')}..${format(
	//     end,
	//     'yyyy-MM-dd',
	//   )}`;
	//   const q = encodeURIComponent(
	//     `is:pr repo:${this.org}/${this.repo} ${created}`,
	//   );
	//   const url = `/search/issues?q=${q}`;
	//   await this.processPagedData(url, this.processPullRequests);
	// }

	// protected processPullRequests(data: any) {
	//   const parsedData: any[] = data.items ?? [];
	//   for (const i of parsedData) {
	//     const tempPr = new PullRequest(i);
	//     const formated = this.getFormatedDates(
	//       tempPr.created_at,
	//       tempPr.closed_at,
	//     );
	//     // Check for created date as this is the OPENED
	//     if (this._internalCache.has(formated.created_at)) {
	//       const current = this._internalCache.get(formated.created_at);
	//       current?.opened.push(tempPr);
	//       this._internalCache.set(formated.created_at, {
	//         opened: current?.opened as PullRequest[],
	//         closed: current?.closed as PullRequest[],
	//       });
	//     } else {
	//       this._internalCache.set(formated.created_at, {
	//         opened: [tempPr],
	//         closed: [],
	//       });
	//     }

	//     //Check for the closed at date as this is the when it was CLOSED
	//     if (this._internalCache.has(formated.closed_at)) {
	//       const current = this._internalCache.get(formated.closed_at);
	//       current?.closed.push(tempPr);
	//       this._internalCache.set(formated.closed_at, {
	//         opened: current?.opened as PullRequest[],
	//         closed: current?.closed as PullRequest[],
	//       });
	//     } else {
	//       this._internalCache.set(formated.closed_at, {
	//         opened: [],
	//         closed: [tempPr],
	//       });
	//     }
	//   }
	// }

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

	/**
	 * Formats the dates into MM-dd-yyyy as we don't need time
	 * @param created_at
	 * @param closed_at
	 * @returns Object { created_at: string, closed_at: string}
	 */
	// protected getFormatedDates(created_at: string, closed_at: string) {
	//   const result = { created_at: '', closed_at: '' };
	//   const create = new Date(created_at);
	//   const closed = new Date(closed_at);

	//   if (isValid(create)) {
	//     result.created_at = format(create, 'MM-dd-yyyy');
	//   }

	//   if (isValid(closed)) {
	//     result.closed_at = format(closed, 'MM-dd-yyyy');
	//   }
	//   return result;
	// }
	/**
	 * Generates the effective date range
	 * @param start
	 * @param end
	 * @returns
	 */
	// protected generateRange(start?: string, end?: string) {
	//   const date = new Date(),
	//     y = date.getFullYear(),
	//     m = date.getMonth();

	//   let firstDay = new Date(y, m, 1);
	//   let lastDay = new Date(y, m + 1, 0);

	//   if (start && isValid(new Date(start)) && end && isValid(new Date(end))) {
	//     const s = new Date(start),
	//       sy = s.getFullYear(),
	//       sm = s.getMonth();

	//     const e = new Date(end),
	//       ey = e.getFullYear(),
	//       em = e.getMonth();

	//     firstDay = new Date(sy, sm, 1);
	//     lastDay = new Date(ey, em + 1, 0);
	//   }

	//   return { firstDay, lastDay };
	// }
	/**
	 * Gets all the possible days between date range
	 * @param startDate
	 * @param endDate
	 */
	// protected getDates(startDate: Date, endDate: Date) {
	//   let currentDate = startDate;
	//   while (currentDate <= endDate) {
	//     if (!this._internalCache.has(format(currentDate, 'MM-dd-yyyy'))) {
	//       this._internalCache.set(format(currentDate, 'MM-dd-yyyy'), {
	//         closed: [],
	//         opened: [],
	//       });
	//     }
	//     currentDate = this.addDays.call(currentDate, 1);
	//   }
	// }

	/**
	 *
	 * @param this
	 * @param days
	 * @returns
	 */
	private addDays(this: Date, days: number) {
		const date = new Date(this.valueOf());
		date.setDate(date.getDate() + days);
		return date;
	}
}
