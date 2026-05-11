import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForFieldGet = {
	resource: ['field'],
	operation: ['get'],
};

export const fieldGetDescription: INodeProperties[] = [
	{
		displayName: 'Field ID',
		name: 'fieldId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForFieldGet,
		},
		default: '',
	},
];

export async function getField(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const fieldId = this.getNodeParameter('fieldId', itemIndex) as string;

	return (await openAssetApiRequest.call(this, 'GET', `/Fields/${fieldId}`)) as IDataObject;
}