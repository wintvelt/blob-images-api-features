import { handler } from "blob-common/core/handler";
import { ses } from 'blob-common/core/ses';
import { problemMailBody, problemMailText } from "./problemMail";

export const main = handler(async (event, context) => {
    const data = JSON.parse(event.body);
    const { name, email, description, logs } = data;
    if (!email) throw new Error('Email missing from data');

    await ses.sendEmail({
        toEmail: process.env.webmaster,
        fromEmail: `clubalmanac ${stage.toUpperCase()} <wouter@clubalmanac.com>`,
        subject: `Probleem gemeld op ${process.env.stage.toUpperCase()}`,
        data: problemMailBody({ name, email, description, logs }),
        textData: problemMailText(),
    });

    console.log({ message: `weekly mail sent with`, data });
    return { message: `problem mail sent` };
});