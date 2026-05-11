import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';

import { openAssetApiRequest } from '../../shared/transport';

export async function getKeywords(this: IExecuteFunctions): Promise<IDataObject | IDataObject[]> {
	return (await openAssetApiRequest.call(this, 'GET', '/Keywords', undefined, {
		limit: 0,
	})) as
		| IDataObject
		| IDataObject[];
}