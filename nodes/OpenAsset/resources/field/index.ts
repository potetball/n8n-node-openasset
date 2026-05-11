import type { INodeProperties } from 'n8n-workflow';

import { getField, fieldGetDescription } from './get';
import { getFields } from './getAll';
import { fieldUpdateDescription, updateField } from './update';

const showOnlyForFields = {
	resource: ['field'],
};

export const fieldDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForFields,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a field',
				description: 'Get a single field by ID',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List fields',
				description: 'List field records',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a field',
				description: 'Update a single field by ID',
			},
		],
		default: 'get',
	},
	...fieldGetDescription,
	...fieldUpdateDescription,
];

export const fieldOperations = {
	get: getField,
	list: getFields,
	update: updateField,
};