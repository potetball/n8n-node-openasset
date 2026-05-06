import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectGet = {
	resource: ['project'],
	operation: ['get'],
};

export const projectGetDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		displayOptions: {
			show: showOnlyForProjectGet,
		},
		default: '',
		description: 'Optional. When set, the request targets a specific project by ID.',
	},
	{
		displayName: 'Query Parameters',
		name: 'queryParameters',
		type: 'json',
		displayOptions: {
			show: showOnlyForProjectGet,
		},
		default: '{}',
		description:
			'Optional query string filters. Leave Project ID empty to query the Projects endpoint, for example {"code":"PRJ-1001"}.',
	},
];

export async function getProject(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const projectId = (this.getNodeParameter('projectId', itemIndex) as string).trim();
	const queryParameters = this.getNodeParameter('queryParameters', itemIndex) as IDataObject;
	const resource = projectId === '' ? '/Projects' : `/Projects/${projectId}`;

	return (await openAssetApiRequest.call(
		this,
		'GET',
		resource,
		undefined,
		queryParameters,
	)) as IDataObject | IDataObject[];
}