import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectCategoryKeywordCreate = {
	resource: ['projectCategoryKeyword'],
	operation: ['create'],
};

export const projectCategoryKeywordCreateDescription: INodeProperties[] = [
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForProjectCategoryKeywordCreate,
		},
		default: '{}',
	},
];

export async function createProjectCategoryKeyword(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const body = this.getNodeParameter('body', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(
		this,
		'POST',
		'/ProjectKeywordCategories',
		body,
	)) as IDataObject;
}