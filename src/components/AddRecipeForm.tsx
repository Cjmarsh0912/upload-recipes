import { useState, useReducer, useEffect, useRef } from 'react';

import {
  convertString,
  capitalizeString,
  removeExtraWhitespace,
  scrollToElement,
} from 'functions/functions';

import { v4 as uuid } from 'uuid';

import { ref, uploadBytes } from 'firebase/storage';
import { storage } from 'firebase';

import { RecipeData } from 'interfaces/interface';

type Action = {
  type: string;
  payload: any;
};

type FormData = {
  recipe_name: string;
  description: string;
  categories: string[];
  prep_time: number;
  cook_time: number;
  image: File | null;
  keywords: {
    keyword: string;
    hasError: boolean;
  }[];
  ingredients: {
    ingredient: string;
    hasError: boolean;
  }[];
  steps: {
    header: string;
    step: string;
    hasError: boolean;
  }[];
};

type Errors = {
  recipe_name: string;

  keywords: string;
  categories: string;
  description: string;
  date_posted: string;
  prep_time: string;
  cook_time: string;
  total_time: string;
  image: string;
  ingredients: string;
  steps: string;
};

const initialValue: FormData = {
  recipe_name: '',
  keywords: [],
  categories: [],
  description: '',
  prep_time: 0,
  cook_time: 0,
  image: null,
  ingredients: [],
  steps: [],
};

const reducer = (state: FormData, action: Action): FormData => {
  switch (action.type) {
    case 'SET_RECIPE_NAME':
      return { ...state, recipe_name: action.payload };

    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };

    case 'SET_KEYWORDS':
      return { ...state, keywords: action.payload };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'SET_PREP_TIME':
      return { ...state, prep_time: action.payload };

    case 'SET_COOK_TIME':
      return { ...state, cook_time: action.payload };

    case 'SET_IMAGE':
      return { ...state, image: action.payload };

    case 'SET_INGREDIENTS':
      return { ...state, ingredients: action.payload };

    case 'SET_STEPS':
      return { ...state, steps: action.payload };

    case 'RESET':
      return { ...initialValue };

    default:
      return state;
  }
};

