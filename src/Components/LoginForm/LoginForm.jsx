import './LoginForm.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaUser,FaLock } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";

const LoginForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try{
        const response = await fetch('http://localhost:8083/api/pharmacy/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userName: username,
                password: password,
            }),
        });

        if (response.ok) {
            await response.json();
            navigate('/dashboard');
        
        } else {
            setError('Invalid username or password!');
        }
    } catch (error) {
        setError('An error occurred. Please try again.');
    }
    };


  return (
    <div className='login-wrapper'>
        <form onSubmit={handleSubmit}>
            <GiMedicines className='login-top-icon' />
            <p>Welcome back!</p>
            <p className='login-sub-topic'>Sign in to your account to continue.</p>
            <div className="login-input-box">
                <input type="text" placeholder='Username' onChange={e => setUsername(e.target.value)} required />
                <FaUser className='icon' />
            </div>
            <div className="login-input-box">
                <input type="password" placeholder='Password' onChange={e => setPassword(e.target.value)} required />
                <FaLock className='icon' />
            </div>
             {error && <div className="login-error">{error}</div>}
            <button type='submit'>Login</button>

            <div className="login-register-link">
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </form>
    </div>
  )
}

export default LoginForm
