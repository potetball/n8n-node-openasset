import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class OpenAssetApi implements ICredentialType {
	name = 'openAssetApi';

	displayName = 'OpenAsset API';

	icon: ICredentialType['icon'] = {
		light: 'file:../icons/openasset.logo.light.svg',
		dark: 'file:../icons/openasset.logo.dark.svg',
	};

	documentationUrl = 'https://developers.openasset.com/#authentication';

	properties: INodeProperties[] = [
		{
			displayName: 'Client Domain',
			name: 'clientDomain',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'example',
			description: 'The subdomain used for your OpenAsset instance',
		},
		{
			displayName: 'Token ID',
			name: 'tokenId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Token String',
			name: 'tokenString',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=OATU {{$credentials.tokenId}}:{{$credentials.tokenString}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.clientDomain}}.openasset.com/REST/1',
			url: '/Projects',
			method: 'GET',
		},
	};
}
