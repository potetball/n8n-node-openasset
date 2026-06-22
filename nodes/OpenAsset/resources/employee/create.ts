import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';
import { buildEmployeeBody, employeeFieldOptions } from './fields';

const showOnlyForEmployeeCreate = {
	resource: ['employee'],
	operation: ['create'],
};

export const employeeCreateDescription: INodeProperties[] = [
	{
		displayName: 'Employee Fields',
		name: 'employeeFields',
		type: 'collection',
		required: true,
		displayOptions: {
			show: showOnlyForEmployeeCreate,
		},
		default: {},
		placeholder: 'Add Field',
		options: employeeFieldOptions,
		description: 'Fields to set on the employee record',
	},
];

export async function createEmployee(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const body = buildEmployeeBody(
		(this.getNodeParameter('employeeFields', itemIndex, {}) as IDataObject) ?? {},
	);

	if (Object.keys(body).length === 0) {
		throw new NodeOperationError(this.getNode(), 'Add at least one employee field', {
			itemIndex,
		});
	}

	return (await openAssetApiRequest.call(this, 'POST', '/Employees', body)) as IDataObject;
}