import { getUserFromEvent, handler } from "blob-common/core/handler";
import { cleanRecord } from "blob-common/core/dbClean";
import { getFeature, getUserQuery } from "./helpers";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const featureId = event.pathParameters.id;

    const [feature, userResult] = await Promise.all([
        getFeature(featureId),
        getUserQuery(userId)
    ]);
    const isRegistered = !!userResult.Item;
    const userIsOwner = (userId === feature.user?.SK);
    let options = [];
    if (userIsOwner) options.push('edit');
    if (feature.votes <= process.env.maxVotes && !userIsOwner && isRegistered) {
        options.push('vote');
    }
    const cleanFeature = {
        ...cleanRecord(feature),
        userIsOwner,
        options
    };

    return cleanFeature;
});
