import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const POST = async (req: Request) => {
    const { userId } = await req.json();

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
        to: userId,
        bcc: 'olserra@gmail.com',
        subject: `Welcome! Your User ID is: ${userId}`,
        text: `Hello,\n\nThank you for completing the onboarding process!\n\nYour User ID is: ${userId}\n\nBest Regards,\nOtavio Serra\nFounder & CEO\nopenskills.online`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
};
