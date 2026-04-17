import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

export async function getFiles(this: IExecuteFunctions): Promise<IDataObject | IDataObject[]> {
	return (await openAssetApiRequest.call(this, 'GET', '/Files')) as IDataObject | IDataObject[];
}