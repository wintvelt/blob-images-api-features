import { handler, getUserFromEvent } from "blob-common/core/handler";
import { newFeatureId } from "blob-common/core/ids";
import { dynamoDb } from "blob-common/core/db";
import { cleanRecord } from "blob-common/core/dbClean";
import { dbCreateItem } from "blob-common/core/dbCreate";
import { listFeaturesQuery } from "./helpers";

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const featureId = newFeatureId();
    const data = JSON.parse(event.body);
    const { title, description } = data;
    if (!title) throw new Error('Title field missing from body');

    const featureQuery = listFeaturesQuery();
    const userQuery = dynamoDb.get({ Key: { PK: 'USER', SK: userId } });
    const [featureResult, userResult] = await Promise.all([
        featureQuery,
        userQuery
    ]);
    // check if new features can be created
    const features = featureResult.Items;
    const maxFeatureCount = parseInt(process.env.maxFeatures);
    if (features.length >= maxFeatureCount) throw new Error('max num of features reached');

    // get submitter info
    const user = cleanRecord(userResult.Item);

    const newFeature = await dbCreateItem({
        PK: 'NFfeature',
        SK: featureId,
        title,
        description,
        votes: 10,
        user,
        userId
    });

    return cleanRecord(newFeature);
});
