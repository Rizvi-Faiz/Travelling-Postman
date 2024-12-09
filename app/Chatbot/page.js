"use client";

import { useEffect } from "react";

export default function Chatbot({ children }) {
    useEffect(() => {
        window.watsonAssistantChatOptions = {
            integrationID: "ea607e2c-7266-401d-980b-71fff45d6903", 
            region: "au-syd", 
            serviceInstanceID: "d6c3cf7b-5dcd-4242-b81c-f75a30e18f26", 
            onLoad: async (instance) => {
                await instance.render();
            },
        };

        const script = document.createElement("script");
        script.src = "https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    return <>{children}</>;
}
