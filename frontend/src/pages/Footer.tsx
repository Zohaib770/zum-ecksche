import { FaTruck, FaCreditCard, FaLeaf, FaHandshake } from 'react-icons/fa';
import texts from "../lang/de.json";

const Footer = () => {
  const t = texts.Footer;

  return (
    <>
    <div className="py-8 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{t.title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full text-yellow-500 flex items-center justify-center text-2xl mb-3">
            <FaTruck />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.fastDeliveryTitle}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{t.fastDeliveryText}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full text-yellow-500 flex items-center justify-center text-2xl mb-3">
            <FaCreditCard />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.onlinePaymentTitle}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{t.onlinePaymentText}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full text-yellow-500 flex items-center justify-center text-2xl mb-3">
            <FaLeaf />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.freshIngredientsTitle}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{t.freshIngredientsText}</p>
        </div>
        <div className="bg-gray-50 rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full text-yellow-500 flex items-center justify-center text-2xl mb-3">
            <FaHandshake />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t.contactlessDeliveryTitle}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{t.contactlessDeliveryText}</p>
        </div>
      </div>
    </div>

    <footer className="bg-gray-800 text-white py-10 px-6 md:px-16 mt-10">
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-center md:text-left">

        <div>
          <h3 className="font-semibold text-lg mb-2">{t.kontakt}</h3>
          <p className="whitespace-pre-line">{t.address}</p>
          <p className="mt-2">{t.tel}</p>
          <p>{t.whatsapp}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">{t.opening_hours_title}</h3>
          <p className="whitespace-pre-line">{t.opening_hours}</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">{t.delivery_title}</h3>
          <p className="whitespace-pre-line">{t.delivery_areas}</p>
        </div>
      </div>
      <div className="mt-10 text-center text-xs text-gray-400">
        {t.rechte_vorbehalten}
      </div>
    </footer>

    </>
  );
};

export default Footer;
