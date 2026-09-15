import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell";
import { DataProvider } from "./lib/DataProvider";
import { HomePage } from "./pages/HomePage";
import { LaunchPage } from "./pages/LaunchPage";
import { MethodPage } from "./pages/MethodPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <DataProvider>
      <Shell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/launch/:slug" element={<LaunchPage />} />
          <Route path="/method" element={<MethodPage />} />
          <Route path="/index.html" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Shell>
    </DataProvider>
  );
}
