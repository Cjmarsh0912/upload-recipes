import { useState } from 'react';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

type LoginProps = {
  updateIsLoggedIn: () => void;
};

export default function Login({ updateIsLoggedIn }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [usernameErrorMessage, setUsernameErrorMessage] = useState<string>('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');

  const auth = getAuth();

  const loginToFirebase = async () => {
    if (username !== 'admin') {
      setUsernameErrorMessage('Incorrect username and/or password.');
      return;
    }
    try {
      const email = username + '@admin.com';
      await signInWithEmailAndPassword(auth, email, password);
      alert('Singed In!');
      updateIsLoggedIn();
    } catch (error: any) {
      const errorCode = error.code;

      switch (errorCode) {
        case 'auth/wrong-password':
          setPasswordErrorMessage(
            'The password you entered is incorrect. Please enter the correct password and try again.'
          );
          break;
        case 'auth/user-not-found':
          setUsernameErrorMessage(
            'The username you entered is not registered. Please check your username and try again.'
          );
          break;
        case 'auth/invalid-email':
          setUsernameErrorMessage(
            'The email you entered is not in a valid format. Please enter a valid email address.'
          );
          break;
        case 'auth/user-disabled':
          setUsernameErrorMessage('Your account has been disabled.');
          break;
        case 'auth/network-request-failed':
          setUsernameErrorMessage(
            'There was a problem with your network connection. Please check your internet connection and try again.'
          );
          break;
        case 'auth/operation-not-allowed':
          setUsernameErrorMessage(
            "Sorry, we're unable to process your request at this time. Please try again later."
          );
          break;
        default:
          alert(errorCode);
      }
      return;
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let isErrors = false;

    if (username.trim() === '') {
      setUsernameErrorMessage('No username selected.');
      isErrors = true;
    } else setUsernameErrorMessage('');

    if (password.trim() === '') {
      setPasswordErrorMessage('No password selected.');
      isErrors = true;
    } else setPasswordErrorMessage('');

    if (isErrors) return;

    loginToFirebase();
  };

  return (
    <div className='box'>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span className='error'>{usernameErrorMessage}</span>
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className='error'>{passwordErrorMessage}</span>
          <div className='show-password'>
            <input
              type='checkbox'
              id='show-password'
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label htmlFor='show-password'>Show Password</label>
          </div>
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  );
}
