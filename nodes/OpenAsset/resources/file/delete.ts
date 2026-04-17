import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForFileDelete = {
	resource: ['file'],
	operation: ['delete'],
};

export const fileDeleteDescription: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForFileDelete,
		},
		default: '',
	},
];

export async function deleteFile(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const fileId = this.getNodeParameter('fileId', itemIndex) as string;

	await openAssetApiRequest.call(this, 'DELETE', `/Files/${fileId}`);

	return { success: true };
}