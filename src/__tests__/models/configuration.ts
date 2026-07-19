import { ConfigSchema } from "../../lib/models/configuration";
import { PATEntry } from "../../lib/models/pat-entry";

const makeToken = (overrides?: Partial<PATEntry>): PATEntry => ({
	id: 'test-id',
	label: 'Test Token',
	platform: 'github',
	token: 'ghp_test123',
	...overrides,
});

test("ConfigSchema: tokens array is preserved", () => {
	const token = makeToken();
	const schema: ConfigSchema = { tokens: [token] };
	expect(schema.tokens).toHaveLength(1);
	expect(schema.tokens[0].token).toBe('ghp_test123');
});

test("ConfigSchema: empty tokens array", () => {
	const schema: ConfigSchema = { tokens: [] };
	expect(schema.tokens).toHaveLength(0);
});

test("ConfigSchema: supports multiple platforms", () => {
	const schema: ConfigSchema = {
		tokens: [
			makeToken({ id: 'a', platform: 'github' }),
			makeToken({ id: 'b', platform: 'gitlab' }),
		],
	};
	expect(schema.tokens[0].platform).toBe('github');
	expect(schema.tokens[1].platform).toBe('gitlab');
});
