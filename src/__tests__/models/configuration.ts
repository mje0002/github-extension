import { Configuration } from "../../lib/models/configuration";

test("Configuration Model: Base Test for Configuration", () => {
	const model = new Configuration({ personal_access_token: 'aklsdjfds;kfj' })
	expect(model.personal_access_token).toBe('aklsdjfds;kfj');
});

test("Configuration Model: No Playload for Configuration", () => {
	const model = new Configuration({});
	expect(model.personal_access_token).toBe('');
});
