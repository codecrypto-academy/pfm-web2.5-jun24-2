import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Methods } from "./pages/Methods";
import { AppProvider } from "./context/AppProvider";
import { Nodes } from "./pages/Nodes";

export const AppRouter = () => {
  
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/methods" element={<Methods />} />
          <Route path="/nodes/:id" element={<Nodes />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};
