import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

async function openAssetApiRequest(
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

export class OpenAsset implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenAsset',
		name: 'openAsset',
		icon: 'file:../../icons/github.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'OpenAsset Node',
		defaults: {
			name: 'OpenAsset',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		requestDefaults: {
			baseURL: '=https://{{$credentials.clientDomain}}.openasset.com/REST/1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		credentials: [
			{
				name: 'openAssetApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Project',
						value: 'project',
					},
				],
				default: 'file',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['file'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
					},
					{
						name: 'Create',
						value: 'create',
					},
					{
						name: 'Delete',
						value: 'delete',
					},
					{
						name: 'List',
						value: 'list',
					},
				],
				default: 'get',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
					},
					{
						name: 'Create',
						value: 'create',
					},
					{
						name: 'List',
						value: 'list',
					},
				],
				default: 'get',
			},
			{
				displayName: 'File ID',
				name: 'fileId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['get', 'delete'],
					},
				},
				default: '',
			},
			{
				displayName: 'Project ID',
				name: 'projectId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get'],
					},
				},
				default: '',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['file'],
						operation: ['create'],
					},
				},
				default: '{}',
			},
			{
				displayName: 'Body',
				name: 'body',
				type: 'json',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['create'],
					},
				},
				default: '{}',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				let responseData: IDataObject | IDataObject[];

				if (resource === 'file') {
					if (operation === 'get') {
						const fileId = this.getNodeParameter('fileId', i) as string;
						responseData = (await openAssetApiRequest.call(this, 'GET', `/Files/${fileId}`)) as IDataObject;
					} else if (operation === 'create') {
						const body = this.getNodeParameter('body', i) as IDataObject;
						responseData = (await openAssetApiRequest.call(this, 'POST', '/Files', body)) as IDataObject;
					} else if (operation === 'delete') {
						const fileId = this.getNodeParameter('fileId', i) as string;
						await openAssetApiRequest.call(this, 'DELETE', `/Files/${fileId}`);
						responseData = { success: true };
					} else if (operation === 'list') {
						responseData = (await openAssetApiRequest.call(this, 'GET', '/Files')) as IDataObject | IDataObject[];
					} else {
						throw new NodeOperationError(this.getNode(), `Unsupported file operation: ${operation}`, {
							itemIndex: i,
						});
					}
				} else if (resource === 'project') {
					if (operation === 'get') {
						const projectId = this.getNodeParameter('projectId', i) as string;
						responseData = (await openAssetApiRequest.call(this, 'GET', `/Projects/${projectId}`)) as IDataObject;
					} else if (operation === 'create') {
						const body = this.getNodeParameter('body', i) as IDataObject;
						responseData = (await openAssetApiRequest.call(this, 'POST', '/Projects', body)) as IDataObject;
					} else if (operation === 'list') {
						responseData = (await openAssetApiRequest.call(this, 'GET', '/Projects')) as IDataObject | IDataObject[];
					} else {
						throw new NodeOperationError(this.getNode(), `Unsupported project operation: ${operation}`, {
							itemIndex: i,
						});
					}
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`, {
						itemIndex: i,
					});
				}

				if (Array.isArray(responseData)) {
					returnData.push({ json: { data: responseData }, pairedItem: i });
				} else {
					returnData.push({ json: responseData, pairedItem: i });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: i,
					});
					continue;
				}

				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
