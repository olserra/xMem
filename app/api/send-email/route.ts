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
        text: `Hello ${userName},\n\nThank you for completing the onboarding process, and welcome to OpenSkills. You're on the right path, improving and gaining new skills to embrace this wonderful future, which will require plenty of upskilling and reskilling, and you already started building it.\n\nYour User ID is: ${userId}\n\nBest Regards,\n\nOtavio Serra\nFounder & CEO\nopenskills.online`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
};
