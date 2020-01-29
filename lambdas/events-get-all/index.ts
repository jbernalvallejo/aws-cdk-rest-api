import {DynamoDB} from 'aws-sdk';

const client = new DynamoDB({apiVersion: '2012-08-10'});

async function handler() {
    let response = {};    
    try {
        const params: DynamoDB.Types.ScanInput = {
            TableName: process.env.EVENTS_TABLE_NAME || 'Events'
        };

        const result: DynamoDB.Types.ScanOutput = await client.scan(params).promise();

        const eventDtos = result.Items?.map(item => ({
            eventId: item['event_id'].S,
            name: item['name'].S,
            desc: item['desc'].S,
            location: item['location'].S,
            date: item['date'].S
        }));

        response = {
            statusCode: 200,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(eventDtos)
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