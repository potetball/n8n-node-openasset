import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { displayFieldsProperty, withDisplayFieldsQueryParameters } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectList = {
	resource: ['project'],
	operation: ['list'],
};

export const projectListDescription: INodeProperties[] = [
	{
		displayName: 'Query Parameters',
		name: 'queryParameters',
		type: 'collection',
		displayOptions: {
			show: showOnlyForProjectList,
		},
		default: {},
		placeholder: 'Add Query Parameter',
		options: [
			{
				displayName: 'Alive',
				name: 'alive',
				type: 'options',
				default: '',
				options: [
					{
						name: 'Enabled',
						value: '1',
					},
					{
						name: 'Disabled',
						value: '0',
					},
				],
				description: 'Whether the project is enabled (1) or disabled (0)',
			},
			{
				displayName: 'Code',
				name: 'code',
				type: 'string',
				default: '',
				description: 'A unique code identifier for the project',
			},
			{
				displayName: 'Code Alias 1',
				name: 'code_alias_1',
				type: 'string',
				default: '',
				description: 'A secondary code for the project',
			},
			{
				displayName: 'Code Alias 2',
				name: 'code_alias_2',
				type: 'string',
				default: '',
				description: 'A tertiary code for the project',
			},
			{
				displayName: 'Created',
				name: 'created',
				type: 'string',
				default: '',
				description: 'Project creation time. Supports the raw API datetime format.',
			},
			{
				displayName: 'Dead Image Count',
				name: 'dead_image_count',
				type: 'string',
				default: '',
				description: 'Number of deleted images in the project. Operators are allowed.',
			},
			{
				displayName: 'ID',
				name: 'id',
				type: 'string',
				default: '',
				description: 'The project ID. Operators are allowed.',
			},
			{
				displayName: 'Latitude',
				name: 'latitude',
				type: 'string',
				default: '',
				description: 'Project latitude. Can be a specific value or a numeric operator.',
			},
			{
				displayName: 'Longitude',
				name: 'longitude',
				type: 'string',
				default: '',
				description: 'Project longitude. Can be a specific value or a numeric operator.',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'The project name',
			},
			{
				displayName: 'Name Alias 1',
				name: 'name_alias_1',
				type: 'string',
				default: '',
				description: 'A secondary project name',
			},
			{
				displayName: 'Name Alias 2',
				name: 'name_alias_2',
				type: 'string',
				default: '',
				description: 'A tertiary project name',
			},
			{
				displayName: 'Private Image Count',
				name: 'private_image_count',
				type: 'string',
				default: '',
				description: 'Number of level 2 access images. Operators are allowed.',
			},
			{
				displayName: 'Public Image Count',
				name: 'public_image_count',
				type: 'string',
				default: '',
				description: 'Number of level 1 access images. Operators are allowed.',
			},
			{
				displayName: 'Unapproved Image Count',
				name: 'unapproved_image_count',
				type: 'string',
				default: '',
				description: 'Number of images awaiting approval. Operators are allowed.',
			},
			{
				displayName: 'Updated',
				name: 'updated',
				type: 'string',
				default: '',
				description: 'Last modified time. Supports the raw API datetime format.',
			},
		],
		description: 'Optional query string filters for the Projects endpoint',
	},
	displayFieldsProperty({
		show: showOnlyForProjectList,
	}),
];

export async function getProjects(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject | IDataObject[]> {
	const displayFields = this.getNodeParameter('displayFields', itemIndex, '');
	const queryParameters = withDisplayFieldsQueryParameters(
		(this.getNodeParameter('queryParameters', itemIndex, {}) as IDataObject) ?? {},
		displayFields,
	);

	return (await openAssetApiRequest.call(
		this,
		'GET',
		'/Projects',
		undefined,
		queryParameters,
	)) as IDataObject | IDataObject[];
}