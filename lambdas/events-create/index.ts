import {DynamoDB} from 'aws-sdk';
import * as uuid from 'uuid';

const client = new DynamoDB({apiVersion: '2012-08-10'});

async function handler(event: any) {
    let response = {};    
    try {
        const eventDto = JSON.parse(event.body);
        const eventId = uuid.v4();

        const params: DynamoDB.Types.PutItemInput = {
            TableName: process.env.EVENTS_TABLE_NAME || 'Events',        
            Item: {
                'event_id': {S: eventId},
                'name': {S: eventDto.name},
                'desc': {S: eventDto.desc},
                'location': {S: eventDto.location},
                'date': {S: eventDto.date}
            }
        };    
        await client.putItem(params).promise();        
        
        response = {
            statusCode: 201,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...eventDto, event_id: eventId})
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
