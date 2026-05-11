import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectKeywordGet = {
	resource: ['projectKeyword'],
	operation: ['get'],
};

export const projectKeywordGetDescription: INodeProperties[] = [
	{
		displayName: 'Project Keyword ID',
		name: 'projectKeywordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForProjectKeywordGet,
		},
		default: '',
	},
];

export async function getProjectKeyword(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const projectKeywordId = this.getNodeParameter('projectKeywordId', itemIndex) as string;

	return (await openAssetApiRequest.call(
		this,
		'GET',
		`/ProjectKeywords/${projectKeywordId}`,
	)) as IDataObject;
}