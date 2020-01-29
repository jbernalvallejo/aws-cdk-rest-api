import {DynamoDB} from 'aws-sdk';

async function vote(eventId: string, replayTime: string, field: string) {
    const client = new DynamoDB({apiVersion: '2012-08-10'});
    const params: DynamoDB.Types.UpdateItemInput = {
        TableName: process.env.REPLAYS_TABLE_NAME || 'Replays',
        Key: {
            "event_id": {S: eventId},
            "replay_time": {S: replayTime}
        },
        ExpressionAttributeValues: { ':incr': { N: '1' } },
        UpdateExpression: `ADD ${field} :incr`,
        ReturnValues: "ALL_NEW"
    };

    const result: DynamoDB.Types.UpdateItemOutput = await client.updateItem(params).promise();
    return {
        eventId,
        replayTime,
        summary: result.Attributes?.summary.S,
        details: result.Attributes?.details.S,
        votes_up_count: result.Attributes?.votes_up_count.N,
        votes_down_count: result.Attributes?.votes_down_count.N
    };
}

async function upHandler(event: any) {
    let response = {};    
    try {
        const eventId = event.pathParameters['event_id'];
        const replayTime = event.pathParameters['replay_time'];

        const updatedReplayDto = await vote(eventId, replayTime, 'votes_up_count');

        response = {
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedReplayDto)
        };
    } catch (e) {
        console.log('Error raised', e);
        var body = e.stack || JSON.stringify(e, null, 2);
        response = {
            statusCode: 500,
            headers: {},
            body
        };    
    }
    return response;
}

async function downHandler(event: any) {
    let response = {};    
    try {
        const eventId = event.pathParameters['event_id'];
        const replayTime = event.pathParameters['replay_time'];

        const updatedReplayDto = await vote(eventId, replayTime, 'votes_down_count');

        response = {
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedReplayDto)
        };
    } catch (e) {
        console.log('Error raised', e);
        var body = e.stack || JSON.stringify(e, null, 2);
        response = {
            statusCode: 500,
            headers: {},
            body
        };    
    }
    return response;
}

export {upHandler, downHandler};