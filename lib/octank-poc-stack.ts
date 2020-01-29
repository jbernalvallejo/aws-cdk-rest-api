import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway';

import {createEventsTable, createReplaysTable, createUserVotesTable} from './dynamoDbTables';
import {createEventFn, getEventsFn, getEventReplaysFn, voteUpReplayFn, voteDownReplayFn} from './lambdaFunctions';

export class OctankPocStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB tables
    const eventsTable = createEventsTable(this);
    const replaysTable = createReplaysTable(this);
    const userVotesTable = createUserVotesTable(this);

    // Lambda handlers
    const createEventHandler = createEventFn(this, eventsTable);
    const getEventsHandler = getEventsFn(this, eventsTable);
    const getEventReplaysHandler = getEventReplaysFn(this, replaysTable);
    const voteUpReplayHandler = voteUpReplayFn(this, replaysTable);
    const voteDownReplayHandler = voteDownReplayFn(this, replaysTable);

    // API Gateway
    const api = new apigateway.RestApi(this, 'octank-poc-api');
    const events = api.root.addResource('events');
    events.addMethod('POST', new apigateway.LambdaIntegration(createEventHandler));
    events.addMethod('GET', new apigateway.LambdaIntegration(getEventsHandler));

    const event = events.addResource('{event_id}');
    const replays = event.addResource('replays');
    replays.addMethod('GET', new apigateway.LambdaIntegration(getEventReplaysHandler));

    const replay = replays.addResource('{replay_time}')
    replay.addResource('up').addMethod('POST', new apigateway.LambdaIntegration(voteUpReplayHandler));
    replay.addResource('down').addMethod('POST', new apigateway.LambdaIntegration(voteDownReplayHandler));

    // IAM permissions
    eventsTable.grantWriteData(createEventHandler);
    eventsTable.grantReadData(getEventsHandler);
    replaysTable.grantReadData(getEventReplaysHandler);
    replaysTable.grantWriteData(voteUpReplayHandler);
    replaysTable.grantWriteData(voteDownReplayHandler);
  }

}
