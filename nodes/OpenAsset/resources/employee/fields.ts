import type { IDataObject, INodeProperties } from 'n8n-workflow';

export const employeeFieldOptions: INodeProperties[] = [
	{
		displayName: 'Code',
		name: 'code',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Descriptor',
		name: 'descriptor',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		placeholder: 'name@email.com',
	},
	{
		displayName: 'First Name',
		name: 'first_name',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Last Name',
		name: 'last_name',
		type: 'string',
		default: '',
	},
	{
		displayName: 'Snhetta Studio',
		name: 'snhetta_studio',
		type: 'string',
		default: '',
	},
];

export function buildEmployeeBody(employeeFields: IDataObject): IDataObject {
	return Object.fromEntries(
		Object.entries(employeeFields).filter(([, value]) => value !== '' && value !== undefined),
	) as IDataObject;
}