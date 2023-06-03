import React from 'react';

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


const Profile: React.FC = () => {
  const { session } = useSession();

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

  return (
    <>
      <h1>Welcome to the Solid restaurant menu creator</h1>
      <p>Logged in: {session.info.webId}</p>
      <button onClick={() => handleWrite()}>Write allergen to pod</button>
    </>
  );
};

export default Profile;