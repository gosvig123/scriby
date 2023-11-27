import { RESEND_API_KEY } from "../../constants";
// Create a transporter object using the default SMTP transport
import { Resend } from "resend";

async function loadApiKey() {
  return new Resend(await RESEND_API_KEY);
}
export const emails = {
  welcome: async (email: string) =>
    (await loadApiKey()).emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Hello World",
      html: `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Scriby</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background: #fff;
              }
              .logo {
                  display: block;
                  margin: 0 auto 20px auto;
              }
              .content {
                  font-size: 16px;
              }
              .footer {
                  text-align: center;
                  margin-top: 20px;
                  font-size: 14px;
                  color: #666;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <img src="cid:scriby-logo" alt="Scriby Logo" class="logo" width="200">
      
              <div class="content">
                  <h1>Welcome to Scriby!</h1>
                  <p>Hello,</p>
                  <p>We're thrilled to welcome you to Scriby – your reliable transcription service. Get ready to experience seamless and accurate transcription like never before!</p>
      
                  <h2>Getting Started</h2>
                  <p>Here are some tips to help you get started:</p>
                  <ul>
                      <li>Upload your audio or video files directly to your dashboard.</li>
                      <li>Access your transcripts in various formats.</li>
                      <li>Enjoy quick turnaround times and high accuracy.</li>
                  </ul>
      
                  <p>If you have any questions or need assistance, our support team is always here to help.</p>
      
                  <h2>Stay Connected</h2>
                  <p>Don't miss out on updates and tips:</p>
                  <ul>
                      <li>Follow us on <a href="your-social-media-link">Social Media</a></li>
                      <li>Check out our <a href="your-blog-link">Blog</a> for the latest news</li>
                  </ul>
      
                  <p>Thank you for choosing Scriby. We look forward to helping you with all your transcription needs.</p>
      
                  <p>Cheers,</p>
                  <p><strong>The Scriby Team</strong></p>
              </div>
      
              <div class="footer">
                  <p>&copy; <span id="year"></span> Scriby Transcription Services</p>
              </div>
          </div>
      
          <script>
              document.getElementById('year').textContent = new Date().getFullYear();
          </script>
      </body>
      </html>
      `,
    }),
};
