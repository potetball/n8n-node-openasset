const assert = require('node:assert/strict');
const { test } = require('node:test');
const { NodeApiError, NodeOperationError } = require('n8n-workflow');
const { OpenAsset } = require('../dist/nodes/OpenAsset/OpenAsset.node');

const node = {
	id: 'openasset-test',
	name: 'OpenAsset',
	type: 'openAsset',
	typeVersion: 1,
	position: [0, 0],
	parameters: {},
};

function response(body, statusCode = 200) {
	return { body, statusCode, headers: {} };
}

function context(
	request,
	{
		continueOnFail = false,
		items = 1,
		parameters = {},
	} = {},
) {
	const nodeParameters = {
		resource: 'project',
		operation: 'update',
		projectId: '123',
		body: { name: 'Updated' },
		...parameters,
	};
	return {
		getNode: () => node,
		getInputData: () => Array.from({ length: items }, () => ({ json: {} })),
		getNodeParameter: (name) => nodeParameters[name],
		getCredentials: async () => ({ clientDomain: 'example' }),
		continueOnFail: () => continueOnFail,
		helpers: { httpRequestWithAuthentication: request },
	};
}

for (const [name, body] of [
	['message', { message: 'Project code already exists' }],
	['nested field errors', { errors: { code: ['Must be unique'], name: ['Required'] } }],
	['error array', [{ error_message: 'Invalid project', field: 'code' }]],
	['JSON string', '{"errors":[{"message":"Invalid project code"}]}'],
	['plain text', 'Project code must be unique'],
]) {
	test(`Project Update exposes ${name} and preserves API error metadata`, async () => {
		const executeContext = context(async () => response(body, 400), { items: 2 });
		await assert.rejects(OpenAsset.prototype.execute.call(executeContext), (actual) => {
			assert.ok(actual instanceof NodeApiError);
			assert.equal(actual.httpCode, '400');
			assert.equal(actual.context.itemIndex, 0);
			assert.match(actual.description, /PUT \/Projects\/123 failed \(HTTP 400\)/);
			assert.ok(actual.description.includes(
				typeof body === 'string' ? body : JSON.stringify(body, null, 2),
			));
			return true;
		});
	});
}

for (const status of [302, 401, 403, 404, 429, 500]) {
	test(`preserves HTTP ${status} errors`, async () => {
		await assert.rejects(
			OpenAsset.prototype.execute.call(context(async () =>
				response({ message: `OpenAsset error ${status}` }, status))),
			(actual) => actual instanceof NodeApiError && actual.httpCode === String(status) &&
				actual.description.includes(`OpenAsset error ${status}`),
		);
	});
}

test('empty responses explicitly report missing server details', async () => {
	for (const body of [undefined, null, '']) {
		await assert.rejects(
			OpenAsset.prototype.execute.call(context(async () => response(body, 400))),
			(actual) => actual.description.includes('OpenAsset returned no response body.') &&
				actual.description.includes('PUT /Projects/123'),
		);
	}
});

test('network errors preserve n8n diagnostics without inventing an HTTP status', async () => {
	const error = new NodeApiError(node, { message: 'Connection timed out', code: 'ETIMEDOUT' });
	const message = error.message;
	const httpCode = error.httpCode;
	await assert.rejects(
		OpenAsset.prototype.execute.call(context(async () => { throw error; })),
		(actual) => actual === error && actual.httpCode === httpCode &&
			actual.message === message,
	);
});

test('Continue On Fail retains response details and pairing and processes later items', async () => {
	let calls = 0;
	const result = await OpenAsset.prototype.execute.call(context(async () => {
		if (calls++ === 0) return response({ errors: { code: ['Must be unique'] } }, 400);
		return response({ id: 123 });
	}, { continueOnFail: true, items: 2 }));
	assert.equal(result[0][0].json.error, 'OpenAsset request failed (HTTP 400)');
	assert.match(result[0][0].json.description, /Must be unique/);
	assert.equal(result[0][0].json.httpCode, '400');
	assert.equal(result[0][0].pairedItem, 0);
	assert.deepEqual(result[0][1], { json: { id: 123 }, pairedItem: 1 });
});

test('failing later items retain their input index', async () => {
	let calls = 0;
	await assert.rejects(
		OpenAsset.prototype.execute.call(context(async () => {
			if (calls++ === 0) return response({ id: 123 });
			return response({ message: 'Invalid project' }, 400);
		}, { items: 2 })),
		(actual) => actual instanceof NodeApiError && actual.context.itemIndex === 1,
	);
});

test('local validation remains a NodeOperationError and does not make a request', async () => {
	await assert.rejects(
		OpenAsset.prototype.execute.call(context(async () => {
			assert.fail('Should not make a request');
		}, { parameters: { body: {} } })),
		(error) => error instanceof NodeOperationError &&
			error.message.includes('Add at least one field to update') &&
			error.context.itemIndex === 0,
	);
});

test('successful requests keep the existing URL, authentication, body, and output', async () => {
	const result = await OpenAsset.prototype.execute.call(context(async (credentials, options) => {
		assert.equal(credentials, 'openAssetApi');
		assert.equal(options.url, 'https://example.openasset.com/REST/1/Projects/123');
		assert.equal(options.method, 'PUT');
		assert.deepEqual(options.body, { name: 'Updated' });
		assert.equal(options.json, true);
		assert.equal(options.returnFullResponse, true);
		assert.equal(options.ignoreHttpStatusErrors, true);
		return response({ id: 123, name: 'Updated' });
	}));
	assert.deepEqual(result, [[{ json: { id: 123, name: 'Updated' }, pairedItem: 0 }]]);
});

test('Project Keyword Create sends the supplied body to the Project Keywords endpoint', async () => {
	const body = { name: 'Project keyword', project_keyword_category_id: 5 };
	const result = await OpenAsset.prototype.execute.call(context(async (credentials, options) => {
		assert.equal(credentials, 'openAssetApi');
		assert.equal(options.url, 'https://example.openasset.com/REST/1/ProjectKeywords');
		assert.equal(options.method, 'POST');
		assert.deepEqual(options.body, body);
		assert.equal(options.json, true);
		return response({ id: 456, ...body });
	}, {
		parameters: {
			resource: 'projectKeyword',
			operation: 'create',
			body,
		},
	}));
	assert.deepEqual(result, [[{ json: { id: 456, ...body }, pairedItem: 0 }]]);
});
