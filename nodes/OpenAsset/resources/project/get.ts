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
		required: true,
		displayOptions: {
			show: showOnlyForProjectGet,
		},
		default: '',
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
			'Optional query string filters for the request, for example {"alive":1,"name":"Example Project"}',
	},
];

export async function getProject(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const projectId = this.getNodeParameter('projectId', itemIndex) as string;
	const queryParameters = this.getNodeParameter('queryParameters', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(
		this,
		'GET',
		`/Projects/${projectId}`,
		undefined,
		queryParameters,
	)) as IDataObject;
}