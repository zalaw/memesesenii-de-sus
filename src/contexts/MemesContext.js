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

  useEffect(() => {
    async function getMemes() {
      try {
        const q = query(collection(db, "memes"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        for (const entry of querySnapshot.docs) {
          // console.log(entry.data());
          const x = await getDoc(entry.data().user);
          // console.log(x.data());
          setMemes(prev => [
            ...prev,
            {
              id: entry.id,
              url: entry.data().url,

              createdAt: entry.data().createdAt,
              user: { displayName: x.data().displayName, avatar: x.data().avatar },
            },
          ]);
        }

        // querySnapshot.forEach(doc => {
        //   console.log(doc.data().user)
        //   const user = await getDoc(doc.data().user)

        // });

        // console.log(querySnapshot.map(doc => doc.data()));
      } catch (err) {
        console.log("eruare");
        console.log(err);
      }
    }

    getMemes();
  }, []);

  const value = {
    memes,
    addMeme,
  };

  return <MemesContext.Provider value={value}>{children}</MemesContext.Provider>;
}
