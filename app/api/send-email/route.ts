import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const POST = async (req: Request) => {
    const { userEmail, userName } = await req.json();

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
        subject: 'Welcome to xmem - Your Digital Memory Solution',
        text: `Hello ${userName},\n\nWelcome to xmem! You've just taken the first step toward managing, storing, and connecting your digital memories seamlessly.\n\nxmem empowers you to:\n- Store your memories securely with our advanced API.\n- Connect effortlessly to tools like OpenAI, Copilot, and more.\n- Take control of your digital legacy, ensuring it's always at your fingertips.\n\nStay tuned! We are working on exciting features, including a memory wallet that will revolutionize how you interact with your data.\n\nIf you have any questions or need assistance, our support team is ready to help at support@xmem.digital.\n\nThank you for being an early adopter of xmem. Together, we are shaping the future of memory management.\n\nBest regards,\n\nOtavio Serra\nFounder & CEO\n[xmem.digital](https://xmem.xyz)`
    };

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
};
