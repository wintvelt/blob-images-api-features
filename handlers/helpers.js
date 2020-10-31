import { dynamoDb } from "blob-common/core/db";

export const listFeaturesQuery = () => {
    return dynamoDb.query({
        KeyConditionExpression: ':PK = #PK',
        ExpressionAttributeNames: { '#PK': 'PK' },
        ExpressionAttributeValues: { ':PK': 'NFfeature' }
    });
};

export const getFeature = async (featureId) => {
    const result = await dynamoDb.get({ PK: 'NFfeature', SK: featureId });
    return result.Item;
};

export const getUserQuery = (userId) => {
    return dynamoDb.get({ PK: 'USER', SK: userId });
}