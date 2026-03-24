import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            localStorage.setItem('user', JSON.stringify(res.data));
            if (res.data.role === 'camp_manager') {
                navigate('/manager');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Invalid email or password.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 bg-slate-800 p-8 border border-slate-700 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">SIDMS Login</h2>
            {error && <div className="bg-red-900/40 text-red-400 border border-red-500/50 p-3 rounded mb-4 text-sm">{error}</div>}
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                        className="w-full border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your email" />
                </div>
                <div>
                    <label className="block font-bold text-slate-300 mb-1">Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                        className="w-full border border-slate-600 bg-slate-700 text-slate-100 placeholder-slate-400 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Enter your password" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-500 transition">
                    Login
                </button>
            </form>
            <div className="mt-4 text-sm text-slate-500 text-center">
                <p>Authorized personnel only. Contact Admin for new camp allocations.</p>
            </div>
        </div>
    );
};

export default Login;
