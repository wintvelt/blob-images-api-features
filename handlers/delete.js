import { handler, getUserFromEvent } from "blob-common/core/handler";
import { dynamoDb } from "blob-common/core/db";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const userResult = await getUserQuery(userId);
    const userIsMaster = userResult.Item && (userResult.Item?.email === process.env.webmaster);
    if (!userIsMaster) throw new Error('not authorized to delete feature');

    const featureId = event.pathParameters.id;
    const Key = { PK: 'NFfeature', SK: featureId };
    await dynamoDb.delete({ Key });

    return 'feature deleted';
});
