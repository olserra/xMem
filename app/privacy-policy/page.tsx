'use client';

import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="flex flex-col justify-center text-center gap-6 mx-8 md:mx-40">
            <h1 className="mt-10 text-2xl">Privacy Policy for xmem</h1>

            <p className="mt-4">
                Effective Date: [Insert Date]
            </p>

            <p>
                At xmem, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you visit our website and use our services.
            </p>

            <h2 className="text-xl mt-6">Information We Collect</h2>
            <p>
                We may collect the following types of information:
            </p>
            <ul className="list-disc list-inside">
                <li><strong>Personal Information:</strong> When you sign up for our services, we may collect personal information such as your name, email address, and any other information you provide.</li>
                <li><strong>Usage Data:</strong> We may collect information about how you access and use our website and services, including your IP address, browser type, pages visited, and the time and date of your visits.</li>
                <li><strong>Memory Data:</strong> If you use our memory storage API, we may collect and store data you provide, such as text, metadata, or other digital content.</li>
                <li><strong>Cookies:</strong> Our website may use cookies to enhance user experience. You can choose to accept or decline cookies.</li>
            </ul>

            <h2 className="text-xl mt-6">How We Use Your Information</h2>
            <p>
                We may use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside">
                <li>To provide and maintain our services, including the memory storage API and integrations.</li>
                <li>To notify you about updates or changes to our services.</li>
                <li>To enable seamless integrations with platforms like OpenAI, Copilot, or others you connect to our services.</li>
                <li>To provide customer support.</li>
                <li>To improve the functionality and reliability of our services through analysis and feedback.</li>
                <li>To monitor usage and detect, prevent, and address technical issues or security breaches.</li>
            </ul>

            <h2 className="text-xl mt-6">Data Security</h2>
            <p>
                We take the security of your personal and memory data seriously and use appropriate measures to protect it. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>

            <h2 className="text-xl mt-6">Third-Party Services</h2>
            <p>
                Our services may integrate with third-party platforms like OpenAI, Copilot, or others. While these integrations are designed to enhance your experience, we are not responsible for the privacy practices or data handling of these platforms. We encourage you to review the privacy policies of any third-party platforms you connect to xmem.
            </p>

            <h2 className="text-xl mt-6">Children Privacy</h2>
            <p>
                Our services are not intended for children under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-xl mt-6">Changes to This Privacy Policy</h2>
            <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any updates.
            </p>

            <h2 className="text-xl mt-6">Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p>Email: <a href="mailto:support@xmem.xyz">support@xmem.xyz</a></p>
            <p>Website: <a href="https://www.xmem.xyz">https://www.xmem.xyz</a></p>
        </div>
    );
};

export default PrivacyPolicyPage;
