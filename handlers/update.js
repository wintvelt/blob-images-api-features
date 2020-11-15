import { handler } from "blob-common/core/handler";
import { dbUpdateMulti } from "blob-common/core/db";
import { getFeature, getUserQuery } from "./helpers";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const userResult = await getUserQuery(userId);
    const userIsMaster = userResult.Item && (userResult.Item?.email === process.env.webmaster);

    const featureId = event.pathParameters.id;
    const data = JSON.parse(event.body);
    const { title, description, comment, votes, status } = data; // ignore other info in body
    let updateObj = { title, description };
    if (userIsMaster) {
        if (comment) updateObj.comment = comment;
        if (status && ['submitted', 'in progress', 'completed'].includes(status)) updateObj.status = status;
        if (votes) updateObj.votes = parseInt(votes);
    }

    const oldFeature = await getFeature(featureId);
    if (!oldFeature) throw new Error('Feature to update not found');

    await dbUpdateMulti('NFfeature', featureId, updateObj);

    return 'ok';
});