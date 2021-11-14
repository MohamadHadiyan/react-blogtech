const nodeMailer = require("nodemailer");
import { OAuth2Client } from "google-auth-library";

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";
const CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
const SENDER_MAIL = `${process.env.SENDER_MAIL_ADDRESS}`;

const sendMail = async (
  to: string,
  url: string,
  name: string,
  text: string
) => {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    OAUTH_PLAYGROUND
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_MAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: access_token,
      },
    });

    const html = emailHtml(to, url, name);

    const mailOptions = {
      from: SENDER_MAIL,
      to: to,
      subject: `${text}`,
      html: html,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export default sendMail;

function emailHtml(to: string, url: string, name: string) {
  return `
  <table id="m_-3266674082788707063wrapper" cellpadding="20" cellspacing="0" border="0" style="width:100%;background-color:#eaeaea;background-image:url(https://ci6.googleusercontent.com/proxy/ql83XJ9oLXv_1MgTWkzlBGmVr-Jdc4KxOzmycb4GNbj1ie38oOvcENkZjZS1Di59J4wTcnWP8-fLBNtdnHVYuSnmQGPOpacnZoN7m1qVYarR72U=s0-d-e1-ft#https://static0.twilio.com/resources/images/email/background.jpg);font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;border-collapse:collapse;margin:0;padding:0;line-height:100%;height:100%;">
  <tbody><tr><td style="border-collapse:collapse;vertical-align:top">

  <table id="m_-3266674082788707063contentTable" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;margin:0 auto;width:680px;border:solid 1px #ddd;border-collapse:collapse">
    <tbody><tr><td style="border-collapse:collapse;vertical-align:top">

      <table id="m_-3266674082788707063header" cellpadding="20" cellspacing="0" border="0" style="border-bottom:solid 1px #ddd;width:100%;border-collapse:collapse">
        <tbody><tr><td style="color:#444;font-size:31px;font-weight:bold;border-collapse:collapse;vertical-align:top">
          <span style="width: 119px; height: 35px; display: block; font-size: 20px; font-weight: 700; color: #ffbe00;">BlogTech</span>
        </td></tr></tbody>
      </table>

      <table cellpadding="30" cellspacing="0" border="0" style="width:100%;border-collapse:collapse">
        <tbody><tr><td id="m_-3266674082788707063message" style="border-collapse:collapse;vertical-align:top">

          <table cellpadding="10" cellspacing="0" border="0" style="width:100%;border-collapse:collapse">
<tbody><tr><td style="border-collapse:collapse;vertical-align:top">
  <p id="m_-3266674082788707063description" style="font-size:16px;color:#555;line-height:26px;font-weight:300;margin:0 40px">
    <span class="notranslate">${name}</span>,
  </p>
</td></tr></tbody>
</table>

<table cellpadding="10" cellspacing="0" border="0" style="width:100%;border-collapse:collapse">
<tbody><tr><td style="border-collapse:collapse;vertical-align:top">
  <p id="m_-3266674082788707063description" style="font-size:16px;color:#555;line-height:26px;font-weight:300;margin:0 40px">
          To activate your Twilio Account, please verify your email address.<br>
    Your account will not be created until your email address is confirmed.
          </p>
</td></tr></tbody>
</table>

<table cellpadding="10" cellspacing="0" border="0" style="width:100%;border-collapse:collapse">
<tbody><tr><td style="border-collapse:collapse;vertical-align:top">
  <p style="font-size:16px;color:#555;line-height:26px;font-weight:300;margin:0 40px">
    <a href="${url}" class="notranslate" style="background-color:#ffbe00; border:1px solid #ffbe00; border-color:#ffbe00; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:normal; letter-spacing:0px; line-height:normal; padding:12px 40px 12px 40px; text-align:center; text-decoration:none; border-style:solid; font-family:inherit;" target="_blank" >Confirm Your Email</a>
  </p>
  </td></tr></tbody>
</table>

<table cellpadding="10" cellspacing="0" border="0" style="width:100%;border-collapse:collapse">
<tbody><tr><td style="border-collapse:collapse;vertical-align:top">
  <p id="m_-3266674082788707063description" style="font-size:16px;color:#555;line-height:26px;font-weight:300;margin:0 40px">
      <br>
        Or, copy and paste the following URL into your browser: <br>
          <span class="notranslate"><a href="${url}">${url}</a></span>
      </p>
</td></tr></tbody>
</table>


        </td></tr></tbody>
      </table>

    </td></tr></tbody>
  </table>

  <table id="m_-3266674082788707063contentTable" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;width:680px;border-collapse:collapse">
    <tbody><tr><td style="border-collapse:collapse;vertical-align:top">

      <table cellpadding="10" cellspacing="0" border="0" style="width:100%;text-align:center;border-collapse:collapse">
      <tbody><tr><td style="border-collapse:collapse;vertical-align:top">

        <br>

        <p style="font-size:12px;color:#555;line-height:19px;font-weight:300;margin:0 30px;text-align:center">
          This system email was sent to <span class="notranslate">${name} (<span class="notranslate"><a href="mailto:${to}" style="color:#555;font-weight:300;text-decoration:none" target="_blank">${to}</a></span>) <span></span>regarding your BlogTech Account
          <br><span class="notranslate">(<wbr>ACb20ed2121b6075f3c84b1452d01f<wbr>7564)</span><span></span>
          <br>by BlogTech, Inc., 375 Azadi Street, Suite 300, Theran, CA 94105
        </p>
        <br>

        <p style="font-size:14px;color:#555;line-height:16px;font-weight:300;margin:20px 30px;text-align:center">
          If you have any questions, simply respond to this email and we'll be happy to help.
          </p>

      </td></tr></tbody>
      </table>

    </td></tr></tbody>
  </table>

</td></tr></tbody>
</table>
  `;
}
