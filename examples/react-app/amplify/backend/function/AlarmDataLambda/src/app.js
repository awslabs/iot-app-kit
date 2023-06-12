/* Amplify Params - DO NOT EDIT
  ENV
  REGION
Amplify Params - DO NOT EDIT *//*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const { TimestreamWriteClient, WriteRecordsCommand } = require("@aws-sdk/client-timestream-write");

const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  console.log('Setting CORS headers');
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")

  console.log('REQUEST: ', req.method, req.path, req.body);
  next()
});

/**
 * Accepts an object that looks like this or an array of these:
 *
 * {
 *   "telemetryAssetId": "some-id",
 *   "telemetryAssetType": "some-type",
 *   "metrics": {
 *     "RPM": 100,
 *     "Temperature": 20,
 *     "<whatever>": 0.5
 *   }
 * }
 */
app.post('/generate/telemetry', async ({ body }, res) => {
  const client = new TimestreamWriteClient({
    region: process.env.REGION,
  });
  const currentTime = Date.now().toString(); // Unix time in milliseconds
  const reqBody = Array.isArray(body) ? body : [body];
  const errors = [];

  for (const record of reqBody) {
    try {
      const records = [];
      const {telemetryAssetId, telemetryAssetType, metrics } = record;

      const dimensions = [
        { Name: 'TelemetryAssetType', Value: telemetryAssetType },
        { Name: 'TelemetryAssetId', 'Value': telemetryAssetId},
      ];

      Object.entries(metrics).forEach(([key, value]) => {
        const metric = {
          Dimensions: dimensions,
          MeasureName: key,
          MeasureValue: `${value}`,
          MeasureValueType: Number(value) === value ? 'DOUBLE' : 'VARCHAR',
          Time: currentTime
        }

        records.push(metric);
      });

      console.log(records);

      const params = {
        DatabaseName: `CookieFactoryTelemetry-${process.env.ENV}-AppKitDemo`,
        TableName: `Telemetry`,
        Records: records
      };

      const command = new WriteRecordsCommand(params);

      await client.send(command);
    } catch (err) {
      console.error('ERROR: ', err)
      errors.push(err);
      continue;
    }
  }

  if (errors.length > 0) {
    res.status(500).json({ success: false, errors: errors });
  } else {
    res.json({ success: true, message: 'Telemetry saved' });
  }
});

app.post('/generate/video', (req, res) => {
  // TODO: Implement this.
  res.json({ success: true, message: 'video received' });
})

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
