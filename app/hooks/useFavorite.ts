import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

import { SafeUser } from "../types";

import useLoginModal from "./useLoginModal";

interface IUseFavorite {
  listingId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({ listingId, currentUser }: IUseFavorite) => {
  
  const router = useRouter(); //router is used to refresh the page after the user has favorited or unfavorited a listing

  const loginModal = useLoginModal(); //loginModal is used to open the login modal when the user is not logged in and tries to favorite a listing 

  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || []; //list is an array of listing IDs that the user has favorited 

    return list.includes(listingId); //hasFavorited is a boolean that is true if the listing is in the list of favorited listings
  }, [currentUser, listingId]); //hasFavorited is memoized so that it is only recalculated when the currentUser or listingId changes 

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation(); //stops the event from bubbling up to the parent element 

      if (!currentUser) {
        return loginModal.onOpen();
      } //if the user is not logged in, open the login modal 

      try {
        let request; 

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${listingId}`);
        } else {
          request = () => axios.post(`/api/favorites/${listingId}`);
        } //if the listing is already favorited, send a DELETE request to the API to remove it from the list of favorited listings. Otherwise, send a POST request to add it to the list of favorited listings 

        await request(); //send the request to the API 
        router.refresh(); //refresh the page to update the UI 
        toast.success("Success"); //show a success toast 
      } catch (error) {
        toast.error("Something went wrong."); //show an error toast 
      }
    },
    [currentUser, hasFavorited, listingId, loginModal, router] //toggleFavorite is memoized so that it is only recalculated when the currentUser, hasFavorited, listingId, loginModal, or router changes    
  ); 

  return {
    hasFavorited,
    toggleFavorite,
  }; //return the hasFavorited boolean and the toggleFavorite function
};

export default useFavorite;