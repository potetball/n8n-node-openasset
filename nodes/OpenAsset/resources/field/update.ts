import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForFieldUpdate = {
	resource: ['field'],
	operation: ['update'],
};

export const fieldUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Field ID',
		name: 'fieldId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForFieldUpdate,
		},
		default: '',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForFieldUpdate,
		},
		default: '{}',
		description: 'Fields to update on the field, for example {"name":"Updated Name"}',
	},
];

export async function updateField(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const fieldId = this.getNodeParameter('fieldId', itemIndex) as string;
	const body = this.getNodeParameter('body', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(this, 'PUT', `/Fields/${fieldId}`, body)) as IDataObject;
}