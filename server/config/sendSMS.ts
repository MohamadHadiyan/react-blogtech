import { Twilio } from "twilio";

const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
const client = new Twilio(accountSid, authToken);
const from = `${process.env.TWILIO_PHONE_NUMBER}`;
const serviceSid = `${process.env.TWILIO_SERVICE_SID}`;

export const sendSMS = (to: string, body: string, text: string) => {
  try {
    client.messages
      .create({
        body: `BlogTech ${text} - ${body}`,
        from,
        to,
      })
      .then((message) => console.log(message.sid));
  } catch (err: any) {
    console.log(err);
  }
};

export const smsOTP = async (to: string, channel: string) => {
  try {
    const data = await client.verify
      .services(serviceSid)
      .verifications.create({ to, channel });
    return data;
  } catch (err: any) {
    console.log(err);
  }
};

export const smsVerify = async (to: string, code: string) => {
  try {
    const data = await client.verify
      .services(serviceSid)
      .verificationChecks.create({ to, code });
    return data;
  } catch (err: any) {
    console.log(err);
  }
};
