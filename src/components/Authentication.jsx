import { useState } from "react"
import { useAuth } from "../context/AuthContext";

export default function Authentication(props) {

    const {handleCloseModal} = props
    const [isRegisteration, setIsRegistration] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [error, setError] = useState(null);

    const {signup, login} = useAuth()

    async function handleAuthenticate() {
        if (!email || !email.includes('@' || !password || password.length < 6 || isAuthenticating)) {
            return;
        }

        try {
            setIsAuthenticating(true);
            setError(null)

            if(isRegisteration) {
                // Register a user
                await signup(email, password)
            } else {
                // login a user
                await login(email, password)
            }
            handleCloseModal()
            
        } catch (error) {
            console.log(error.message);
            setError(error.message)
            
        } finally {
            setIsAuthenticating(false)
        }


    }
    return (
        <>
            <h2 className="sign-up-text">{ isRegisteration ? 'Sign up' : 'Login'}</h2>
            <p>{isRegisteration ? 'Create an account' : 'Sign in to your account'}</p>
            {error && (
                <p>❌ {error}</p>
            )}
            <label htmlFor="email">Enter Email:</label>
            <input id="email" value={email} onChange={(event) => {setEmail(event.target.value)}} type="email" placeholder="Email" />
            <label htmlFor="password">Enter your password:</label>
            <input id="password" value={password} onChange={(event) => {setPassword(event.target.value)}} type="password" placeholder="********" />
            {/* {(isRegisteration 
                ? (
                    <>
                        <label htmlFor="confirmPassword">Confirm your password:</label>
                        <input id="confirmPassword" value={confirmPassword} onChange={(event) => {setConfirmPassword(event.target.value)}} type="password" placeholder="********" />
                    </>
                ) : ( '' )           
            )} */}

            <button onClick={handleAuthenticate}><p>{isAuthenticating? 'Authenticating...' : 'Submit'}</p></button>
            <hr />
            <div className="register-content">
                <p>{isRegisteration ? 'Already have an account' : `Don\'t have an account?`}</p>
                <button onClick={() => setIsRegistration(!isRegisteration)}><p>{ isRegisteration ? 'Sign in' : 'Sign up'}</p></button>
            </div>

        </>
    )
}