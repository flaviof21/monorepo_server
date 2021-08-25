import path from 'path'
import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

import mailerConfig from '../config/services/mail';

const Mail = nodemailer.createTransport(mailerConfig)

Mail.use('compile', hbs({
  viewEngine: {
    defaultLayout: undefined,
    partialsDir: path.resolve('./src/')
  },
  viewPath: path.resolve('./src/'),
  extName: '.ejs',
}));

export { Mail };