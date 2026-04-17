import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectKeywordUpdate = {
	resource: ['projectKeyword'],
	operation: ['update'],
};

export const projectKeywordUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project Keyword ID',
		name: 'projectKeywordId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForProjectKeywordUpdate,
		},
		default: '',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForProjectKeywordUpdate,
		},
		default: '{}',
		description: 'Fields to update on the project keyword, for example {"name":"Updated Name"}',
	},
];

export async function updateProjectKeyword(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const projectKeywordId = this.getNodeParameter('projectKeywordId', itemIndex) as string;
	const body = this.getNodeParameter('body', itemIndex) as IDataObject;

	return (await openAssetApiRequest.call(
		this,
		'PUT',
		`/ProjectKeywords/${projectKeywordId}`,
		body,
	)) as IDataObject;
}