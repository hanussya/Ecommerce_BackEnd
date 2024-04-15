const nodemailer = require("nodemailer");
require('dotenv').config();

const transpoter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
        },
        
})

const SENDMAIL= async (mailDetails,callback)=>{
try{
const info = await transpoter.sendMail(mailDetails);
callback(info);
}catch(err){
console.log(err);
}
}

const HTML_TEMPLATE = (text) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>NodeMailer Email Template</title>
    <style>
    .container {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #f4f4f4;
    }
    .email {
    width: 80%;
    margin: 0 auto;
    background-color: #fff;
    padding: 20px;
    }
    .email-header {
    background-color: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
    }
    .email-body {
    padding: 20px;
    }
    .email-footer {
    background-color: #333;
    color: #fff;
    padding: 20px;
    text-align: center;
    }
    </style>
    </head>
    <body>
    <div class="container">
    <div class="email">
    <div class="email-header">
    <h1>EMAIL HEADER</h1>
    </div>
    <div class="email-body">
    <p>${text}</p>
    </div>
    <div class="email-footer">
    <p>EMAIL FOOTER</p>
    </div>
    </div>
    </div>
    </body>
    </html>
    `;
    }

    const message = "Hi there, you were emailed me through nodemailer"
    const options = {
    from: process.env.EMAIL, // sender address
    to: "hanussyaarjunan@gmail.com", // receiver email
    subject: "Send email in Node.JS with Nodemailer using Gmail account", // Subject line
    text: message,
    html: HTML_TEMPLATE(message),
    }
    SENDMAIL(options,(info)=>{
        console.log("Email sent successfully");
console.log("MESSAGE ID: ", info.messageId);

    })
    
module.exports={
    SENDMAIL,HTML_TEMPLATE
}
    