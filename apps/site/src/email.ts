import { Resend } from "resend";
import { env } from "./env";

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  from,
  subject,
  html,
}: {
  to: string;
  from: string;
  subject: string;
  html: string;
}) => {
  return resend.emails.send({
    from,
    to: [to],
    subject,
    html,
  });
};
