import {DynamoDB} from 'aws-sdk';

const client = new DynamoDB({apiVersion: '2012-08-10'});

async function handler(event: any) {
    let response = {};    
    try {        
        const eventId = event.pathParameters['event_id'];

        const params: DynamoDB.Types.QueryInput = {
            TableName: process.env.REPLAYS_TABLE_NAME || 'Replays',
            ExpressionAttributeValues: {
                ":event_id": {S: eventId}
            }, 
            KeyConditionExpression: "event_id = :event_id", 
            ProjectionExpression: "event_id, replay_time, summary, details, votes_up_count, votes_down_count",
        };    

        const result: DynamoDB.Types.QueryOutput = await client.query(params).promise();        
        
        const replayDtos = result.Items?.map(item => ({
            eventId: item['event_id'].S,
            replayTime: item['replay_time'].S,
            summary: item['summary'].S,
            details: item['details'].S,
            votesUpCount: item['votes_up_count'].N,
            votesDownCount: item['votes_down_count'].N
        }));

        response = {
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(replayDtos)
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

export {handler};
