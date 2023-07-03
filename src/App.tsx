import AddRecipeForm from 'components/AddRecipeForm';
import Login from 'components/Login';

import { useState, useEffect } from 'react';

import { getAuth, onAuthStateChanged } from 'firebase/auth';

import './assets/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateIsLoggedIn = () => {
    setIsLoggedIn(true);
  };

  const updateIsLoading = () => {
    setIsLoading(!isLoading);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setIsLoggedIn(true);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);
  return (
    <main>
      {isLoading ? (
        <div className='loading'>
          <h1 data-text='Loading...'>Loading...</h1>
        </div>
      ) : (
        <>
          {!isLoggedIn ? (
            <Login updateIsLoggedIn={updateIsLoggedIn} />
          ) : (
            <AddRecipeForm />
          )}
        </>
      )}
    </main>
  );
}

export default App;
