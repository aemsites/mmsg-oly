require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendEmail(email, message, host, port, user, pass, to, cc, bcc) {
  try {
    let transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: false,
      auth: {
        user: user,
        pass: pass
      },
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      },
      timeout: 30000
    });

    let mailOptions = {
      from: 'onlin@oly.com.au',
      to: to,
      cc: cc,
      bcc: bcc,
      subject: 'New Webform Submission',
      text: `Email: ${email}\nMessage: ${message}`,
      html: `<p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
    };

    let info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent successfully' })
    };
  } catch (error) {
    console.error('Error sending email: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email', error: error.message })
    };
  }
}

async function main(params) {
//   console.log(JSON.stringify(params));
  try {
    const { email, message } = params;
    return await sendEmail(email, message, params.SMTP_HOST, params.SMTP_PORT, params.SMTP_USER,params.SMTP_PASSWORD ,params.EMAIL_TO, params.EMAIL_CC, params.EMAIL_BCC);
  } catch (error) {
    console.error('Error processing event: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing event', error: error.message })
    };
  }
}

exports.main = main;
