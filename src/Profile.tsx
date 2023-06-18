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
  const { session } = useSession();

  const [items, setItems] = useState([]);

  // const [item, setItem] = useState({
  //   label: "",
  //   ingredients: [],
  //   allergens: [],
  //   diets: []
  // });

  const [menuName, setMenuName] = useState();
  const [menuDate, setMenuDate] = useState();

  const [itemLabel, setItemLabel] = useState("");
  const [itemIngredients, setItemIngredients] = useState([]);
  const [ingredient, setIngredient] = useState("");
  const [itemAllergens, setItemAllergens] = useState([]);
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

    let menu1 = createThing({ name: "menu1" });
    menu1 = addStringNoLocale(menu1, SCHEMA_INRUPT.name, "item1");
    menu1 = addStringNoLocale(menu1, SCHEMA_INRUPT.name, "item2");
    myReadingList = setThing(myReadingList, menu1);

    let item1 = createThing({ name: "item1" });
    item1 = addStringNoLocale(item1, SCHEMA_INRUPT.name, "allergen1");
    myReadingList = setThing(myReadingList, item1);

    let item2 = createThing({ name: "item2" });
    item2 = addStringNoLocale(item2, SCHEMA_INRUPT.name, "allergen2");
    myReadingList = setThing(myReadingList, item2);

    await saveSolidDatasetAt(
      readingListUrl,
      myReadingList,
      { fetch: session.fetch }
    );
  }

  function addNewItem() {
    let newItemArray = [];

    for (const item of items) {
      newItemArray.push(item);
    }

    

    newItemArray.push({
      label: itemLabel,
      ingredients: [itemIngredients],
      allergens: [itemAllergens],
      diets: [itemDiets],
      price: itemPrice
    });

    setItems(newItemArray);

    alert(itemLabel + ' added to the menu.');

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

  return (
    <>
      {/* <h1>Welcome to the Solid restaurant menu maker</h1> */}

      {/* <button onClick={() => handleWrite()}>Write allergen to pod</button> */}
      <h2>Creating a new menu</h2>
      <input value={menuName} onChange={(e) => setMenuName(e.target.value)} placeholder='Name of the menu' />{' '}
      <input placeholder='Date' />
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
          <input value={itemAllergens} onChange={(e) => setItemAllergens(e.target.value)} placeholder='Allergens' />
        </li>
        <li>
          <input value={itemDiets} onChange={(e) => setItemDiets(e.target.value)} placeholder='Diets' />
        </li>
        <li>
          <input value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} placeholder='Price' />
        </li>
      </ul>
      <button onClick={() => addNewItem()}>Add item</button>
      <br /><br />

      <h3>Preview of the menu</h3>
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

      <button>Save the menu</button>
      <br /><br />

      {/* <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} />
      {textInput} */}
    </>
  );
};

export default Profile;