import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';

import {createEventsTable, createReplaysTable, createUserVotesTable} from './dynamoDbTables';

export class OctankPocStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB tables
    const eventsTable = createEventsTable(this);
    const replaysTable = createReplaysTable(this);
    const userVotesTable = createUserVotesTable(this);

    // Lambda handlers
    const createEventFn = new lambda.Function(this, 'CreateEventFn', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambdas/events-create'),
      handler: 'index.handler',
      functionName: 'events-create',
      environment: {
        EVENTS_TABLE_NAME: eventsTable.tableName
      },
      tracing: lambda.Tracing.ACTIVE
    });

    const getEventsFn = new lambda.Function(this, 'GetEventsFn', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset('lambdas/events-get-all'),
      handler: 'index.handler',
      functionName: 'events-get-all',
      environment: {
        EVENTS_TABLE_NAME: eventsTable.tableName
      },
      tracing: lambda.Tracing.ACTIVE
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'octank-poc-api');
    const events = api.root.addResource('events');
    events.addMethod('POST', new apigateway.LambdaIntegration(createEventFn));
    events.addMethod('GET', new apigateway.LambdaIntegration(getEventsFn));

    // IAM permissions
    eventsTable.grantWriteData(createEventFn);
    eventsTable.grantReadData(getEventsFn);
  }

}
