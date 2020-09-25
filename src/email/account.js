
const SendGrid = require('sendgrid')
const helper = SendGrid.mail
const fromEmail = new helper.Email('linzh107@gmail.com');
const sg = SendGrid(process.env.SENDGRID_API_KEY);

const sgSendWelcome = (email, name) => {
    const toEmail = new helper.Email(email);
    const subject = `Hi ${name}, Welcome onboard!`;
    const content = new helper.Content('text/plain', `${name} and easy to do anywhere, even with Node.js`);
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);
    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.headers);
        console.log(response.body);
    });
}

const sgSendCancellation = (email, name) => {
    const toEmail = new helper.Email(email);
    const subject = 'Sorry to see you go';
    const content = new helper.Content('text/plain', `${name}, We are looking forward to see you back soon!`);
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);
    const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON()
    });

    sg.API(request, function (error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.headers);
        console.log(response.body);
    });
}

module.exports = {
    sgSendWelcome,
    sgSendCancellation
}
