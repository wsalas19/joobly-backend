import nodemailer from 'nodemailer';
import { config, HEAR_ABOUT, INTERESTED_IN } from '../constants/constants.js';

class ContactController {
  async sendEmail(req, res) {
    let transporter = nodemailer.createTransport(config);
    const { body } = req;
    let message = {
      from: body.email,
      to: 'nerses.grigoryan94@gmail.com',
      html: `<p><strong>Hello I am ${
        body.firstName + ' ' + body.lastName
      }</strong></p>
     <p>${body.companyName ? `I am from ${body.companyName} company` : ''}</p>
      <p> ${
        body.hearAbout !== HEAR_ABOUT.other
          ? `I heard about you from ${body.hearAbout}`
          : ''
      }</p>
       <p>${
         body.interest !== INTERESTED_IN.other
           ? `I interested in ${body.interest.toLowerCase()}`
           : ''
       } </p>

      </br>
      <p>${body.message}</p>

      `,
    };

    transporter
      .sendMail(message)
      .then((info) => {
        return res.status(201).json({
          msg: 'Email sent',
          info: info.messageId,
          preview: nodemailer.getTestMessageUrl(info),
        });
      })
      .catch((err) => {
        return res.status(500).json({ msg: err });
      });
  }
}

export default new ContactController();
