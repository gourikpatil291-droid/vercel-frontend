const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aartigaurik251@gmail.com',
        pass: 'mwisbutvkmmodsfx' // Try without spaces
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.log("Error:", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});
