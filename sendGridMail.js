const sgMail =require("@sendgrid/mail");
require('dotenv').config();
sgMail.setApiKey("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");
console.log(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'hanussyaarjun@gmail.com',
    from: 'jasbir.singh@scaler.com', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };

  sgMail.send(msg).then(()=>{
    console.log("Email Sent");
  }).catch((error)=>{
    console.error(error);
  })