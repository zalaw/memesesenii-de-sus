import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { MdOutlineFavoriteBorder, MdOutlineComment, MdDelete } from "react-icons/md";
import AddMemeModal from "../components/AddMemeModal";
import { useMemes } from "../contexts/MemesContext";
import UserAvatar from "../components/UserAvatar";
import CustomButton from "../components/CustomButton";
import { formatDistance, subDays } from "date-fns";
import DeleteMemeModal from "../components/DeleteMemeModal";
const Main = () => {
  const { currentUser } = useAuth();
  const { loading, getMemes, memes, setMemes } = useMemes();

  const [showAddMemeModal, setShowAddMemeModal] = useState(false);
  const [showDeleteMemeModal, setShowDeleteMemeModal] = useState(false);
  const [memeToDelete, setMemeToDelete] = useState(null);

  const deleteOnClick = meme => {
    setMemeToDelete(meme);
    setShowDeleteMemeModal(true);
  };

  useEffect(() => {
    getMemes();

    return () => setMemes([]);
  }, []);

  if (loading) return "Loading...";

  return (
    <div className="test flex flex-col sm:flex-row sm:items-start gap-8 relative">
      {showAddMemeModal && <AddMemeModal handleClose={() => setShowAddMemeModal(false)} />}
      {showDeleteMemeModal && <DeleteMemeModal meme={memeToDelete} handleClose={() => setShowDeleteMemeModal(false)} />}

      <div className="sm:sticky sm:top-[112px]">
        {currentUser && (
          <CustomButton
            className="w-full"
            onClick={() => setShowAddMemeModal(true)}
            text="Add your meme"
            primary={true}
            rounded={true}
          />
        )}
      </div>

      <div className="flex-1 flex flex-col gap-8 items-center">
        {memes.map(meme => {
          return (
            <div
              key={meme.id}
              className="rounded-md flex flex-col overflow-hidden w-full max-w-lg dark:bg-zinc-800 b bg-zinc-300 shadow-xl"
            >
              <img src={meme.url} alt="Super meme" />

              <div className="p-4 flex justify-between items-center gap-2">
                <div className="flex gap-2 items-center text-xs sm:text-sm">
                  <UserAvatar photoURL={meme.userData.photoURL} className="w-8" />
                  <div className="sm:flex-row flex-col flex sm:gap-2 gap-1">
                    <span className="font-semibold">{meme.userData.displayName}</span>
                    <span className="">
                      {formatDistance(new Date(meme.createdAt.seconds * 1000 - 50000), new Date(), {
                        addSuffix: true,
                      }).replace("about", "")}
                    </span>
                  </div>
                </div>

                {currentUser && (
                  <div>
                    {meme.userId === currentUser.uid && (
                      <div onClick={() => deleteOnClick(meme)}>
                        <CustomButton icon={<MdDelete className="text-red-700 sm:text-2xl text-lg" />} rounded={true} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Main;
