import "./App.css";
import { PrimeReactProvider } from "primereact/api";
import SecretViewer from "./components/SecretViewer";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./components/NotFound/NotFound";
import SecretCreator from "./components/SecretCreator/SecretCreator";
export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SecretCreator />,
    },
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "secret/:id",
      element: <SecretViewer />,
    },
  ]);

  return (
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  );
}
