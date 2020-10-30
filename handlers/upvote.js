import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const featureId = event.pathParameters.id;

    await dynamoDb.update({
        Key: { PK: 'NFfeature', SK: featureId },
        UpdateExpression: 'set #v = #v + :val',
        ConditionExpression: '#v < :maxV AND NOT #u = :u',
        ExpressionAttributeNames: { '#v': 'votes', '#u': 'userId' },
        ExpressionAttributeValues: {
            ':val': 1,
            ':maxV': parseInt(process.env.maxVotes),
            ':u': userId
        }
    });

    return 'ok';
});