import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForFileCreate = {
	resource: ['file'],
	operation: ['create'],
};

export const fileCreateDescription: INodeProperties[] = [
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForFileCreate,
		},
		default: '{}',
	},
];

export async function createFile(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const body = this.getNodeParameter('body', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(this, 'POST', '/Files', body)) as IDataObject;
}