import CookieConsent from "react-cookie-consent";

function CookieBanner() {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Akzeptieren"
            declineButtonText="Ablehnen"
            enableDeclineButton
            cookieName="userConsent"
            containerClasses="z-50 bg-blue-700 p-4 text-white text-sm flex flex-col md:flex-row items-center justify-between gap-4"
            contentClasses="flex-1"
            buttonClasses="bg-white text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-100 transition"
            declineButtonClasses="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
            expires={150}
        >
            Diese Website verwendet Cookies, um die Benutzererfahrung zu verbessern.{" "}
            <a href="/haftungsausschluss" className="underline text-white hover:text-gray-200 ml-1">
                Mehr erfahren
            </a>
        </CookieConsent>
    );
}

export default CookieBanner;
