import { handler } from "blob-common/core/handler";
import { dbUpdateMulti } from "blob-common/core/db";
import { getFeature } from "./helpers";

export const main = handler(async (event, context) => {
    const featureId = event.pathParameters.id;
    const data = JSON.parse(event.body);
    const { title, description } = data; // ignore other info in body

    const oldFeature = await getFeature(featureId);
    if (!oldFeature) throw new Error('Feature to update not found');

    await dbUpdateMulti('NFfeature', featureId, { title, description });

    return 'ok';
});