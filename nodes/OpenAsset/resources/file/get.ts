import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForFileGet = {
	resource: ['file'],
	operation: ['get'],
};

export const fileGetDescription: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForFileGet,
		},
		default: '',
	},
];

export async function getFile(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const fileId = this.getNodeParameter('fileId', itemIndex) as string;

	return (await openAssetApiRequest.call(this, 'GET', `/Files/${fileId}`)) as IDataObject;
}