import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { buildDisplayFieldsQueryParameter } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForFileList = {
	resource: ['file'],
	operation: ['list'],
};

export const fileListDescription: INodeProperties[] = [
	{
		displayName: 'Display Fields',
		name: 'displayFields',
		type: 'string',
		displayOptions: {
			show: showOnlyForFileList,
		},
		default: '',
		description:
			'Comma-separated list of response field names to return, for example name,created,updated',
	},
];

export async function getFiles(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const queryParameters = buildDisplayFieldsQueryParameter(
		this.getNodeParameter('displayFields', itemIndex, ''),
	);

	return (await openAssetApiRequest.call(
		this,
		'GET',
		'/Files',
		undefined,
		queryParameters,
	)) as IDataObject | IDataObject[];
}