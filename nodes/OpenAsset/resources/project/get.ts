import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

import { displayFieldsProperty, withDisplayFieldsQueryParameters } from '../../shared/queryParameters';
import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectGet = {
	resource: ['project'],
	operation: ['get'],
};

export const projectGetDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForProjectGet,
		},
		default: '',
	},
	displayFieldsProperty({
		show: showOnlyForProjectGet,
	}),
	{
		displayName: 'Extra Query Parameters',
		name: 'extraQueryParameters',
		type: 'collection',
		displayOptions: {
			show: showOnlyForProjectGet,
		},
		default: {},
		placeholder: 'Add Query Parameter',
		options: [
			{
				displayName: 'Albums',
				name: 'albums',
				type: 'boolean',
				default: false,
				description: 'Whether to return all album IDs associated with the project',
			},
			{
				displayName: 'Employees',
				name: 'employees',
				type: 'boolean',
				default: false,
				description: 'Whether to return all employee IDs associated with the project',
			},
			{
				displayName: 'Fields',
				name: 'fields',
				type: 'boolean',
				default: false,
				description: 'Whether to return all field values for the project',
			},
			{
				displayName: 'Project Keywords',
				name: 'projectKeywords',
				type: 'boolean',
				default: false,
				description: 'Whether to return all project keyword IDs applied to the project',
			},
			{
				displayName: 'With Embedded Fields',
				name: 'withEmbeddedFields',
				type: 'boolean',
				default: false,
				description: "Whether to include the project's custom fields in the response",
			},
			{
				displayName: 'With Embedded Keywords',
				name: 'withEmbeddedKeywords',
				type: 'boolean',
				default: false,
				description:
					"Whether to include the project's custom keywords in the response grouped by project keyword category",
			},
			{
				displayName: 'With Location',
				name: 'withLocation',
				type: 'boolean',
				default: false,
				description:
					"Whether to include the project's location details in the response when available",
			},
		],
		description: 'Optional query string flags for the project response',
	},
];

function buildProjectGetQueryParameters(extraQueryParameters: IDataObject): IDataObject {
	const queryParameterValueMap: Record<string, string> = {
		fields: 'all',
		projectKeywords: 'all',
		albums: 'all',
		employees: 'all',
	};

	return Object.fromEntries(
		Object.entries(extraQueryParameters)
			.filter(([, value]) => value === true)
			.map(([key]) => [key, queryParameterValueMap[key] ?? '1']),
	) as IDataObject;
}

export async function getProject(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const projectId = this.getNodeParameter('projectId', itemIndex) as string;
	const displayFields = this.getNodeParameter('displayFields', itemIndex, '');
	const extraQueryParameters = buildProjectGetQueryParameters(
		(this.getNodeParameter('extraQueryParameters', itemIndex, {}) as IDataObject) ?? {},
	);
	const queryParameters = withDisplayFieldsQueryParameters(extraQueryParameters, displayFields);

	return (await openAssetApiRequest.call(
		this,
		'GET',
		`/Projects/${projectId}`,
		undefined,
		queryParameters,
	)) as IDataObject;
}