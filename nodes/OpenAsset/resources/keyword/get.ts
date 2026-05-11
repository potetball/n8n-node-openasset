import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForKeywordGet = {
	resource: ['keyword'],
	operation: ['get'],
};

export const keywordGetDescription: INodeProperties[] = [
	{
		displayName: 'Keyword ID',
		name: 'keywordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForKeywordGet,
		},
		default: '',
	},
];

export async function getKeyword(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const keywordId = this.getNodeParameter('keywordId', itemIndex) as string;

	return (await openAssetApiRequest.call(this, 'GET', `/Keywords/${keywordId}`)) as IDataObject;
}