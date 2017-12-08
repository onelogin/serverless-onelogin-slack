# serverless-onelogin-slack
This is a sample app based on the [Serverless.com](https://serverless.com/) framework that will catch webhooks from OneLogin and post notifications to Slack if a high risk login is detected.

It gets events from OneLogin via Webhooks API aka Event Broadcaster. You can [read more about webhooks](https://developers.onelogin.com/api-docs/1/events/webhooks) in the OneLogin developer docs.

You could easily adapt this project to perform different actions based on different event types. The main code can be found in `src/handler.js` and configuration variables in `src/serverless.yaml`

##Setup
To run this sample you will need an AWS account setup with credentials saved that have access to create/manage API Gateway and Lambda functions.

###Slack
You will also need a Slack account with an Incoming Webhook setup. You can [add one to your Slack account here](https://slack.com/apps/A0F7XDUAZ-incoming-webhooks). Once you have your Incoming Webhook setup grab the Webhook Url that they issue you.
e.g. Something like this `https://hooks.slack.com/services/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`

###Serverless
Then you need to have [Serverless](https://serverless.com/) installed on your local machine. It takes a couple of seconds/minutes to setup. [Follow these instructions to get started](https://serverless.com/framework/docs/getting-started/).

Once you have serverless installed. Pull this repo and go to the `src/serverless.yml` file.

```sh
git clone git@github.com:onelogin/serverless-onelogin-slack.git
```

You will want to change the `SLACK_CHANNEL` and `SLACK_PATH` to the values that you have just setup and obtained from your Incoming Slack webhook.

Now from the command line move into the `src` directory and run the following:

```sh
cd src
serverless deploy
```

If you have your AWS credentials correct, Serverless will now package and deploy your function. It's pretty quick.

Once that is deployed, run the following to get the POST endpoint for your newly created function.

```sh
serverless info
```

###OneLogin Event Broadcaster
Lastly, you will use the endpoint url to register against an **Event Broadcaster** in your OneLogin account. Do this via the OneLogin Admin portal in the `Activity > Event Broadcaster` area. Set the **Listener Url** using your serverless endpoint url and change the **Format** to `JSON Array`.

##Risky Events
This sample has been configured to post notifications based on the `risk_score` property of the events webhook payload. This property will only be populated if you have Adaptive MFA enabled on a User Policy in your OneLogin account.


