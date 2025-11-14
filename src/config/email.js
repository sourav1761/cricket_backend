import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'acplt10@gmail.com',
    pass: 'eggc dtja qsqv wypb',
  },
});

export async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"Cricket Trials" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
