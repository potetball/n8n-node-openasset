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
];

export async function getProject(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const projectId = this.getNodeParameter('projectId', itemIndex) as string;

	return (await openAssetApiRequest.call(this, 'GET', `/Projects/${projectId}`)) as IDataObject;
}