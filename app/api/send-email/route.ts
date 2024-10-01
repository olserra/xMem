import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const POST = async (req: Request) => {
    const { userId, userEmail, userName } = await req.json();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'olserra@gmail.com',
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    // Email options
    const mailOptions = {
        from: 'olserra@gmail.com',
        to: userEmail,
        bcc: 'olserra@gmail.com',
        subject: `Welcome! Your User ID is: ${userId}`,
        text: `Hello ${userName},\n\nThank you for completing the onboarding process, and welcome to OpenSkills! You're on the right path to improving and acquiring new skills to embrace the future, which will require continuous upskilling and reskilling. You've already taken the first step in this journey!\n\nYour User ID is: **${userId}**\n\nTo help you get started, we invite you to chat with our AI coach. [Click here to begin your conversation](https://chatgpt.com/g/g-kqRCHmM5H-openskills) and explore how it can assist you on your learning journey.\n\nIf you have any questions or need assistance, feel free to reach out to our support team at olserra@gmail.com.\n\nBest regards,\n\nOtavio Serra\nFounder & CEO\n[openskills.online](https://openskills.online)`
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
};
