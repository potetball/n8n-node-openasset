import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectList = {
	resource: ['project'],
	operation: ['list'],
};

export const projectListDescription: INodeProperties[] = [
	{
		displayName: 'Query Parameters',
		name: 'queryParameters',
		type: 'json',
		displayOptions: {
			show: showOnlyForProjectList,
		},
		default: '{}',
		description:
			'Optional query string filters for the request, for example {"alive":1,"name":"Example Project"}',
	},
];

export async function getProjects(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const queryParameters = this.getNodeParameter('queryParameters', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(
		this,
		'GET',
		'/Projects',
		undefined,
		queryParameters,
	)) as IDataObject | IDataObject[];
}