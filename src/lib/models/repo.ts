import { Platform } from './pat-entry';
import { UserRepo } from "./github/UserRepo"

export type RepoSchema = UserRepo & {
	isEnabled: boolean;
	pat_id: string;
	platform: Platform;
}

export class Repo implements RepoSchema {
	id: number;
	name: string;
	full_name: string;
	url: string;
	open_issues_count: number = 0;
	open_issues: number = 0;
	isEnabled: boolean = false;
	pat_id: string = '';
	platform: Platform = 'github';

	constructor(data: any) {
		this.id = data.id ?? this.randomId();
		this.name = data.name ?? '';
		this.full_name = data.full_name ?? '';
		this.url = data.html_url ?? data.url ?? '';
		this.open_issues = data.open_issues ?? 0;
		this.open_issues_count = data.open_issues_count ?? 0;
		this.isEnabled = data.isEnabled ?? false;
		this.pat_id = data.pat_id ?? '';
		this.platform = data.platform ?? 'github';
	}

	private randomId() {
		var buf = new Uint32Array(1);
		crypto.getRandomValues(buf);

		return buf[0] * -1;
	}

}