import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function openAssetApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body?: IDataObject,
	query?: IDataObject,
) {
	const credentials = await this.getCredentials('openAssetApi');
	const clientDomain = String(credentials.clientDomain ?? '').trim();
	const normalizedDomain = clientDomain
		.replace(/^https?:\/\//, '')
		.replace(/\.openasset\.com\/?$/i, '');
	const normalizedResource = resource.replace(/^\/+/, '');
	const url = new URL(
		normalizedResource,
		`https://${normalizedDomain}.openasset.com/REST/1/`,
	).toString();

	const options: IHttpRequestOptions = {
		method,
		url,
		body,
		qs: query,
		json: true,
		returnFullResponse: true,
		ignoreHttpStatusErrors: true,
	};

	const response: { statusCode: number; body: IDataObject | IDataObject[] | string | null } =
		await this.helpers.httpRequestWithAuthentication.call(this, 'openAssetApi', options);

	if (response.statusCode < 200 || response.statusCode >= 300) {
		const details =
			typeof response.body === 'string'
				? response.body
				: response.body == null
					? ''
					: JSON.stringify(response.body, null, 2);

		throw new NodeApiError(this.getNode(), { statusCode: response.statusCode }, {
			message: `OpenAsset request failed (HTTP ${response.statusCode})`,
			httpCode: String(response.statusCode),
			description: [
				`${method} /${normalizedResource} failed (HTTP ${response.statusCode}).`,
				details || 'OpenAsset returned no response body.',
			].join('\n'),
		});
	}

	return response.body;
}