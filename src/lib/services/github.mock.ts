import { GithubService } from "./github";
import { faker } from '@faker-js/faker';


type pullRequest = { pr_number: number, title: string, comments: number, update_at: Date, link: string, created_at: Date };

export class MockGithubService extends GithubService {

	constructor(personal_access: string) {
		super(personal_access);
	}

	async getAllRepoPullRequests(repos: string[]) {
		const createPullRequest = () => {
			const url = faker.internet.url({ protocol: 'http', appendSlash: false });
			return {
				pr_number: faker.number.int({ min: 1, max: 1000 }),
				title: faker.hacker.phrase(),
				comments: faker.number.int({ min: 0, max: 20 }),
				update_at: new Date(faker.date.between({ from: '2020-02-01T00:00:00.000Z', to: '2030-02-01T00:00:00.000Z' })),
				link: url,
				created_at: new Date(faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' })),
			};
		};
		return Object.fromEntries(
			repos.map(r => [r, Array.from({ length: 10 }, createPullRequest)])
		);
	}

	async getPullRequests(repo: string) {
		const pr_url = faker.internet.url({ protocol: 'http', appendSlash: false });

		const createPullRequest = (url: string) => {
			return {
				pr_number: faker.number.int({ min: 1, max: 1000 }),
				title: faker.hacker.phrase(),
				comments: faker.number.int({ min: 0, max: 20 }),
				update_at:
					new Date(faker.date.between({ from: '2020-02-01T00:00:00.000Z', to: '2030-02-01T00:00:00.000Z' })),
				link: url,
				created_at:
					new Date(faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' })),
			}
		}

		return Array.from({ length: 10 }, createPullRequest, pr_url);
	}
}