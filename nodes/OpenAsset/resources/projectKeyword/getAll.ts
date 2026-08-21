import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { displayFieldsProperty, withDisplayFieldsQueryParameters } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectKeywordList = {
	resource: ['projectKeyword'],
	operation: ['list'],
};

export const projectKeywordListDescription: INodeProperties[] = [
	{
		displayName: 'Query Parameters',
		name: 'queryParameters',
		type: 'collection',
		displayOptions: {
			show: showOnlyForProjectKeywordList,
		},
		default: {},
		placeholder: 'Add Query Parameter',
		options: [
			{
				displayName: 'Project Keyword Category',
				name: 'project_keyword_category_id',
				type: 'string',
				default: '',
				description: 'Filter project keywords by linked project keyword category ID',
			},
		],
		description: 'Optional query string filters for the Project Keywords endpoint',
	},
	displayFieldsProperty({
		show: showOnlyForProjectKeywordList,
	}),
];

export async function getProjectKeywords(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const displayFields = this.getNodeParameter('displayFields', itemIndex, '');
	const queryParameters = withDisplayFieldsQueryParameters(
		{
			limit: 0,
			...((this.getNodeParameter('queryParameters', itemIndex, {}) as IDataObject) ?? {}),
		},
		displayFields,
	);

	return (await openAssetApiRequest.call(
		this,
		'GET',
		'/ProjectKeywords',
		undefined,
		queryParameters,
	)) as IDataObject | IDataObject[];
}