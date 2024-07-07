import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Methods } from "./pages/Methods";

export const AppRouter = () =>  {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/methods" element={<Methods />} />
      </Routes>
    </BrowserRouter>
  );
}
