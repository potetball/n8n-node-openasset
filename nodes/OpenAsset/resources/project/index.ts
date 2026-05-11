import type { INodeProperties } from 'n8n-workflow';

import { createProject, projectCreateDescription } from './create';
import { getProjects, projectListDescription } from './getAll';
import { getProject, projectGetDescription } from './get';
import { projectUpdateDescription, updateProject } from './update';

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
			{
				name: 'Update',
				value: 'update',
				action: 'Update a project',
				description: 'Update a project record',
			},
		],
		default: 'get',
	},
	...projectGetDescription,
	...projectListDescription,
	...projectCreateDescription,
	...projectUpdateDescription,
];

export const projectOperations = {
	create: createProject,
	get: getProject,
	list: getProjects,
	update: updateProject,
};