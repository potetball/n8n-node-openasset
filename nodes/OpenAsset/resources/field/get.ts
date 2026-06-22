import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { buildDisplayFieldsQueryParameter } from '../../shared/queryParameters';
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
	{
		displayName: 'Display Fields',
		name: 'displayFields',
		type: 'string',
		displayOptions: {
			show: showOnlyForFieldGet,
		},
		default: '',
		description:
			'Comma-separated list of response field names to return, for example name,created,updated',
	},
];

export async function getField(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const fieldId = this.getNodeParameter('fieldId', itemIndex) as string;
	const queryParameters = buildDisplayFieldsQueryParameter(
		this.getNodeParameter('displayFields', itemIndex, ''),
	);

	return (await openAssetApiRequest.call(
		this,
		'GET',
		`/Fields/${fieldId}`,
		undefined,
		queryParameters,
	)) as IDataObject;
}