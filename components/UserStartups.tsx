import React from 'react'
import {STARTUPS_BY_AUTHOR_QUERY} from "@/sanity/lib/queries";
import {client} from "@/sanity/lib/client";
import StartupCard, {StartupTypeCard} from "@/components/StartupCard";

const UserStartups = async ({id}: { id: string }) => {
    const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, {id})
    return (
        <>
            {startups.length > 0 ? startups.map((startups: StartupTypeCard) => (
                    <StartupCard key={startups._id} post={startups}/>
                )) :
                (
                    <p className="no-result">
                        No Posts yet
                    </p>
                )}
        </>
    )
}
export default UserStartups
