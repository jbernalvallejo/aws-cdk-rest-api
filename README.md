# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template



https://<account-id>.signin.aws.amazon.com/console

```bash
export AWS_DEFAULT_REGION=eu-west-2
export AWS_ACCESS_KEY_ID="<your-access-key-id>"
export AWS_SECRET_ACCESS_KEY="<your-secret-access-key>"
```

```bash
source configure-cdk-user.sh
```

Environment variables
- `EVENTS_TABLE_NAME`
- `REPLAYS_TABLE_NAME`
- `USER_VOTES_TABLE_NAME`