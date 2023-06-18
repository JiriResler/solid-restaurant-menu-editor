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
      label: "New item",
      ingredients: [""],
      allergens: [""],
      diets: [""],
      price: ""
    })

    setItems(newItemArray);
  }

  return (
    <>
      {/* <h1>Welcome to the Solid restaurant menu maker</h1> */}

      {/* <button onClick={() => handleWrite()}>Write allergen to pod</button> */}
      <h3>Creating a new menu</h3>
      <input placeholder='Name of menu' />
      <br />
      <br />
      <input placeholder='Date' />
      <br />
      <br />
      <button onClick={() => addNewItem()}>Add an item</button>
      <br /><br />
      <ul>
        {items.map(item =>
          <>
            <li>
              <input placeholder='Name of item' />
              <ul>
                <li>
                  <input placeholder='Ingredients' />
                </li>
                <li>
                  <input placeholder='Allergens' />
                </li>
                <li>
                  <input placeholder='Diets' />
                </li>
                <li>
                  <input placeholder='Price' />
                </li>
              </ul>
            </li>
            <br />
          </>
        )}
      </ul>

      <button>Save the menu</button>
      <br /><br />
      
      <h3>Preview of menu</h3>
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
    </>
  );
};

export default Profile;