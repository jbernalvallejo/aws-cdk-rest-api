import * as dynamodb from '@aws-cdk/aws-dynamodb';

const defaultProps = {
    serverSideEncryption: true,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
}

export function createEventsTable(scope: any) {
    const props = {
        ...defaultProps,
        tableName: 'Events',
        partitionKey: {name: 'event_id', type: dynamodb.AttributeType.STRING}
    }
    return new dynamodb.Table(scope, 'Events', props);
}

export function createReplaysTable(scope: any) {
    const props = {
        ...defaultProps,
        tableName: 'Replays',
        partitionKey: {name: 'event_id', type: dynamodb.AttributeType.STRING},
        sortKey: {name: 'replay_time', type: dynamodb.AttributeType.STRING}
    }
    return new dynamodb.Table(scope, 'Replays', props);
}

export function createUserVotesTable(scope: any) {
    const props = {
        ...defaultProps,
        tableName: 'UserVotes',
        partitionKey: {name: 'email', type: dynamodb.AttributeType.STRING},
        sortKey: {name: 'replay_id', type: dynamodb.AttributeType.STRING}
    }
    return new dynamodb.Table(scope, 'UserVotes', props);
}
