import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { buildDisplayFieldsQueryParameter } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForFieldList = {
	resource: ['field'],
	operation: ['list'],
};

export const fieldListDescription: INodeProperties[] = [
	{
		displayName: 'Display Fields',
		name: 'displayFields',
		type: 'string',
		displayOptions: {
			show: showOnlyForFieldList,
		},
		default: '',
		description:
			'Comma-separated list of response field names to return, for example name,created,updated',
	},
];

export async function getFields(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const queryParameters = {
		limit: 0,
		...buildDisplayFieldsQueryParameter(this.getNodeParameter('displayFields', itemIndex, '')),
	};

	return (await openAssetApiRequest.call(
		this,
		'GET',
		'/Fields',
		undefined,
		queryParameters,
	)) as IDataObject | IDataObject[];
}