"use client";

import React, { useEffect } from "react";

const AdminLayout = ({ children }) => {
    useEffect(() => {
        // Watson Assistant Chat Options
        window.watsonAssistantChatOptions = {
            integrationID: "ea607e2c-7266-401d-980b-71fff45d6903", // Replace with your integration ID
            region: "au-syd", // Replace with your region
            serviceInstanceID: "d6c3cf7b-5dcd-4242-b81c-f75a30e18f26", // Replace with your service instance ID
            onLoad: async (instance) => {
                await instance.render();
            },
        };

        // Dynamically Load Watson Assistant Script
        const script = document.createElement("script");
        script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            // Cleanup script if necessary
            document.head.removeChild(script);
        };
    }, []);

    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
};

export default AdminLayout;