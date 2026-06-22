import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { displayFieldsProperty, withDisplayFieldsQueryParameters } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForEmployeeList = {
	resource: ['employee'],
	operation: ['list'],
};

export const employeeListDescription: INodeProperties[] = [
	displayFieldsProperty({
		show: showOnlyForEmployeeList,
	}),
];

export async function getEmployees(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const displayFields = this.getNodeParameter('displayFields', itemIndex, '');

	return (await openAssetApiRequest.call(
		this,
		'GET',
		'/Employees',
		undefined,
		withDisplayFieldsQueryParameters(
			{
				limit: 0,
			},
			displayFields,
		),
	)) as IDataObject | IDataObject[];
}