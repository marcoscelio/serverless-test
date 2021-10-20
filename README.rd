# Deploy app

sls deploy --aws-profile fidel

# Start local DynamoDB

sls dynamodb seed --seed=domain,test

# DynamoDb commands

# List tables:

aws dynamodb list-tables --endpoint-url http://localhost:8000

# List Offers command

sls invoke local --function listOffers

List Locations command

sls invoke local --function listLocations

Local Link Offer To Location

Ex: 

npm run linkOfferToLocation '{"offerId": "d9b1d9ff-543e-47c7-895f-87f71dcad91b", "locationId": "03665f6d-27e2-4e69-aa9b-5b39d03e5f59"}'