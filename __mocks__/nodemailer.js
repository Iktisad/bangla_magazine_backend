// src/__mocks__/nodemailer.js
const nodemailer = {
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValue(true),
    }),
};

export default nodemailer;
