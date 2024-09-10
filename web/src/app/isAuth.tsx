// isAuth.tsx
"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";


export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const auth = localStorage.getItem("accessToken");


    useEffect(() => {
      if (!auth) {
        return redirect("/auth/signin");
      }
    }, []);


    if (!auth) {
      return null;
    }

    return <Component {...props} />;
  };
}