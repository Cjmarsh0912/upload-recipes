import AddRecipeForm from 'components/AddRecipeForm';
import Login from 'components/Login';

import { useState } from 'react';

import { getAuth } from 'firebase/auth';
import { db } from './firebase';

import './assets/App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const auth = getAuth();

  const updateIsLoggedIn = () => {
    setIsLoggedIn(true);
  };
  return (
    <main>
      {!isLoggedIn ? (
        <Login updateIsLoggedIn={updateIsLoggedIn} />
      ) : (
        <AddRecipeForm />
      )}
    </main>
  );
}

export default App;
