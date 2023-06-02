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

    let item = createThing({ name: "ingredient1" });
    item = addStringNoLocale(item, SCHEMA_INRUPT.name, "allergen1");
    myReadingList = setThing(myReadingList, item);

    let item2 = createThing({ name: "ingredient2" });
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
      <button onClick={() => handleWrite()}>Write allergen to pod</button>
    </>
  );
};

export default Profile;