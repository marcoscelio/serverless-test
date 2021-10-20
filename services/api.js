const uuid = require("uuid");
const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  endpoint: "http://localhost:8000",
});

const findOfferById = async (id) => {
  var params = {
    TableName: "offer-table",
    Key: { id },
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id",
    },
    ExpressionAttributeValues: {
      ":id": id,
    },
  };
  const offerItems = await dynamoDb.query(params).promise();
  return offerItems?.Items[0];
};

const findLocationById = async (id) => {
  var params = {
    TableName: "location-table",
    Key: { id },
    KeyConditionExpression: "#id = :id",
    ExpressionAttributeNames: {
      "#id": "id",
    },
    ExpressionAttributeValues: {
      ":id": id,
    },
  };
  const locationItems = await dynamoDb.query(params).promise();
  return locationItems?.Items[0];
};

const linkOfferToLocation = async (location, offer) => {
  var params = {
    TableName: "location-table",
    Item: {
      ...location,
      hasOffer: true,
    },
  };
  await dynamoDb.put(params).promise();
};

const increaseOfferCount = async (offer) => {
  var params = {
    TableName: "offer-table",
    Item: {
      ...offer,
      counter: offer.counter ? ++offer.counter : 1,
    },
  };
  await dynamoDb.put(params).promise();
};

module.exports.linkOffer = async (event, context, callback) => {
  const { offerId, locationId } = event;
  if (!offerId) {
    throw new Error("Offer id missing!");
  }
  const offer = await findOfferById(offerId);
  const location = await findLocationById(locationId);

  if (offer && location) {
    await linkOfferToLocation(location, offer);
    await increaseOfferCount(offer);
  }
};

module.exports.linkOfferToLocation = async (event, context, callback) => {
  const { offerId, locationId } = event;
  if (!offerId) {
    throw new Error("Offer id missing!");
  }
  const offer = await findOfferById(offerId);
  const location = await findLocationById(locationId);

  if (offer && location) {
    await linkOfferToLocation(location, offer);
    await increaseOfferCount(offer);
  }
};

module.exports.listOffers = (event, context, callback) => {
  var params = {
    TableName: "offer-table",
  };

  dynamoDb.scan(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      const { Items } = data;
      console.log(Items);
    }
  });
};
module.exports.listLocations = (event, context, callback) => {
  var params = {
    TableName: "location-table",
  };

  dynamoDb.scan(params, function (err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Query succeeded.");
      const { Items } = data;
      console.log(Items);
    }
  });
};
