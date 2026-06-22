import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

import { employeeDescription, employeeOperations } from './resources/employee';
import { fileDescription, fileOperations } from './resources/file';
import { keywordDescription, keywordOperations } from './resources/keyword';
import { projectDescription, projectOperations } from './resources/project';
import {
	projectCategoryKeywordDescription,
	projectCategoryKeywordOperations,
} from './resources/projectCategoryKeyword';
import {
	projectKeywordDescription,
	projectKeywordOperations,
} from './resources/projectKeyword';
import { fieldDescription, fieldOperations } from './resources/field';

type OpenAssetResponse = IDataObject | IDataObject[];
type OpenAssetOperationHandler = (
	this: IExecuteFunctions,
	itemIndex: number,
) => Promise<OpenAssetResponse>;

const openAssetOperations: Record<string, Record<string, OpenAssetOperationHandler>> = {
	employee: employeeOperations,
	field: fieldOperations,
	file: fileOperations,
	keyword: keywordOperations,
	project: projectOperations,
	projectCategoryKeyword: projectCategoryKeywordOperations,
	projectKeyword: projectKeywordOperations,
};

export class OpenAsset implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'OpenAsset',
		name: 'openAsset',
		icon: {
			light: 'file:../../icons/openasset.logo.light.svg',
			dark: 'file:../../icons/openasset.logo.dark.svg',
		},
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'OpenAsset Node',
		defaults: {
			name: 'OpenAsset',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		requestDefaults: {
			baseURL: '=https://{{$credentials.clientDomain}}.openasset.com/REST/1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		credentials: [
			{
				name: 'openAssetApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Employee',
						value: 'employee',
					},
					{
						name: 'Field',
						value: 'field',
					},
					{
						name: 'File',
						value: 'file',
					},
					{
						name: 'Keyword',
						value: 'keyword',
					},
					{
						name: 'Project',
						value: 'project',
					},
					{
						name: 'Project Category Keyword',
						value: 'projectCategoryKeyword',
					},
					{
						name: 'Project Keyword',
						value: 'projectKeyword',
					},
				],
				default: 'file',
			},
			...employeeDescription,
			...fieldDescription,
			...fileDescription,
			...keywordDescription,
			...projectDescription,
			...projectCategoryKeywordDescription,
			...projectKeywordDescription,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;
				const resourceOperations = openAssetOperations[resource];

				if (resourceOperations === undefined) {
					throw new NodeOperationError(this.getNode(), `Unsupported resource: ${resource}`, {
						itemIndex: i,
					});
				}

				const operationHandler = resourceOperations[operation];

				if (operationHandler === undefined) {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported ${resource} operation: ${operation}`,
						{
							itemIndex: i,
						},
					);
				}

				const responseData = await operationHandler.call(this, i);

				if (Array.isArray(responseData)) {
					for (const responseItem of responseData) {
						returnData.push({ json: responseItem, pairedItem: i });
					}
				} else {
					returnData.push({ json: responseData, pairedItem: i });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown error',
						},
						pairedItem: i,
					});
					continue;
				}

				throw new NodeOperationError(this.getNode(), error as Error, {
					itemIndex: i,
				});
			}
		}

		return [returnData];
	}
}
