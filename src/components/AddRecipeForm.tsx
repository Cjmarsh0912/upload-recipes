import { useState } from 'react';

interface AddRecipeFormProps {}

const AddRecipeForm: React.FC<AddRecipeFormProps> = () => {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<{ header: string; step: string }[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const handleKeywordAdd = () => {
    setKeywords([...keywords, '']);
  };

  const handleIngredientAdd = () => {
    setIngredients([...ingredients, '']);
  };

  const handleStepAdd = () => {
    setSteps([...steps, { header: '', step: '' }]);
  };

  const handleKeywordRemove = (index: number) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);
    setKeywords(updatedKeywords);
  };

  const handleIngredientRemove = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const handleStepRemove = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
  };

  const handleKeywordChange = (index: number, value: string) => {
    const updatedKeywords = [...keywords];
    updatedKeywords[index] = value;
    setKeywords(updatedKeywords);
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    setIngredients(updatedIngredients);
  };

  const handleStepChange = (
    index: number,
    field: 'header' | 'step',
    value: string
  ) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    setSteps(updatedSteps);
  };

  const handleCategoryChange = (value: string) => {
    if (categories.includes(value)) {
      setCategories(categories.filter((category) => category !== value));
    } else {
      setCategories([...categories, value]);
    }
  };

  return (
    <form className='add-recipe-form'>
      <h2>Add Recipe</h2>

      <div className='form-group'>
        <label htmlFor='recipe-name'>Recipe Name</label>
        <input type='text' id='recipe-name' />
      </div>

      <div className='form-group'>
        <label htmlFor='recipe-description'>Recipe Description</label>
        <textarea id='recipe-description' rows={4}></textarea>
      </div>

      <div className='cook-time'>
        <div className='form-group'>
          <label htmlFor='prep-time'>Prep Time (minutes)</label>
          <input type='number' id='prep-time' min={0} />
        </div>
        <div className='form-group'>
          <label htmlFor='cook-time'>Cook Time (minutes)</label>
          <input type='number' id='cook-time' min={0} />
        </div>
        <div className='form-group'>
          <label htmlFor='total-time'>Total Time (minutes)</label>
          <input type='number' id='total-time' min={0} />
        </div>
      </div>

      <div className='form-group'>
        <label>Categories</label>
        <div className='checkbox-group'>
          <label>
            <input
              type='checkbox'
              name='categories'
              value='lunch'
              checked={categories.includes('lunch')}
              onChange={() => handleCategoryChange('lunch')}
            />
            Lunch
          </label>
          <label>
            <input
              type='checkbox'
              name='categories'
              value='dinner'
              checked={categories.includes('dinner')}
              onChange={() => handleCategoryChange('dinner')}
            />
            Dinner
          </label>
          <label>
            <input
              type='checkbox'
              name='categories'
              value='sides'
              checked={categories.includes('sides')}
              onChange={() => handleCategoryChange('sides')}
            />
            Sides
          </label>
          <label>
            <input
              type='checkbox'
              name='categories'
              value='dessert'
              checked={categories.includes('dessert')}
              onChange={() => handleCategoryChange('dessert')}
            />
            Dessert
          </label>
        </div>
      </div>

      <div className='form-group'>
        <label htmlFor='image'>
          Image (if no image available go{' '}
          <a href='https://unsplash.com/'>here</a> for an open source image)
        </label>
        <input type='file' id='image' />
      </div>

      <div className='form-group'>
        <label htmlFor='keywords'>
          Keywords (keywords are used for searching. ex. beef, baked, fried,
          etc)
        </label>
        {keywords.map((keyword, index) => (
          <div key={index} className='input-group'>
            <input
              type='text'
              value={keyword}
              onChange={(e) => handleKeywordChange(index, e.target.value)}
            />
            <button type='button' onClick={() => handleKeywordRemove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' onClick={handleKeywordAdd}>
          Add Keyword
        </button>
      </div>

      <div className='form-group'>
        <label htmlFor='ingredients'>Ingredients</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className='input-group'>
            <input
              type='text'
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
            />
            <button type='button' onClick={() => handleIngredientRemove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' onClick={handleIngredientAdd}>
          Add Ingredient
        </button>
      </div>

      <div className='form-group'>
        <label htmlFor='steps'>Steps</label>
        {steps.map((step, index) => (
          <div key={index} className='input-group'>
            <input
              type='text'
              placeholder='Header (required)'
              value={step.header}
              onChange={(e) =>
                handleStepChange(index, 'header', e.target.value)
              }
            />
            <input
              type='text'
              placeholder='Step'
              value={step.step}
              onChange={(e) => handleStepChange(index, 'step', e.target.value)}
            />
            <button type='button' onClick={() => handleStepRemove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type='button' onClick={handleStepAdd}>
          Add Step
        </button>
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default AddRecipeForm;
