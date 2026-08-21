import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { displayFieldsProperty, withDisplayFieldsQueryParameters } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectCategoryKeywordList = {
	resource: ['projectCategoryKeyword'],
	operation: ['list'],
};

export const projectCategoryKeywordListDescription: INodeProperties[] = [
	displayFieldsProperty({
		show: showOnlyForProjectCategoryKeywordList,
	}),
];

export async function getProjectCategoryKeywords(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const displayFields = this.getNodeParameter('displayFields', itemIndex, '');

	return (await openAssetApiRequest.call(
		this,
		'GET',
		'/ProjectKeywordCategories',
		undefined,
		withDisplayFieldsQueryParameters(
			{
				limit: 0,
			},
			displayFields,
		),
	)) as IDataObject | IDataObject[];
}