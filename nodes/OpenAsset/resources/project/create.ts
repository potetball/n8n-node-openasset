import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectCreate = {
	resource: ['project'],
	operation: ['create'],
};

export const projectCreateDescription: INodeProperties[] = [
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForProjectCreate,
		},
		default: '{}',
	},
];

export async function createProject(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const body = this.getNodeParameter('body', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(this, 'POST', '/Projects', body)) as IDataObject;
}