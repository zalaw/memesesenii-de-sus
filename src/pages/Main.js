import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MdOutlineFavoriteBorder, MdOutlineComment } from "react-icons/md";
import AddMemeModal from "../components/AddMemeModal";
import { useMemes } from "../contexts/MemesContext";
import UserAvatar from "../components/UserAvatar";
import CustomButton from "../components/CustomButton";
import { formatDistance } from "date-fns";
const Main = () => {
  const { currentUser } = useAuth();
  const { getMemes, memes, setMemes } = useMemes();

  const [showAddMemeModal, setShowAddMemeModal] = useState(false);

  useEffect(() => {
    console.log("hello here");
    setMemes([]);
    getMemes();
  }, []);

  return (
    <div className="test flex items-start gap-4 relative">
      {showAddMemeModal && <AddMemeModal handleClose={() => setShowAddMemeModal(false)} />}

      <div className="sticky top-[112px]">
        {currentUser && (
          <CustomButton onClick={() => setShowAddMemeModal(true)} text="Add your meme" primary={true} rounded={true} />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-8 items-center">
        {memes.map(meme => {
          return (
            <div
              key={meme.id}
              className="rounded-md flex flex-col overflow-hidden w-full max-w-lg dark:bg-zinc-800 b bg-zinc-300 shadow-xl"
            >
              <img src={meme.url} alt={meme.title} />

              <div className="p-4 flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <UserAvatar photoURL={meme.user.photoURL} className="w-8" />
                  <span className="t font-semibold">{meme.user.displayName}</span>
                  <span className="">
                    {formatDistance(new Date(meme.createdAt.seconds * 1000 - 50000), new Date(), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Main;
