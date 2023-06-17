import { useState, useReducer, useEffect, useRef } from 'react';

import { convertString, capitalizeString } from 'functions/functions';

import { v4 as uuid } from 'uuid';

import { RecipeData } from 'interfaces/interface';

type Action = {
  type: string;
  payload: any;
};

type FormData = {
  id: string;
  recipe_name: string;
  keywords: string[];
  categories: string[];
  description: string;
  prep_time: number;
  cook_time: number;
  image: string;
  ingredients: string[];
  steps: {
    header: string;
    step: string;
  }[];
};

const initialValue: RecipeData = {
  id: uuid(),
  recipe_name: '',
  keywords: [],
  extension: '',
  categories: [],
  category_extension: '',
  rating: 0,
  comments: [],
  description: '',
  date_posted: '',
  prep_time: 0,
  cook_time: 0,
  total_time: 0,
  image: '',
  ingredients: [],
  steps: [],
};

const reducer = (state: RecipeData, action: Action): RecipeData => {
  switch (action.type) {
    case 'SET_RECIPE_NAME':
      return { ...state, recipe_name: action.payload };

    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };

    case 'SET_KEYWORDS':
      return { ...state, keywords: action.payload };

    case 'SET_EXTENSION':
      return { ...state, extension: action.payload };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_CATEGORY_EXTENSION':
      return { ...state, category_extension: action.payload };

    case 'SET_DATE_POSTED':
      return { ...state, date_posted: action.payload };

    case 'SET_PREP_TIME':
      return { ...state, prep_time: action.payload };

    case 'SET_COOK_TIME':
      return { ...state, cook_time: action.payload };

    case 'SET_TOTAL_TIME':
      return { ...state, total_time: action.payload };

    case 'SET_IMAGE':
      return { ...state, image: action.payload };

    case 'SET_INGREDIENTS':
      return { ...state, ingredients: action.payload };

    case 'SET_STEPS':
      return { ...state, steps: action.payload };

    default:
      return state;
  }
};

