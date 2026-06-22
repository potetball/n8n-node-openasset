import type { INodeProperties } from 'n8n-workflow';

import {
	createProjectCategoryKeyword,
	projectCategoryKeywordCreateDescription,
} from './create';
import { getProjectCategoryKeyword, projectCategoryKeywordGetDescription } from './get';
import {
	getProjectCategoryKeywords,
	projectCategoryKeywordListDescription,
} from './getAll';

const showOnlyForProjectCategoryKeywords = {
	resource: ['projectCategoryKeyword'],
};

export const projectCategoryKeywordDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForProjectCategoryKeywords,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a project category keyword',
				description: 'Get a single project category keyword by ID',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a project category keyword',
				description: 'Create a project category keyword record',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List project category keywords',
				description: 'List project category keyword records',
			},
		],
		default: 'get',
	},
	...projectCategoryKeywordGetDescription,
	...projectCategoryKeywordListDescription,
	...projectCategoryKeywordCreateDescription,
];

export const projectCategoryKeywordOperations = {
	create: createProjectCategoryKeyword,
	get: getProjectCategoryKeyword,
	list: getProjectCategoryKeywords,
};