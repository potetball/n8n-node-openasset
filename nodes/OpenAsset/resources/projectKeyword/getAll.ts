import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { displayFieldsProperty, withDisplayFieldsQueryParameters } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectKeywordList = {
	resource: ['projectKeyword'],
	operation: ['list'],
};

export const projectKeywordListDescription: INodeProperties[] = [
	displayFieldsProperty({
		show: showOnlyForProjectKeywordList,
	}),
];

export async function getProjectKeywords(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const displayFields = this.getNodeParameter('displayFields', itemIndex, '');

	return (await openAssetApiRequest.call(
		this,
		'GET',
		'/ProjectKeywords',
		undefined,
		withDisplayFieldsQueryParameters(
			{
				limit: 0,
			},
			displayFields,
		),
	)) as IDataObject | IDataObject[];
}