const nodemailer = require('nodemailer');

const sendEmailService = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // user: 'nvtpk19hutech@gmail.com',
      // pass: 'azpqascccpatlbnk',
      user: 'hoangtrungp0205@gmail.com',
      pass: 'dtjvivgjhmttwgit',
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    const info = await transporter.sendMail({
      from: 'hoangtrungp0205@gmail.com',
      to,
      subject,
      html: htmlContent,
    });
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Failed to send email', error);
    throw error;
  }
};

module.exports = {
    sendmail: async function (to, subject, url) {
        const html = `<p>Please click the link below to reset your password:</p><a href="${url}">Reset Password</a>`;
        return await sendEmailService(to, subject, html);
    },
    sendEmailService: sendEmailService
};