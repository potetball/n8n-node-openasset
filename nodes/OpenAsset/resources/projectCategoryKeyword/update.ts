import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectCategoryKeywordUpdate = {
	resource: ['projectCategoryKeyword'],
	operation: ['update'],
};

export const projectCategoryKeywordUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project Category Keyword ID',
		name: 'projectCategoryKeywordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForProjectCategoryKeywordUpdate,
		},
		default: '',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForProjectCategoryKeywordUpdate,
		},
		default: '{}',
		description: 'Fields to update on the project category keyword, for example {"name":"Updated Name"}',
	},
];

export async function updateProjectCategoryKeyword(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const projectCategoryKeywordId = this.getNodeParameter(
		'projectCategoryKeywordId',
		itemIndex,
	) as string;
	const body = this.getNodeParameter('body', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(
		this,
		'PUT',
		`/ProjectKeywordCategories/${projectCategoryKeywordId}`,
		body,
	)) as IDataObject;
}