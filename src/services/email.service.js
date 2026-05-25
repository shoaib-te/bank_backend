require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const userRegisterationEmail=async(useremail,username)=>{
    const subject="Welcome to Your Secure Mobile Banking Account 🏦";
    const text=`Hello ${username},\n\nWelcome to Digital Bank! Your account registration is complete.\nFor your security, never share your login credentials or OTP with anyone.\n\nLog in here: https://yourbank.com\n\nIf you did not create this account, please contact fraud support immediately.`;
    const html=`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #003366;">Welcome to Digital Bank, ${username}!</h2>
           
        </div>
    `;
    await sendEmail(useremail,subject,text,html);
}

const transactionAlertEmail=async(useremail,username,amount,toAccountId)=>{
    const subject="Transaction Alert from Your Digital Bank Account 🏦";
    const text=`Hello ${username},\n\nYour transaction of amount ${amount} to account ${toAccountId} has been completed.\n\nIf you did not authorize this transaction, please contact fraud support immediately.`;
    const html=`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #003366;">Transaction Alert for ${username}</h2>
            <p>Your transaction of amount ${amount} to account ${toAccountId} has been completed.</p>
        </div>
    `;
    await sendEmail(useremail,subject,text,html);
}
const transactionFailureEmail=async(useremail,username,amount,toAccountId,errorMessage)=>{  

    const subject="Transaction Failure Alert from Your Digital Bank Account 🏦";
    const text=`Hello ${username},\n\nWe regret to inform you that your transaction of amount ${amount} to account ${toAccountId} has failed.\nError Details: ${errorMessage}\n\nPlease review your transaction details and try again. If you need assistance, contact our support team.`;
    const html=`
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">   
            <h2 style="color: #003366;">Transaction Failure Alert for ${username}</h2>
            <p>We regret to inform you that your transaction of amount ${amount} to account ${toAccountId} has failed.</p>
            <p><strong>Error Details:</strong> ${errorMessage}</p>  
            <p>Please review your transaction details and try again. If you need assistance, contact our support team.</p>
        </div>
    `;
    await sendEmail(useremail,subject,text,html);
}



module.exports = {
    userRegisterationEmail,
    transactionAlertEmail,
    transactionFailureEmail
    

}