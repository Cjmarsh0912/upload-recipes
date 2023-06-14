import AddRecipeForm from 'components/AddRecipeForm';

import { db } from './firebase';

import './assets/App.css';

function App() {
  return (
    <main>
      <AddRecipeForm />
    </main>
  );
}

export default App;
