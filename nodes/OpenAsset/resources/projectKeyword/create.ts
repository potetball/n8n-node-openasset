import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectKeywordCreate = {
	resource: ['projectKeyword'],
	operation: ['create'],
};

export const projectKeywordCreateDescription: INodeProperties[] = [
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForProjectKeywordCreate,
		},
		default: '{}',
	},
];

export async function createProjectKeyword(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const body = this.getNodeParameter('body', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(
		this,
		'POST',
		'/ProjectKeywords',
		body,
	)) as IDataObject;
}
