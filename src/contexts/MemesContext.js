import { list, listAll, ref } from "firebase/storage";
import { db } from "../firebase";
import React, { createContext, useContext, useEffect, useState } from "react";
import { collection, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";

const MemesContext = createContext();

export function useMemes() {
  return useContext(MemesContext);
}

export function MemesProvider({ children }) {
  const [memes, setMemes] = useState([]);

  function addMeme(meme) {
    setMemes(prev => [meme, ...prev]);
  }

  const getMemes = async () => {
    try {
      const memesSnapshot = await getDocs(query(collection(db, "memes"), orderBy("createdAt", "desc")));

      for (const entry of memesSnapshot.docs) {
        const memeUser = await getDoc(entry.data().user);

        setMemes(prev => [
          ...prev,
          {
            id: entry.id,
            url: entry.data().url,
            createdAt: entry.data().createdAt,
            user: { displayName: memeUser.data().displayName, photoURL: memeUser.data().photoURL },
          },
        ]);
      }
    } catch (err) {
      console.log("eruare");
      console.log(err);
    }
  };

  // useEffect(() => {
  //   async function getMemes() {
  //     try {
  //       const memesSnapshot = await getDocs(query(collection(db, "memes"), orderBy("createdAt", "desc")));

  //       for (const entry of memesSnapshot.docs) {
  //         const memeUser = await getDoc(entry.data().user);

  //         setMemes(prev => [
  //           ...prev,
  //           {
  //             id: entry.id,
  //             url: entry.data().url,
  //             createdAt: entry.data().createdAt,
  //             user: { displayName: memeUser.data().displayName, photoURL: memeUser.data().photoURL },
  //           },
  //         ]);
  //       }
  //     } catch (err) {
  //       console.log("eruare");
  //       console.log(err);
  //     }
  //   }

  //   getMemes();
  // }, []);

  const value = {
    memes,
    setMemes,
    addMeme,
    getMemes,
  };

  return <MemesContext.Provider value={value}>{children}</MemesContext.Provider>;
}
