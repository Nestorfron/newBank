import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "../src/store/appContext.jsx";

import { Home } from "./pages/home.jsx";
import { Navbar } from "./components/navbar.jsx";
import { Dashboard } from "./pages/dashboard.jsx";
import { AllUsers } from "./pages/allUsers.jsx";
import { Admins } from "./components/admins.jsx";
import { Branches } from "./pages/branches.jsx";
import { Providers } from "./pages/providers.jsx";
import { Assets } from "./pages/assets.jsx";
import { UsersMB } from "./pages/usersMB.jsx";
import { Migrations } from "./pages/migrations.jsx";
import { Messages } from "./pages/messages.jsx";
import { History } from "./pages/history.jsx";

function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <BrowserRouter {...pageProps}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/users" element={<AllUsers/>}/>
            <Route path="/admins" element={<Admins/>}/>
            <Route path="/branches" element={<Branches/>}/>
            <Route path="/providers" element={<Providers/>}/>
            <Route path="/assets" element={<Assets/>}/>
            <Route path="/usersMB" element={<UsersMB/>}/>
            <Route path="/migrations" element={<Migrations/>}/>  
            <Route path="/messages" element={<Messages/>}/>
            <Route path="/history" element={<History/>}/>
            <Route element={<h1>Not found!</h1>} />
          </Routes>
        </BrowserRouter>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default injectContext(App);
