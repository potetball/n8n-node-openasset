import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

export async function getProjects(this: IExecuteFunctions): Promise<IDataObject | IDataObject[]> {
	return (await openAssetApiRequest.call(this, 'GET', '/Projects')) as IDataObject | IDataObject[];
}