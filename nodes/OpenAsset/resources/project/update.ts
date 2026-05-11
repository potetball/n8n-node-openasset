import type {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

const showOnlyForProjectUpdate = {
	resource: ['project'],
	operation: ['update'],
};

export const projectUpdateDescription: INodeProperties[] = [
	{
		displayName: 'Project ID',
		name: 'projectId',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForProjectUpdate,
		},
		default: '',
	},
	{
		displayName: 'Body',
		name: 'body',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForProjectUpdate,
		},
		default: '{}',
		description:
			'JSON body to send to the project update endpoint, for example {"name":"London Bridges Olympic Lighting","code":"ABC123"} or {"fields":[{"id":1,"values":["test"]}]}',
	},
];

export async function updateProject(
	this: IExecuteFunctions,
	itemIndex: number,
): Promise<IDataObject> {
	const projectId = this.getNodeParameter('projectId', itemIndex) as string;
	const body = this.getNodeParameter('body', itemIndex) as IDataObject;

	if (Object.keys(body).length === 0) {
		throw new NodeOperationError(this.getNode(), 'Add at least one field to update', {
			itemIndex,
		});
	}

	return (await openAssetApiRequest.call(
		this,
		'PUT',
		`/Projects/${projectId}`,
		body,
	)) as IDataObject;
}