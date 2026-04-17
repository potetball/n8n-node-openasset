import type { INodeProperties } from 'n8n-workflow';

import { projectKeywordUpdateDescription, updateProjectKeyword } from './update';

const showOnlyForProjectKeywords = {
	resource: ['projectKeyword'],
};

export const projectKeywordDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForProjectKeywords,
		},
		options: [
			{
				name: 'Update',
				value: 'update',
				action: 'Update a project keyword',
				description: 'Update a single project keyword by ID',
			},
		],
		default: 'update',
	},
	...projectKeywordUpdateDescription,
];

export const projectKeywordOperations = {
	update: updateProjectKeyword,
};