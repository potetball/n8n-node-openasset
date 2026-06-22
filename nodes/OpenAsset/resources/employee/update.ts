import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';
import { buildEmployeeBody, employeeFieldOptions } from './fields';

const showOnlyForEmployeeUpdate = {
	resource: ['employee'],
	operation: ['update'],
};

export const employeeUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Employee ID',
		name: 'employeeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForEmployeeUpdate,
		},
		default: '',
	},
	{
		displayName: 'Employee Fields',
		name: 'employeeFields',
		type: 'collection',
		required: true,
		displayOptions: {
			show: showOnlyForEmployeeUpdate,
		},
		default: {},
		placeholder: 'Add Field',
		options: employeeFieldOptions,
		description: 'Fields to update on the employee record',
	},
];

export async function updateEmployee(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const employeeId = this.getNodeParameter('employeeId', itemIndex) as string;
	const body = buildEmployeeBody(
		(this.getNodeParameter('employeeFields', itemIndex, {}) as IDataObject) ?? {},
	);

	if (Object.keys(body).length === 0) {
		throw new NodeOperationError(this.getNode(), 'Add at least one employee field to update', {
			itemIndex,
		});
	}

	return (await openAssetApiRequest.call(
		this,
		'PUT',
		`/Employees/${employeeId}`,
		body,
	)) as IDataObject;
}