import { getUserFromEvent, handler } from "blob-common/core/handler";
import { cleanRecord } from "blob-common/core/dbClean";
import { listFeaturesQuery } from "./helpers";

const sortByVotes = (a, b) => (
    (a.votes > b.votes) ? -1
        : (a.votes < b.votes) ? 1
            : 0
);

export const main = handler(async (event, context) => {
    const userId = getUserFromEvent(event);
    const featuresResult = await listFeaturesQuery();
    const features = featuresResult.Items;
    const cleanFeatures = features.map(feat => {
        const userIsOwner = (userId === featuresResult.user?.SK);
        let options = [];
        if (userIsOwner) options.push('edit');
        if (feat.votes <= process.env.maxVotes && !userIsOwner) options.push('vote');
        return {
            ...cleanRecord(feat),
            userIsOwner,
            options
        };
    });
    const sortedFeatures = cleanFeatures.sort(sortByVotes);

    return sortedFeatures;
});
