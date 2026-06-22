import type { INodeProperties } from 'n8n-workflow';

import { createFile, fileCreateDescription } from './create';
import { deleteFile, fileDeleteDescription } from './delete';
import { getFiles, fileListDescription } from './getAll';
import { getFile, fileGetDescription } from './get';

const showOnlyForFiles = {
	resource: ['file'],
};

export const fileDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForFiles,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a file',
				description: 'Get a single file by ID',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a file',
				description: 'Create a file record',
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a file',
				description: 'Delete a file by ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List files',
				description: 'List file records',
			},
		],
		default: 'get',
	},
	...fileGetDescription,
	...fileListDescription,
	...fileCreateDescription,
	...fileDeleteDescription,
];

export const fileOperations = {
	create: createFile,
	delete: deleteFile,
	get: getFile,
	list: getFiles,
};