import {
    dividerCell, emailBody, row, textCell,
    footerRow, greeting, headerRow, paragraph, signatureCell, makeEmailSrc
} from 'blob-common/core/email';
import { now } from 'blob-common/core/date';

const dividerSrc = makeEmailSrc('public/img/invite_divider.png');

export const problemMailText = () => {
    return `Hi Admin, 
    Er is een probleem gemeld, maar je kunt dit zonder html niet bekijken`;
};

export const problemMailBody = ({ name, email, description, logs = '(geem logs meegestuurd)' }) => {
    return emailBody([
        row([
            textCell(greeting(`Hi Admin,`)),
            textCell(paragraph(`Er is een probleem gemeld op de ${process.env.stage.toUpperCase()} omgeving.`)),
            textCell(paragraph(`Door ${name}, vanaf ${email}, op ${now()}`)),
            textCell(paragraph(`"${description}"`)),
            dividerCell(dividerSrc),
            textCell(paragraph(`${logs}`)),
            dividerCell(dividerSrc),
        ]),
        row([
            textCell(paragraph('We zien je graag terug op clubalmanac')),
            signatureCell(makeEmailSrc('public/img/signature_wouter.png'))
        ]),
        footerRow
    ]);
};