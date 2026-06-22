"use client"
import { useUserData } from "@/hooks/user/use-user-data";
import { useEffect } from "react";

export default function TopDeck () {
    const { data } = useUserData(["imageUrl", "username", "fullName"]);

    useEffect(() => {
        console.log("User data fetched successfully:", data);
    }, [data]);
    return <div className="fixed top-0 w-full h-20">Top deck</div>
}