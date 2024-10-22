import React from "react";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "../src/store/appContext.jsx";

import { Home } from "./pages/home.jsx";
import { Navbar } from "./components/navbar.jsx";
import Dashboard from "./pages/dashboard.jsx";
import { Users } from "./pages/users.jsx";
import { Branches } from "./pages/branches.jsx";
import { Providers } from "./pages/providers.jsx";
import { Assets } from "./pages/assets.jsx";
import { UsersMB } from "./pages/usersMB.jsx";

function App({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <BrowserRouter {...pageProps}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/users" element={<Users/>}/>
            <Route path="/branches" element={<Branches/>}/>
            <Route path="/providers" element={<Providers/>}/>
            <Route path="/assets" element={<Assets/>}/>
            <Route path="/usersMB" element={<UsersMB/>}/>
            <Route element={<h1>Not found!</h1>} />
          </Routes>
        </BrowserRouter>
      </NextThemesProvider>
    </NextUIProvider>
  );
}

export default injectContext(App);
