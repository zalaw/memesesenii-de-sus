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
  const [loading, setLoading] = useState(true);

  function addMeme(meme) {
    setMemes(prev => [meme, ...prev]);
  }

  const getMemes = async () => {
    setLoading(true);

    try {
      const memesSnapshot = await getDocs(query(collection(db, "memes"), orderBy("createdAt", "asc")));

      for (const entry of memesSnapshot.docs) {
        const user = await getDoc(entry.data().user);

        setMemes(prev => [
          {
            id: entry.id,
            ...entry.data(),
            userData: {
              displayName: user.data().displayName,
              photoURL: user.data().photoURL,
            },
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.log("eruare");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    memes,
    loading,
    setMemes,
    addMeme,
    getMemes,
  };

  return <MemesContext.Provider value={value}>{children}</MemesContext.Provider>;
}
