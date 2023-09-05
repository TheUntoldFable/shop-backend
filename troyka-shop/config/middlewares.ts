export default [
	'strapi::errors',
	'strapi::security',
	'strapi::cors',
	'strapi::poweredBy',
	'strapi::logger',
	'strapi::query',
	'strapi::session',
	'strapi::favicon',
	'strapi::public',
	{ name: 'strapi::body', config: { includeUnparsed: true } },
	{
		name: 'strapi::security',
		config: {
			contentSecurityPolicy: {
				useDefaults: true,
				directives: {
					'connect-src': ['\'self\'', 'https:'],
					'img-src': ['\'self\'', 'data:', 'blob:', 'dl.airtable.com', 'res.cloudinary.com'],
					'media-src': ['\'self\'', 'data:', 'blob:', 'dl.airtable.com', 'res.cloudinary.com'],
					upgradeInsecureRequests: null,
				},
			},
		},
	},
]
