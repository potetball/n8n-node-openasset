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
) {
	const options: IHttpRequestOptions = {
		method,
		url: resource,
		body,
		json: true,
	};

	return this.helpers.httpRequestWithAuthentication.call(this, 'openAssetApi', options);
}