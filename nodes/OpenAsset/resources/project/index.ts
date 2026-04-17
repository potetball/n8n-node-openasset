import type { INodeProperties } from 'n8n-workflow';

import { createProject, projectCreateDescription } from './create';
import { getProjects } from './getAll';
import { getProject, projectGetDescription } from './get';

const showOnlyForProjects = {
	resource: ['project'],
};

export const projectDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForProjects,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a project',
				description: 'Get a single project by ID',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create a project',
				description: 'Create a project record',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List projects',
				description: 'List project records',
			},
		],
		default: 'get',
	},
	...projectGetDescription,
	...projectCreateDescription,
];

export const projectOperations = {
	create: createProject,
	get: getProject,
	list: getProjects,
};