const AddRecipeForm = () => {
  const [formData, dispatch] = useReducer(reducer, initialValue);
  const [tempImage, setTempImage] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState({
    recipe_name: '',
    keywords: '',
    categories: '',
    description: '',
    date_posted: '',
    prep_time: '',
    cook_time: '',
    total_time: '',
    image: '',
    ingredients: '',
    steps: '',
  });
  const types = {
    recipeName: 'SET_RECIPE_NAME',
    description: 'SET_DESCRIPTION',
    keywords: 'SET_KEYWORDS',
    extension: 'SET_EXTENSION',
    categories: 'SET_CATEGORIES',
    categoryExtension: 'SET_CATEGORY_EXTENSION',
    datePosted: 'SET_DATE_POSTED',
    prepTime: 'SET_PREP_TIME',
    cookTime: 'SET_COOK_TIME',
    totalTime: 'SET_TOTAL_TIME',
    image: 'SET_IMAGE',
    ingredients: 'SET_INGREDIENTS',
    steps: 'SET_STEPS',
  };
  const {
    categories,
    cook_time,
    description,
    ingredients,
    keywords,
    prep_time,
    recipe_name,
    steps,
    total_time,
  } = formData;

  const keywordInputRef = useRef<HTMLInputElement>(null);
  const ingredientInputRef = useRef<HTMLInputElement>(null);
  const stepInputRef = useRef<HTMLInputElement>(null);

  const handleRecipeNameChange = (value: string) => {
    dispatch({ type: types.recipeName, payload: capitalizeString(value) });
    dispatch({ type: types.extension, payload: convertString(value) });
  };

  const handleRecipeTimeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    if (event.target.value === '') {
      dispatch({ type: type, payload: '' });
      return;
    }
    dispatch({ type: type, payload: parseInt(event.target.value) });
  };

  const handleCategoryChange = (value: string) => {
    if (categories.includes(value)) {
      const newCategories = [...categories].filter((category) => {
        return category !== value;
      });
      dispatch({ type: types.categories, payload: newCategories });
    } else {
      dispatch({
        type: types.categories,
        payload: [...categories, value],
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      setTempImage(file);
    } else {
      setTempImage(null);
    }
  };

  const handleAddInput = (
    array: string[],
    type: string,
    ref: React.RefObject<HTMLInputElement>
  ) => {
    dispatch({
      type: type,
      payload: [...array, ''],
    });

    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 0);
  };

  const handleKeywordChange = (index: number, value: string) => {
    const updatedKeywords = [...keywords];
    updatedKeywords[index] = value;
    dispatch({ type: types.keywords, payload: updatedKeywords });
  };

  const handleKeywordRemove = (index: number) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);
    dispatch({ type: types.keywords, payload: updatedKeywords });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = value;
    dispatch({ type: types.ingredients, payload: updatedIngredients });
  };

  const handleIngredientRemove = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    dispatch({ type: types.ingredients, payload: updatedIngredients });
  };

  const handleStepChange = (
    index: number,
    field: 'header' | 'step',
    value: string
  ) => {
    const updatedSteps = [...steps];
    updatedSteps[index][field] = value;
    dispatch({ type: types.steps, payload: updatedSteps });
  };

  const handleStepRemove = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    dispatch({ type: types.steps, payload: updatedSteps });
  };

  const addRecipeToDatabase = (formData: RecipeData) => {};

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (recipe_name === '')
      setFormErrors({ ...formErrors, recipe_name: 'Recipes must have a name' });

    console.log(formData);
  };

  useEffect(() => {
    dispatch({
      type: types.totalTime,
      payload: cook_time + prep_time,
    });
  }, [cook_time, prep_time]);

  return (
    <form onSubmit={handleSubmit} className='add-recipe-form'>
      <h2>Add Recipe</h2>

      <div className='form-group'>
        <label htmlFor='recipe-name'>
          Recipe Name{' '}
          {formErrors.recipe_name === '' ? null : (
            <span className='errors'>({formErrors.recipe_name})</span>
          )}
        </label>
        <input
          type='text'
          id='recipe-name'
          name='recipe-name'
          style={{
            borderColor: formErrors.recipe_name !== '' ? 'red' : '',
          }}
          value={recipe_name}
          onChange={(e) => handleRecipeNameChange(e.target.value)}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='recipe-description'>Recipe Description</label>
        <textarea
          id='recipe-description'
          rows={4}
          value={description}
          onChange={(e) =>
            dispatch({ type: types.description, payload: e.target.value })
          }
        ></textarea>
      </div>

      <div className='cook-time'>
        <div className='form-group'>
          <label htmlFor='prep-time'>Prep Time (minutes)</label>
          <input
            type='number'
            id='prep-time'
            min={0}
            value={prep_time}
            onChange={(e) => handleRecipeTimeChange(e, types.prepTime)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='cook-time'>Cook Time (minutes)</label>
          <input
            type='number'
            id='cook-time'
            min={0}
            value={cook_time}
            onChange={(e) => handleRecipeTimeChange(e, types.cookTime)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='total-time'>Total Time (minutes)</label>
          <input
            type='number'
            id='total-time'
            min={0}
            value={cook_time + prep_time}
            readOnly
          />
        </div>
      </div>

      <div className='form-group'>
        <label>Categories</label>
        <div className='checkbox-group'>
          <label>
            <input
              type='checkbox'
              name='categories'
              value='Lunch'
              checked={categories.includes('Lunch')}
              onChange={() => handleCategoryChange('Lunch')}
            />
            Lunch
          </label>
          <label>
            <input
              type='checkbox'
              name='categories'
              value='Dinner'
              checked={categories.includes('Dinner')}
              onChange={() => handleCategoryChange('Dinner')}
            />
            Dinner
          </label>
          <label>
            <input
              type='checkbox'
              name='categories'
              value='Sides'
              checked={categories.includes('Sides')}
              onChange={() => handleCategoryChange('Sides')}
            />
            Sides
          </label>
          <label>
            <input
              type='checkbox'
              name='categories'
              value='Dessert'
              checked={categories.includes('Dessert')}
              onChange={() => handleCategoryChange('Dessert')}
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
        <input
          accept='image/*'
          type='file'
          id='image'
          onChange={(e) => handleFileChange(e)}
        />
      </div>

      <div className='form-group'>
        <label htmlFor='keywords'>
          Keywords (keywords are used for searching. ex. beef, baked, fried,
          etc)
        </label>
        {[...keywords].map((keyword, index) => (
          <div key={index} className='input-group'>
            <input
              type='text'
              value={keyword}
              ref={keywordInputRef}
              onChange={(e) => handleKeywordChange(index, e.target.value)}
            />
            <button type='button' onClick={() => handleKeywordRemove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={() =>
            handleAddInput(keywords, types.keywords, keywordInputRef)
          }
        >
          Add Keyword
        </button>
      </div>

      <div className='form-group'>
        <label htmlFor='ingredients'>Ingredients</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className='input-group'>
            <input
              type='text'
              ref={ingredientInputRef}
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
            />
            <button type='button' onClick={() => handleIngredientRemove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={() =>
            handleAddInput(ingredients, types.ingredients, ingredientInputRef)
          }
        >
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
              ref={stepInputRef}
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
        <button
          type='button'
          onClick={() => {
            dispatch({
              type: types.steps,
              payload: [...steps, { header: '', step: '' }],
            });
            setTimeout(() => {
              if (stepInputRef.current) {
                stepInputRef.current.focus();
              }
            }, 0);
          }}
        >
          Add Step
        </button>
      </div>

      <button type='submit'>Submit</button>
    </form>
  );
};

export default AddRecipeForm;
