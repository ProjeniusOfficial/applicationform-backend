// backend/services/emailService.js
const nodemailer = require('nodemailer');

// 1. Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // Your app password from .env
  },
});

// 2. Create the function to send the emails
const sendConfirmationEmails = async (application, downloadLink) => {
  const { fullName, email, businessName } = application;
  const adminEmail = process.env.ADMIN_EMAIL;
  
  // --- Get the Admin Page URL from .env ---
  const adminPageUrl = process.env.ADMIN_PAGE_URL;

  // --- Email 1: To the Applicant (This is perfect) ---
  // (Contains the direct PDF download link)
  const applicantMailOptions = {
    from: `"PSNA Technology Foundation" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your Application to PSNA Technology Foundation',
    html: `
      <p>Dear ${fullName},</p>
      <p>Thank you for submitting your application. We have successfully received it.</p>
      <p>You can view and download a copy of your submitted application by clicking the link below:</p>
      <p><a href="${downloadLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Download Your Application PDF</a></p>
      <p>We will review your application and get back to you soon.</p>
      <p>Best regards,<br>The PSNA Team</p>
    `,
  };

  // --- Email 2: To the Admin (This is the updated part) ---
  // (Contains the link to the Admin Dashboard)
  const adminMailOptions = {
    from: `"${fullName} (Application)" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    replyTo: email, 
    subject: `New Application Received from ${fullName} (${businessName})`,
    html: `
      <p>A new application has been submitted.</p>
      <p><strong>Applicant Name:</strong> ${fullName}</p>
      <p><strong>Business Name:</strong> ${businessName}</p>
      <p><strong>Applicant's Email:</strong> ${email}</p>
      <p>You can view and manage all applications in the new Admin Dashboard:</p>
      <p><a href="${adminPageUrl}" style="padding: 10px 15px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">Go to Admin Dashboard</a></p>
      <hr>
      <p><em>To respond, just click "Reply" in your email client. You will be replying directly to ${fullName} (${email}).</em></p>
    `,
  };

  // 3. Send both emails
  try {
    await transporter.sendMail(applicantMailOptions);
    console.log(`Confirmation email sent to ${email}`);
    
    await transporter.sendMail(adminMailOptions);
    console.log(`Notification email sent to admin`);
  } catch (error) {
    console.error('Error sending emails:', error);
    // We throw the error so the main route can catch it
    throw new Error('Failed to send confirmation emails.');
  }
};

module.exports = { sendConfirmationEmails };