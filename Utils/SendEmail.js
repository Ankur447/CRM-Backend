
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    console.log(email);
    
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            // service: process.env.SERVICE,
            port: 587,
            secure: false,
            auth: {
                user:"yashdabhade0001@gmail.com",
                pass: "lwje xtyp swuq whsd",
            },
        });

        await transporter.sendMail({
            from: "yashdabhade0001@gmail.com",
            to: email,
            subject: subject,
            text: text,
        });

        console.log("email sent sucessfully");
    } catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail