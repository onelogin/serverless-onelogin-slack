'use strict';

var http = require('https');

function sendToSlack(event){

  var timestamp = new Date(event.event_timestamp).getTime() / 1000;

  var message = JSON.stringify({
    channel: '#' + process.env.SLACK_CHANNEL,
    username: 'onelogin',
    response_type: 'in_channel',
    attachments: [{
      color: '#ff0000',
      text: event.user_name + ' had a risky login to OneLogin',
      ts: timestamp,
      fields: [
        {
          title: 'Risk Score',
          value: event.risk_score + ' / 100',
          short: false
        },
        {
          title: 'Risk Reasons',
          value: event.risk_reasons,
          short: false,
          mrkdwn: false
        },
        {
          title: 'Notes',
          value: event.notes,
          short: false,
          mrkdwn: false
        }
      ]
    }]
  });

  var options = {
      host: 'hooks.slack.com',
      port: '443',
      path: process.env.SLACK_PATH,
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(message)
      }
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf8');
  });

  req.write(message);
  req.end();
}

module.exports.hook = (event, context, callback) => {

  var events = JSON.parse(event.body);

  for(var i=0; i < events.length; i++){
    if(events[i].event_type_id == 5 && events[i].risk_score > process.env.RISK_THRESHOLD){
      sendToSlack(events[i]);
    }
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Ok'
    }),
  };

  callback(null, response);
};
