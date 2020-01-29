import * as lambda from '@aws-cdk/aws-lambda';
import { Table } from '@aws-cdk/aws-dynamodb';

const defaultProps = {
    runtime: lambda.Runtime.NODEJS_12_X,
    handler: 'index.handler',
    tracing: lambda.Tracing.ACTIVE
};

export function createEventFn(scope: any, table: Table) {
    const props = {
        ...defaultProps,
        code: lambda.Code.fromAsset('lambdas/events-create'),        
        functionName: 'events-create',
        environment: {
            EVENTS_TABLE_NAME: table.tableName
        }
    };
    return new lambda.Function(scope, 'CreateEventFn', props);
}

export function getEventsFn(scope: any, table: Table) {
    const props = {
        ...defaultProps,
        code: lambda.Code.fromAsset('lambdas/events-get-all'),
        functionName: 'events-get-all',
        environment: {
            EVENTS_TABLE_NAME: table.tableName
        }
    };
    return new lambda.Function(scope, 'GetEventsFn', props);
}

export function getEventReplaysFn(scope: any, table: Table) {
    const props = {
        ...defaultProps,
        code: lambda.Code.fromAsset('lambdas/events-get-replays'),
        functionName: 'events-get-replays',
        environment: {
            REPLAYS_TABLE_NAME: table.tableName
        }
    };
    return new lambda.Function(scope, 'GetEventReplaysFn', props);
}

export function voteUpReplayFn(scope: any, table: Table) {
    const props = {
        ...defaultProps,
        code: lambda.Code.fromAsset('lambdas/events-replay-voting'),
        handler: 'index.upHandler',
        functionName: 'replay-vote-up',
        environment: {
            REPLAYS_TABLE_NAME: table.tableName
        }
    };
    return new lambda.Function(scope, 'VoteUpReplayFn', props);
}

export function voteDownReplayFn(scope: any, table: Table) {
    const props = {
        ...defaultProps,
        code: lambda.Code.fromAsset('lambdas/events-replay-voting'),
        handler: 'index.downHandler',
        functionName: 'replay-vote-down',
        environment: {
            REPLAYS_TABLE_NAME: table.tableName
        }
    };
    return new lambda.Function(scope, 'VoteDownReplayFn', props);
}
