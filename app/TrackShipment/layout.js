// import localFont from "next/font/local";
// // import "./globals.css";
// import Footer from "./components/Footer";
// import Header from "./components/Header";

export const metadata = {
    title: "Travelling Postman",
    description: "Generated by create next app",
};

export default function TrackShipmentLayout({ children }) {
    return (
        <html lang="en">
            <body>
                {children}
            </body>
        </html>
    );
}