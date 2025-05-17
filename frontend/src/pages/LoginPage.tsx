import { useState } from "react";
import Apis from '../api/Apis';
import texts from "../lang/de.json";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function LoginPage() {
  const t = texts.LoginPage;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await Apis.userLogin(email, password);
      if (response) {
        localStorage.setItem('token', response.data.token);
        login();
        navigate('/admin/');
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-15">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              {t.email_label}
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              {t.password_label}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full text-white py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {t.login_button}
            </button>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
}
