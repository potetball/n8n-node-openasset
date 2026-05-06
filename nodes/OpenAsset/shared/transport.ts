import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';

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
	const url = new URL(resource, `https://${normalizedDomain}.openasset.com/REST/1/`).toString();

	const options: IHttpRequestOptions = {
		method,
		url,
		body,
		qs: query,
		json: true,
	};

	return this.helpers.httpRequestWithAuthentication.call(this, 'openAssetApi', options);
}