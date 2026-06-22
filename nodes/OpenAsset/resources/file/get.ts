import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { buildDisplayFieldsQueryParameter } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForFileGet = {
	resource: ['file'],
	operation: ['get'],
};

export const fileGetDescription: INodeProperties[] = [
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForFileGet,
		},
		default: '',
	},
	{
		displayName: 'Display Fields',
		name: 'displayFields',
		type: 'string',
		displayOptions: {
			show: showOnlyForFileGet,
		},
		default: '',
		description:
			'Comma-separated list of response field names to return, for example name,created,updated',
	},
];

export async function getFile(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const fileId = this.getNodeParameter('fileId', itemIndex) as string;
	const queryParameters = buildDisplayFieldsQueryParameter(
		this.getNodeParameter('displayFields', itemIndex, ''),
	);

	return (await openAssetApiRequest.call(
		this,
		'GET',
		`/Files/${fileId}`,
		undefined,
		queryParameters,
	)) as IDataObject;
}