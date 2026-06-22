import type { IDataObject, INodeProperties } from 'n8n-workflow';

export function displayFieldsProperty(
	displayOptions: NonNullable<INodeProperties['displayOptions']>,
): INodeProperties {
	return {
		displayName: 'Display Fields',
		name: 'displayFields',
		type: 'string',
		displayOptions,
		default: '',
		placeholder: 'name,created,updated',
		description:
			'Comma-separated field names to include in the response, for example name,created,updated',
	};
}

function normalizeDisplayFields(displayFields: unknown): string | undefined {
	if (typeof displayFields !== 'string') {
		return undefined;
	}

	const normalizedDisplayFields = displayFields
		.split(',')
		.map((field) => field.trim())
		.filter(Boolean)
		.join(',');

	return normalizedDisplayFields === '' ? undefined : normalizedDisplayFields;
}

export function buildDisplayFieldsQueryParameter(displayFields: unknown): IDataObject {
	const normalizedDisplayFields = normalizeDisplayFields(displayFields);

	return normalizedDisplayFields === undefined
		? {}
		: {
				displayFields: normalizedDisplayFields,
			};
}

export function removeEmptyQueryParameters(queryParameters: IDataObject): IDataObject {
	const cleanedQueryParameters: IDataObject = {};

	for (const [key, value] of Object.entries(queryParameters)) {
		if (value === '' || value === undefined) {
			continue;
		}

		if (key === 'displayFields') {
			const normalizedDisplayFields = normalizeDisplayFields(value);

			if (normalizedDisplayFields !== undefined) {
				cleanedQueryParameters.displayFields = normalizedDisplayFields;
			}

			continue;
		}

		cleanedQueryParameters[key] = value;
	}

	return cleanedQueryParameters;
}

export function withDisplayFieldsQueryParameters(
	queryParameters: IDataObject,
	displayFields: unknown,
): IDataObject {
	return removeEmptyQueryParameters({
		...queryParameters,
		...buildDisplayFieldsQueryParameter(displayFields),
	});
}