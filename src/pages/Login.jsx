// package imports
import { useState } from "react";
import { useNavigate } from "react-router";
// style imports
import styles from "../styles/Login.module.css";
// API imports
import { usePocket } from "../PbContext"; 

const Login = () => {
    // hooks
    const navigate = useNavigate();
    const { login } = usePocket();

    // local state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);   

    // functions

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        // basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        // call login API
        const res = await login(email, password);

        setLoading(false);

        if (res) {
            // error occured
            setError('Incorrect email or password. Please try again.');
            return;
        }
        else {
            // logged in
            navigate('/app');
        }
    }

    return (
        <div className={`${styles.page} page`}>
            <div className={styles.content}>
                <h1>App Name</h1>
                <div className={`card`}>
                    <h1 style={{width: "100%"}}>Login</h1>
                    <button className={`${styles.btn_google} btn_large`}>
                        Continue with Google
                    </button>

                    <div className={styles.or_container}>
                        <hr />
                        <p>or</p>
                        <hr />
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form} action="">
                        <label htmlFor="email" className="input_label">Email address</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email..."
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                            required />

                        <label htmlFor="password" className="input_label">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password..."
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            required />

                        <p className="error">{error}</p>

                        <a className={styles.forgot_pass_link} href="#forgotpass">Forgot password?</a>

                        <button 
                            className={`${styles.btn_login} ${styles.auth_btn} btn_large`} >
                            {loading ? 'Loging in ...' : 'Log in'}
                        </button>
                    </form>
                    <p>Don't have an account? <a href="/signup">Sign up</a></p>                    
                </div>
            </div>     
        </div>
    );
}

export default Login;