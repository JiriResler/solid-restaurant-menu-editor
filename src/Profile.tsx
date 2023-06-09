import React, { useState } from 'react';

import {
  useSession,
} from "@inrupt/solid-ui-react";

import {
  addUrl,
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getPodUrlAll,
  getSolidDataset,
  getThingAll,
  getStringNoLocale,
  removeThing,
  saveSolidDatasetAt,
  setThing,
  SolidDataset,
  getThing
} from "@inrupt/solid-client";

import { SCHEMA_INRUPT, RDF, AS } from "@inrupt/vocab-common-rdf";


// {
//   label: "Spicy Chicken Wings",
//   ingredients: ["chicken", "marinade"],
//   allergens: ["soybeans", "milk", "nuts"],
//   diets: [],
//   price: "5€"
// },
// {
//   label: "Pizza Margherita",
//   ingredients: ["tomatoes", "mozzarella", "oregano"],
//   allergens: ["gluten", "milk"],
//   diets: ["vegan", "vegetarian"],
//   price: "7€"
// }


const Profile: React.FC = () => {
  const chooseWellPrefix = "https://github.com/JiriResler/solid-choose-well-ontology/blob/main/choosewell#";

  const { session } = useSession();

  const [items, setItems] = useState([]);

  const [menuName, setMenuName] = useState("");
  const [menuDate, setMenuDate] = useState("");

  const [itemLabel, setItemLabel] = useState("");
  const [itemIngredients, setItemIngredients] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [allergen, setAllergen] = useState("");
  const [itemAllergens, setItemAllergens] = useState([]);
  const [diet, setDiet] = useState("");
  const [itemDiets, setItemDiets] = useState([]);
  const [itemPrice, setItemPrice] = useState("");

  async function handleWrite() {
    const podsUrls: String[] = await getPodUrlAll(session.info.webId, { fetch: session.fetch });
    const readingListUrl = `${podsUrls[0]}public/menus/my-menu1`;
    let myReadingList: SolidDataset;

    try {
      // Attempt to retrieve the reading list in case it already exists.
      myReadingList = await getSolidDataset(readingListUrl, { fetch: session.fetch });
      // Clear the list to override the whole list
      let items = getThingAll(myReadingList);
      items.forEach((item) => {
        myReadingList = removeThing(myReadingList, item);
      });
    } catch (error) {
      if (typeof error.statusCode === "number" && error.statusCode === 404) {
        // if not found, create a new SolidDataset (i.e., the reading list)
        myReadingList = createSolidDataset();
      } else {
        console.error(error.message);
      }
    }

    let menu = createThing({ name: "menu1" });
    menu = addStringNoLocale(menu, `${chooseWellPrefix}menuName`, menuName);
    menu = addStringNoLocale(menu, `${chooseWellPrefix}validOn`, menuDate);
    

    for (const item of items) {
      menu = addUrl(menu, `${chooseWellPrefix}hasMenuItem`, `${podsUrls[0]}public/menus/my-menu1#${item.label}`);
    }

    myReadingList = setThing(myReadingList, menu);

    for (const item of items) {
      let menuItem = createThing({ name: item.label });
      menuItem = addStringNoLocale(menuItem, `${chooseWellPrefix}costs`, item.price);
      
      for (const ingredient of item.ingredients) {
        menuItem = addStringNoLocale(menuItem, `${chooseWellPrefix}hasIngredient`, ingredient);
      }

      for (const allergen of item.allergens) {
        menuItem = addStringNoLocale(menuItem, `${chooseWellPrefix}hasAllergen`, allergen);
      }

      for (const diet of item.diets) {
        menuItem = addStringNoLocale(menuItem, `${chooseWellPrefix}isPartOf`, diet);
      }
      
      myReadingList = setThing(myReadingList, menuItem);
    }

    await saveSolidDatasetAt(
      readingListUrl,
      myReadingList,
      { fetch: session.fetch }
    );

    alert('Menu saved');
  }

  function addNewItem() {
    let newItemArray = [];

    for (const item of items) {
      newItemArray.push(item);
    }

    newItemArray.push({
      label: itemLabel,
      ingredients: itemIngredients,
      allergens: itemAllergens,
      diets: itemDiets,
      price: itemPrice
    });

    setItems(newItemArray);

    // Clear fields
    setItemLabel("");
    setItemIngredients([]);
    setItemAllergens([]);
    setItemDiets([]);
    setItemPrice("");
  }

  function addIngredient() {
    let newIngredientArray = [];

    for (const ingredient of itemIngredients) {
      newIngredientArray.push(ingredient);
    }

    newIngredientArray.push(ingredient);

    setItemIngredients(newIngredientArray);

    setIngredient("");
  }

  function addAllergen() {
    let newAllergenArray = [];

    for (const allergen of itemAllergens) {
      newAllergenArray.push(allergen);
    }

    newAllergenArray.push(allergen);

    setItemAllergens(newAllergenArray);

    setAllergen("");
  }

  function addDiet() {
    let newDietArray = [];

    for (const diet of itemDiets) {
      newDietArray.push(diet);
    }

    newDietArray.push(diet);

    setItemDiets(newDietArray);

    setDiet("");
  }

  return (
    <>
      {/* <h1>Welcome to the Solid restaurant menu maker</h1> */}

      {/* <button onClick={() => handleWrite()}>Write allergen to pod</button> */}
      <h2>Creating a new menu</h2>
      <input value={menuName} onChange={(e) => setMenuName(e.target.value)} placeholder='Name of the menu' />{' '}
      <input type="date" value={menuDate} onChange={(e) => setMenuDate(e.target.value)} placeholder='Date' />
      <br />
      <br />
      <h4>Add a new item</h4>
      <ul>
        <li>
          <input value={itemLabel} onChange={(e) => setItemLabel(e.target.value)} placeholder='Name' />
        </li>
        <li>
          <input value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder='Ingredient name' /> {' '}
          <button onClick={() => addIngredient()}>Add ingredient</button>
          <ul>
            {itemIngredients.map(ingredient => <li>{ingredient}</li>)}
          </ul>
        </li>
        <li>
          <input value={allergen} onChange={(e) => setAllergen(e.target.value)} placeholder='Allergen name' />
          {' '}
          <button onClick={() => addAllergen()}>Add allergen</button>
          <ul>
            {itemAllergens.map(allergen => <li>{allergen}</li>)}
          </ul>
        </li>
        <li>
          <input value={diet} onChange={(e) => setDiet(e.target.value)} placeholder='Diet name' />
          {' '}
          <button onClick={() => addDiet()}>Add diet</button>
          <ul>
            {itemDiets.map(diet => <li>{diet}</li>)}
          </ul>
        </li>
        <li>
          <input value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder='Price' />
        </li>
      </ul>
      <button onClick={() => addNewItem()}>Add item</button>
      <br /><br />

      <h3>Preview of the menu</h3>
      <h5>{menuName}</h5>
      <h4>Date: {menuDate}</h4>
      <ul>
        {items.map(item =>
          <li>
            {item.label}
            <ul>
              <li>
                Ingredients: {item.ingredients.join(", ")}
              </li>
              <li>
                Allergens: {item.allergens.join(", ")}
              </li>
              <li>
                Diets: {item.diets.join(", ")}
              </li>
              <li>
                Price: {item.price}
              </li>
            </ul>
          </li>
        )}
      </ul>

      <button onClick={() => handleWrite()}>Save the menu</button>
      <br /><br />

      {/* <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} />
      {textInput} */}
    </>
  );
};

export default Profile;