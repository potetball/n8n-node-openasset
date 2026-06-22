import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { buildDisplayFieldsQueryParameter, displayFieldsProperty } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForEmployeeGet = {
	resource: ['employee'],
	operation: ['get'],
};

export const employeeGetDescription: INodeProperties[] = [
	{
		displayName: 'Employee ID',
		name: 'employeeId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForEmployeeGet,
		},
		default: '',
	},
	displayFieldsProperty({
		show: showOnlyForEmployeeGet,
	}),
];

export async function getEmployee(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const employeeId = this.getNodeParameter('employeeId', itemIndex) as string;
	const displayFields = this.getNodeParameter('displayFields', itemIndex, '');

	return (await openAssetApiRequest.call(
		this,
		'GET',
		`/Employees/${employeeId}`,
		undefined,
		buildDisplayFieldsQueryParameter(displayFields),
	)) as IDataObject;
}