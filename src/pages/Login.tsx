import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      navigate('/admin');
    } else {
      setError('Login yoki parol xato!');
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Tizimga kirish</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">Login</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Parol</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;