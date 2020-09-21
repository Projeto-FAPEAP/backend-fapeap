/* eslint-disable @typescript-eslint/no-var-requires */
import nodemailer from 'nodemailer';
import path from 'path';
import mailerConfig from './mailerConfig';

const hbs = require('nodemailer-express-handlebars');

export const transport = nodemailer.createTransport({
  host: mailerConfig.host,
  port: mailerConfig.port,
  auth: {
    user: mailerConfig.user,
    pass: mailerConfig.pass,
  },
});

transport.use(
  'compile',
  hbs({
    viewEngine: 'handlebars',
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
  }),
);
