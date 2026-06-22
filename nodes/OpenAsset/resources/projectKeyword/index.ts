import type { INodeProperties } from 'n8n-workflow';

import { getProjectKeyword, projectKeywordGetDescription } from './get';
import { getProjectKeywords, projectKeywordListDescription } from './getAll';
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
				name: 'Get',
				value: 'get',
				action: 'Get a project keyword',
				description: 'Get a single project keyword by ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List project keywords',
				description: 'List project keyword records',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a project keyword',
				description: 'Update a single project keyword by ID',
			},
		],
		default: 'update',
	},
	...projectKeywordGetDescription,
	...projectKeywordListDescription,
	...projectKeywordUpdateDescription,
];

export const projectKeywordOperations = {
	get: getProjectKeyword,
	list: getProjectKeywords,
	update: updateProjectKeyword,
};