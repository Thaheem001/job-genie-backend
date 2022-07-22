import nodemailer from 'nodemailer';

const { EMAIL_HOST, EMAIL_PASS, EMAIL_PORT, EMAIL_USER } = process.env;

const transport = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const sendMail = (message: string, to: string, isHtml?: boolean) => {
  const mailOptions = {
    from: 'admin@jobgeniedevs.com',
    to: to.toLowerCase(),
    subject: 'Jobgeniedeves Mail',
    text: !isHtml && message,
    html: isHtml && message,
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err.message);
      }

      resolve(info);
    });
  });
};

export { sendMail };
