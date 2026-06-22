import type { INodeProperties } from 'n8n-workflow';

import { createEmployee, employeeCreateDescription } from './create';
import { getEmployee, employeeGetDescription } from './get';
import { getEmployees, employeeListDescription } from './getAll';
import { employeeUpdateDescription, updateEmployee } from './update';

const showOnlyForEmployees = {
	resource: ['employee'],
};

export const employeeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForEmployees,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get an employee',
				description: 'Get a single employee by ID',
			},
			{
				name: 'Create',
				value: 'create',
				action: 'Create an employee',
				description: 'Create an employee record',
			},
			{
				name: 'List',
				value: 'list',
				action: 'List employees',
				description: 'List employee records',
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update an employee',
				description: 'Update a single employee by ID',
			},
		],
		default: 'get',
	},
	...employeeGetDescription,
	...employeeListDescription,
	...employeeCreateDescription,
	...employeeUpdateDescription,
];

export const employeeOperations = {
	create: createEmployee,
	get: getEmployee,
	list: getEmployees,
	update: updateEmployee,
};