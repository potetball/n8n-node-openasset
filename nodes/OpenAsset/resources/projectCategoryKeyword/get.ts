import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { buildDisplayFieldsQueryParameter, displayFieldsProperty } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectCategoryKeywordGet = {
	resource: ['projectCategoryKeyword'],
	operation: ['get'],
};

export const projectCategoryKeywordGetDescription: INodeProperties[] = [
	{
		displayName: 'Project Category Keyword ID',
		name: 'projectCategoryKeywordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForProjectCategoryKeywordGet,
		},
		default: '',
	},
	displayFieldsProperty({
		show: showOnlyForProjectCategoryKeywordGet,
	}),
];

export async function getProjectCategoryKeyword(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const projectCategoryKeywordId = this.getNodeParameter(
		'projectCategoryKeywordId',
		itemIndex,
	) as string;
	const displayFields = this.getNodeParameter('displayFields', itemIndex, '');

	return (await openAssetApiRequest.call(
		this,
		'GET',
		`/ProjectCategoryKeywords/${projectCategoryKeywordId}`,
		undefined,
		buildDisplayFieldsQueryParameter(displayFields),
	)) as IDataObject;
}