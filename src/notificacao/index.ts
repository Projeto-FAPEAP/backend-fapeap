/* eslint-disable @typescript-eslint/interface-name-prefix */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import https from 'https';
import onesignalConfig from '../config/apiOneSignal';

interface INotification {
  user_id: string;
  title: string;
  subtitle: string;
  additional_data: object;
}

export default function sendNotification(data: INotification) {
  const { title, subtitle, user_id, additional_data } = data;
  const { appId, apiKey } = onesignalConfig;

  const dataRequest = {
    app_id: appId,
    headings: {
      en: title,
    },
    contents: {
      en: subtitle,
    },
    included_segments: ['All'],
    filters: [
      {
        field: 'tag',
        key: 'user',
        relation: '=',
        value: user_id,
      },
    ],
    data: additional_data,
  };

  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Basic ${apiKey}`,
  };

  console.log(dataRequest, headers);

  const options = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers,
  };

  const req = https.request(options, res => {
    res.on('data', responseData => {
      // console.log(JSON.parse(responseData));
    });
  });

  req.on('error', e => {
    console.log('ERROR:');
    console.log(e);
  });

  req.write(JSON.stringify(dataRequest));
  req.end();
}
