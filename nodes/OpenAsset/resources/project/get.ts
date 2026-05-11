import type { IDataObject, IExecuteFunctions, INodeProperties } from 'n8n-workflow';

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
	return Object.fromEntries(
		Object.entries(extraQueryParameters)
			.filter(([, value]) => value === true)
			.map(([key]) => [key, '1']),
	) as IDataObject;
}

export async function getProject(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const projectId = this.getNodeParameter('projectId', itemIndex) as string;
	const extraQueryParameters = buildProjectGetQueryParameters(
		(this.getNodeParameter('extraQueryParameters', itemIndex, {}) as IDataObject) ?? {},
	);

	return (await openAssetApiRequest.call(
		this,
		'GET',
		`/Projects/${projectId}`,
		undefined,
		extraQueryParameters,
	)) as IDataObject;
}