const AddRecipeForm = () => {
  const [formData, dispatch] = useReducer(reducer, initialValue);
  const [formErrors, setFormErrors] = useState<Errors>({
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const types = {
    recipeName: 'SET_RECIPE_NAME',
    description: 'SET_DESCRIPTION',
    keywords: 'SET_KEYWORDS',
    categories: 'SET_CATEGORIES',
    prepTime: 'SET_PREP_TIME',
    cookTime: 'SET_COOK_TIME',
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
    image,
    steps,
  } = formData;

  const keywordInputRef = useRef<HTMLInputElement>(null);
  const ingredientInputRef = useRef<HTMLInputElement>(null);
  const stepInputRef = useRef<HTMLInputElement>(null);

  // Form functions
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
      dispatch({ type: types.image, payload: file });
    } else {
      dispatch({ type: types.image, payload: null });
    }
  };

  const handleKeywordChange = (index: number, value: string) => {
    const updatedKeywords = [...keywords];
    updatedKeywords[index].keyword = value;
    dispatch({ type: types.keywords, payload: updatedKeywords });
  };

  const handleKeywordRemove = (index: number) => {
    const updatedKeywords = [...keywords];
    updatedKeywords.splice(index, 1);

    dispatch({ type: types.keywords, payload: updatedKeywords });
  };

  const handleIngredientChange = (index: number, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index].ingredient = value;
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

  const resetForm = () => {
    const confirmReset = window.confirm(
      'Resetting will lose all current data.'
    );

    if (confirmReset) {
      dispatch({ type: 'RESET', payload: null });
      setFormErrors({
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
    }
  };

  const testKeywords = () => {
    const inputRegex = /^[A-Za-z\s]{1,50}$/;
    const newKeywords = [...keywords].map((keyword) => {
      if (!inputRegex.test(keyword.keyword))
        return { ...keyword, hasError: true };
      return { ...keyword, hasError: false };
    });

    const isErrors = newKeywords.some((keyword) => keyword.hasError === true);

    dispatch({ type: types.keywords, payload: newKeywords });
    return isErrors;
    //'Keyword must be 1 to 50 characters with letters and spaces only',
  };

  const testIngredients = () => {
    const inputRegex = /^.{1,50}$/;
    const newIngredients = [...ingredients].map((ingredient) => {
      if (!inputRegex.test(ingredient.ingredient))
        return { ...ingredient, hasError: true };
      return { ...ingredient, hasError: false };
    });

    const isErrors = newIngredients.some(
      (ingredient) => ingredient.hasError === true
    );

    dispatch({ type: types.ingredients, payload: newIngredients });
    return isErrors;
  };

  const testSteps = () => {
    const headerRegex = /^[A-Za-z0-9\s]{5,50}$/;
    const stepRegex = /^[A-Za-z0-9\s]{0,50}$/;

    const newSteps = [...steps].map((step) => {
      if (
        !headerRegex.test(step.header.trim()) ||
        !stepRegex.test(step.step.trim())
      ) {
        return { ...step, hasError: true };
      } else {
        return { ...step, hasError: false };
      }
    });

    const isErrors = newSteps.some((value) => value.hasError === true);

    dispatch({ type: types.steps, payload: newSteps });
    return isErrors;
  };

  // Add to database functions

  const sortCategories = () => {
    const sortOrder = ['Lunch', 'Dinner', 'Sides', 'Dessert'];

    const sortedCategories = [...categories].sort((a, b) => {
      const indexA = sortOrder.indexOf(a);
      const indexB = sortOrder.indexOf(b);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      } else if (indexA !== -1) {
        return -1;
      } else if (indexB !== -1) {
        return 1;
      } else {
        return 0;
      }
    });

    return sortedCategories;
  };

  const fixKeywordFormat = () => {
    const fixKeywords = [...keywords].map((keyword) => {
      return removeExtraWhitespace(keyword.keyword.toLowerCase());
    });

    return fixKeywords;
  };

  const fixIngredientFormat = () => {
    const fixIngredients = [...ingredients].map((ingredient) => {
      return removeExtraWhitespace(ingredient.ingredient.toLowerCase());
    });

    return fixIngredients;
  };

  const fixStepsFormat = () => {
    const fixSteps = [...steps].map((step) => {
      return {
        header: removeExtraWhitespace(step.header),
        step: removeExtraWhitespace(step.step),
      };
    });

    return fixSteps;
  };

  const addRecipeToDatabase = (formData: FormData) => {
    const newRecipeName = removeExtraWhitespace(capitalizeString(recipe_name));

    const newDescription = removeExtraWhitespace(description);

    const newCategories = sortCategories();

    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const Recipe: RecipeData = {
      id: uuid(),
      recipe_name: newRecipeName,
      description: newDescription,
      prep_time: prep_time,
      cook_time: cook_time,
      total_time: cook_time + prep_time,
      categories: newCategories,
      image: '',
      keywords: fixKeywordFormat(),
      ingredients: fixIngredientFormat(),
      steps: fixStepsFormat(),
      rating: 0,
      comments: [],
      date_posted: formattedDate,
      category_extension: convertString(newCategories[0] + '-recipes'),
      extension: convertString(newRecipeName),
    };

    console.log(Recipe);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const recipeNameRegex = /^([A-Za-z0-9 ]{3,50})$/;
    const recipeDescriptionRegex = /^.{5,100}$/;

    const validRecipeName = recipeNameRegex.test(recipe_name);
    const validDescription = recipeDescriptionRegex.test(description.trim());

    if (recipe_name.trim() === '') {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        recipe_name: 'Recipe name required.',
      }));
      scrollToElement('recipe-name-container');
      return;
    } else if (!validRecipeName) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        recipe_name:
          'Recipe name must be between 3 and 50 characters with letters and numbers only.',
      }));
      scrollToElement('recipe-name-container');
      return;
    } else {
      setFormErrors((prevErrors) => ({ ...prevErrors, recipe_name: '' }));
      dispatch({
        type: types.recipeName,
        payload: removeExtraWhitespace(capitalizeString(recipe_name)),
      });
    }

    if (description.trim() === '') {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        description: 'Description required.',
      }));
      scrollToElement('recipe-description-container');

      return;
    } else if (!validDescription) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        description:
          'Recipe description must be between 5 and 100 characters long.',
      }));
      scrollToElement('recipe-description-container');

      return;
    } else {
      setFormErrors((prevErrors) => ({ ...prevErrors, description: '' }));
      dispatch({
        type: types.description,
        payload: removeExtraWhitespace(description),
      });
    }

    if (cook_time + prep_time === 0) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        total_time: 'Total time can not be 0.',
      }));
      scrollToElement('cook-time-container');

      return;
    } else {
      setFormErrors((prevErrors) => ({ ...prevErrors, total_time: '' }));
    }

    if (categories.length === 0) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        categories: 'Please select at least 1 category.',
      }));
      scrollToElement('categories-container');

      return;
    } else {
      setFormErrors((prevErrors) => ({ ...prevErrors, categories: '' }));
    }

    if (!image?.name) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        image: 'No image selected',
      }));
      return;
    }

    if (keywords.length < 3) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        keywords: 'Add at least 3 keywords.',
      }));

      return;
    } else if (testKeywords()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        keywords:
          'Keywords must be between 1 and 50 characters with letters and spaces only.',
      }));
      return;
    } else {
      const newKeywords = [...keywords].map((keyword) => {
        return {
          keyword: removeExtraWhitespace(keyword.keyword.toLowerCase()),
          hasError: false,
        };
      });

      dispatch({ type: types.keywords, payload: newKeywords });
      setFormErrors((prevErrors) => ({ ...prevErrors, keywords: '' }));
    }

    if (ingredients.length < 2) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        ingredients: 'Add at least 2 ingredients.',
      }));

      return;
    } else if (testIngredients()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        ingredients: 'Ingredients must be between 1 and 50 characters.',
      }));
      return;
    } else {
      const newIngredients = [...ingredients].map((ingredient) => {
        return {
          ingredient: removeExtraWhitespace(
            ingredient.ingredient.toLowerCase()
          ),
          hasError: false,
        };
      });

      dispatch({ type: types.ingredients, payload: newIngredients });
      setFormErrors((prevErrors) => ({ ...prevErrors, ingredients: '' }));
    }

    if (steps.length < 1) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        steps: 'Add at least 1 step.',
      }));

      return;
    } else if (testSteps()) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        steps:
          'Step header must be between 5 and 50 characters with numbers and letters only.',
      }));

      return;
    } else {
      const newSteps = [...steps].map((steps) => {
        return {
          header: removeExtraWhitespace(steps.header),
          step: removeExtraWhitespace(steps.step),
          hasError: false,
        };
      });

      dispatch({ type: types.steps, payload: newSteps });
      setFormErrors((prevErrors) => ({ ...prevErrors, steps: '' }));
    }

    addRecipeToDatabase(formData);
  };

  return (
    <form onSubmit={handleSubmit} className='add-recipe-form'>
      <h2>Add Recipe</h2>

      <div className='form-group' id='recipe-name-container'>
        <label htmlFor='recipe-name'>Recipe Name</label>
        <input
          type='text'
          id='recipe-name'
          name='recipe-name'
          autoFocus
          value={recipe_name}
          onChange={(e) =>
            dispatch({ type: types.recipeName, payload: e.target.value })
          }
        />
        {formErrors.recipe_name && (
          <p className='error'>{formErrors.recipe_name}</p>
        )}
      </div>

      <div className='form-group' id='recipe-description-container'>
        <label htmlFor='recipe-description'>Recipe Description</label>
        <textarea
          id='recipe-description'
          rows={4}
          value={description}
          onChange={(e) =>
            dispatch({
              type: types.description,
              payload: e.target.value,
            })
          }
        ></textarea>
        {formErrors.description && (
          <p className='error'>{formErrors.description}</p>
        )}
      </div>

      <div className='cook-time' id='cook-time-container'>
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
          {formErrors.total_time && (
            <p className='error'>{formErrors.total_time}</p>
          )}
        </div>
      </div>

      <div className='form-group' id='categories-container'>
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
        {formErrors.categories && (
          <p className='error'>{formErrors.categories}</p>
        )}
      </div>

      <div className='form-group' id='image-container'>
        <label htmlFor='image'>
          Image (if no image available go{' '}
          <a href='https://unsplash.com/'>here</a> for an open source image)
        </label>
        <label className='custom-file-upload'>
          <input
            accept='image/png, image/jpeg'
            type='file'
            id='image'
            onChange={(e) => handleFileChange(e)}
          />
          Choose Image
        </label>
        {image?.name ? (
          <p>{image?.name}</p>
        ) : (
          <p className='error'>{formErrors.image}</p>
        )}
      </div>

      <div className='form-group' id='keywords-container'>
        <label htmlFor='keywords'>
          Keywords (keywords are used for searching. ex. beef, baked, fried,
          etc)
        </label>
        {[...keywords].map((keyword, index) => (
          <>
            <div key={index} className='input-group'>
              <input
                type='text'
                value={keyword.keyword}
                ref={keywordInputRef}
                className={keyword.hasError ? 'has-errors' : ''}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
              />
              <button type='button' onClick={() => handleKeywordRemove(index)}>
                Remove
              </button>
            </div>
          </>
        ))}
        <button
          type='button'
          onClick={() => {
            dispatch({
              type: types.keywords,
              payload: [...keywords, { keyword: '', hasError: false }],
            });

            setTimeout(() => {
              if (keywordInputRef.current) {
                keywordInputRef.current.focus();
              }
            }, 0);
          }}
        >
          Add Keyword
        </button>
        {formErrors.keywords && <p className='error'>{formErrors.keywords}</p>}
      </div>

      <div className='form-group' id='ingredients-container'>
        <label htmlFor='ingredients'>Ingredients</label>
        {ingredients.map((ingredient, index) => (
          <div key={index} className='input-group'>
            <input
              type='text'
              className={ingredient.hasError ? 'has-errors' : ''}
              ref={ingredientInputRef}
              value={ingredient.ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
            />
            <button type='button' onClick={() => handleIngredientRemove(index)}>
              Remove
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={() => {
            dispatch({
              type: types.ingredients,
              payload: [...ingredients, { ingredient: '', hasError: false }],
            });

            setTimeout(() => {
              if (ingredientInputRef.current) {
                ingredientInputRef.current.focus();
              }
            }, 0);
          }}
        >
          Add Ingredient
        </button>
        {formErrors.ingredients && (
          <p className='error'>{formErrors.ingredients}</p>
        )}
      </div>

      <div className='form-group' id='steps-container'>
        <label htmlFor='steps'>Steps</label>
        {steps.map((step, index) => (
          <div key={index} className='input-group'>
            <input
              type='text'
              placeholder='Header (required)'
              className={step.hasError ? 'has-errors' : ''}
              ref={stepInputRef}
              value={step.header}
              onChange={(e) =>
                handleStepChange(index, 'header', e.target.value)
              }
            />
            <input
              type='text'
              placeholder='Step'
              className={step.hasError ? 'has-errors' : ''}
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
        {formErrors.steps && <p className='error'>{formErrors.steps}</p>}
      </div>

      <div className='button-group'>
        <input type='submit' value='Submit' disabled={isLoading} />
        <button onClick={resetForm} type='button'>
          Reset
        </button>
      </div>
    </form>
  );
};

export default AddRecipeForm;
