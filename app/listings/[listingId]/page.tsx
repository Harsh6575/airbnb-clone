import getCurrentUser from '@/app/actions/getCurrentUser';
import getListingsById from '@/app/actions/getListiingById';
import ClientOnly from '@/app/components/ClientOnly';
import EmptyState from '@/app/components/EmptyState';
import React from 'react';
import ListingClient from './ListingClient';
import getReservations from '@/app/actions/getReservations';

interface IParams {
    listingId?: string;
}

const ListingPage = async ({params}:{params:IParams}) => {
    const listing = await getListingsById(params);
    const currentUser = await getCurrentUser();

    const reservations = await getReservations(params);
    
    if(!listing){
        return(
            <ClientOnly>
                <EmptyState/>
            </ClientOnly>
        )
    }

  return (
    <ClientOnly>
        <ListingClient
            listing={listing}
            currentUser={currentUser}
            reservations={reservations}
        />
    </ClientOnly>
  )
}

export default ListingPage;