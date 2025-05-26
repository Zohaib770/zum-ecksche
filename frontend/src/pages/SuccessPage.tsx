// src/pages/SuccessPage.tsx
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Zahlung erfolgreich!</h1>
        <p className="text-gray-600 mb-6">
          Vielen Dank für Ihre Bestellung. Sie erhalten in Kürze eine Bestätigung per E-Mail.
        </p>
        <Link
          to="/"
          className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
