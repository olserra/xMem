import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Customization | xmem Documentation",
    description: "Learn how to customize xmem to fit your team's needs.",
};

export default function CustomizationPage() {
    return (
        <div className="space-y-6">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">Customization</h1>

            <div className="space-y-4">
                <p className="leading-7">
                    xmem is designed to be flexible and customizable to suit the needs of different teams and data. Whether
                    you need custom workflows, branding, or integrations, xmem can be tailored to match your requirements.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Customizing the Interface</h2>
                <p className="leading-7">
                    You can adjust the appearance and layout of xmem to better suit your preferences. Customizing the theme,
                    colors, and fonts can help align the interface with your branding or personal style. To customize the interface,
                    modify the CSS files or use custom styles in your project.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Custom Workflows</h2>
                <p className="leading-7">
                    xmem’s API allows you to create custom workflows to automate tasks or integrate with other tools. You can
                    use the API to trigger actions based on certain events, such as when a new _data is added or when a project
                    is completed.
                </p>

                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">Integrating with Other Tools</h2>
                <p className="leading-7">
                    xmem can be integrated with a variety of third-party tools and services, such as Slack, Google Drive, or your
                    internal systems. Use the API to push or pull data from xmem, enabling seamless integrations with your existing
                    tech stack.
                </p>
            </div>
        </div>
    );
}
