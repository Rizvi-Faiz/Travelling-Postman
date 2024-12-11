"use client";
import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      console.error("Error sending email:", error);
      setResponseMessage("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Contact Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium">
              Recipient Email
            </label>
            <input
              type="email"
              id="recipient"
              name="recipient"
              placeholder="Enter recipient's email"
              value={formData.recipient}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 rounded-lg border border-gray-700 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Enter subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 rounded-lg border border-gray-700 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleChange}
              required
              className="mt-1 w-full p-3 h-32 rounded-lg border border-gray-700 bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send Email
          </button>
        </form>
        {responseMessage && (
          <p className="mt-4 text-center text-sm text-gray-400">
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}