import nodemailer from "nodemailer";

// Create a reusable transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// Function to send email
export async function sendEmail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: `"Expeditions George of the Jungle" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}
