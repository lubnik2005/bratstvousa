/// <reference path="./.sst/platform/config.d.ts" />
// import "sst"   // uncomment if your editor needs it for types

// One domain per permanent stage
const DOMAINS: Record<string, { name: string; cert: string }> = {
	prd: {
		name: 'www.bratstvousa.com',
		cert: 'arn:aws:acm:us-east-1:985539774846:certificate/855dc285-da4e-4296-bf11-3850b216a79e'
	},
	stg: {
		name: 'stg.bratstvousa.com',
		cert: 'arn:aws:acm:us-east-1:985539774846:certificate/e00dc392-3466-4754-afae-f767457c5c20'
	},
	qa: {
		name: 'qa.bratstvousa.com',
		cert: 'arn:aws:acm:us-east-1:985539774846:certificate/a5025818-77d8-4ef3-a351-29348c208de9'
	}
};

export default $config({
	app(input) {
		return {
			name: 'app',
			home: 'aws',
			removal: input?.stage === 'prd' ? 'retain' : 'remove',
			protect: ['prd'].includes(input?.stage ?? '')
		};
	},

	async run() {
		const isProd = $app.stage === 'prd';

		// --- Secrets (unchanged) ---
		const database_url = new sst.Secret('DATABASE_URL');
		const media_url = new sst.Secret('MEDIA_URL');
		const admin_url = new sst.Secret('ADMIN_URL');
		const mail_info_user = new sst.Secret('MAIL_INFO_USER');
		const smtp_host = new sst.Secret('SMTP_HOST');
		const smtp_port = new sst.Secret('SMTP_PORT');
		const smtp_user = new sst.Secret('SMTP_USER');
		const smtp_password = new sst.Secret('SMTP_PASSWORD');
		const smtp_from = new sst.Secret('SMTP_FROM');
		const aws_default_region = new sst.Secret('AWS_DEFAULT_REGION');
		const aws_bucket_name = new sst.Secret('AWS_BUCKET_NAME');

		// --- Router per known stage ---
		const stageDomain = DOMAINS[$app.stage];
		const router = stageDomain
			? new sst.aws.Router('Router', {
					domain: {
						name: stageDomain.name,
						cert: stageDomain.cert,
						dns: false, // manual DNS (Squarespace)
						aliases: []
					}
				})
			: undefined; // preview/unknown stages: no custom domain

		// --- SvelteKit site ---
		new sst.aws.SvelteKit(`bratstvousa-${$app.stage}`, {
			...(router ? { router: { instance: router } } : {}),

			link: [
				database_url,
				media_url,
				admin_url,
				mail_info_user,
				smtp_host,
				smtp_port,
				smtp_user,
				smtp_password,
				smtp_from,
				aws_default_region,
				aws_bucket_name
			],

			server: {
				environment: {
					DATABASE_URL: database_url.value,
					MEDIA_URL: media_url.value,
					ADMIN_URL: admin_url.value,
					MAIL_INFO_USER: mail_info_user.value,
					SMTP_HOST: smtp_host.value,
					SMTP_PORT: smtp_port.value,
					SMTP_USER: smtp_user.value,
					SMTP_PASSWORD: smtp_password.value,
					SMTP_FROM: smtp_from.value,
					AWS_DEFAULT_REGION: aws_default_region.value,
					AWS_BUCKET_NAME: aws_bucket_name.value
				},
				memory: isProd ? '256 MB' : '128 MB',
				architecture: 'arm64',
				timeout: '10 seconds',
				provisionedConcurrentExecutions: isProd ? 1 : undefined
			}
		});
	}
});
