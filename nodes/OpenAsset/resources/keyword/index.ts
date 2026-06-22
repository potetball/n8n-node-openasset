import type { INodeProperties } from 'n8n-workflow';

import { getKeyword, keywordGetDescription } from './get';
import { getKeywords, keywordListDescription } from './getAll';

const showOnlyForKeywords = {
	resource: ['keyword'],
};

export const keywordDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForKeywords,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a keyword',
				description: 'Get a single keyword by ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List keywords',
				description: 'List keyword records',
			},
		],
		default: 'get',
	},
	...keywordGetDescription,
	...keywordListDescription,
];

export const keywordOperations = {
	get: getKeyword,
	list: getKeywords,
};