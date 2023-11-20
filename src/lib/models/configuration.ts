
export type ConfigSchema = {
	personal_access_token: string | undefined;
	has_assigned: boolean | undefined;
}

export type keyOfConfig = keyof ConfigSchema;

export class Configuration implements ConfigSchema {
	personal_access_token: string;
	has_assigned: boolean;

	constructor(data: any) {
		this.personal_access_token = data.personal_access_token ?? '';
		this.has_assigned = data.has_assigned ?? false;
	}

}