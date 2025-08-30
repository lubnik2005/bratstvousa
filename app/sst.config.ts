/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "app",
      home: "aws",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage ?? ""),
    };
  },

  async run() {
    // Stage flags (use $app.stage inside run)
    const isProd = ["prd", "prod", "production"].includes($app.stage);

    // Secrets
    const database_url = new sst.Secret("DATABASE_URL");
    const media_url = new sst.Secret("MEDIA_URL");
    const admin_url        = new sst.Secret("ADMIN_URL");
const mail_info_user   = new sst.Secret("MAIL_INFO_USER");

const smtp_host        = new sst.Secret("SMTP_HOST");
const smtp_port        = new sst.Secret("SMTP_PORT");
const smtp_user        = new sst.Secret("SMTP_USER");
const smtp_password    = new sst.Secret("SMTP_PASSWORD");
const smtp_from        = new sst.Secret("SMTP_FROM");

const aws_default_region = new sst.Secret("AWS_DEFAULT_REGION");
const aws_bucket_name    = new sst.Secret("AWS_BUCKET_NAME");
// (If you use IAM role, you usually DON'T need ACCESS_KEY/SECRET envs)


    // SvelteKit site
    new sst.aws.SvelteKit("MyWeb", {
      // link exposes Resource.DATABASE_URL / Resource.MEDIA_URL to your app
      link: [database_url, media_url,
  admin_url, mail_info_user,
  smtp_host, smtp_port, smtp_user, smtp_password, smtp_from,
  aws_default_region, aws_bucket_name,],

      server: {
        // Inject secrets into the server Lambda env
        environment: {
          DATABASE_URL: database_url.value,
          MEDIA_URL: media_url.value,



    ADMIN_URL: admin_url.value,
    MAIL_INFO_USER: mail_info_user.value,

    SMTP_HOST: smtp_host.value,
    SMTP_PORT: smtp_port.value,        // string is fine; cast in app if needed
    SMTP_USER: smtp_user.value,
    SMTP_PASSWORD: smtp_password.value,
    SMTP_FROM: smtp_from.value,

    AWS_DEFAULT_REGION: aws_default_region.value,
    AWS_BUCKET_NAME: aws_bucket_name.value,

        },

        // Per-stage sizing & concurrency
        memory: isProd ? "256 MB" : "128 MB",
        architecture: "arm64",
        timeout: "10 seconds",
        provisionedConcurrentExecutions: isProd ? 1 : undefined,
      },
    });

    // (Your optional scaffolding left as-is)
  },
});

