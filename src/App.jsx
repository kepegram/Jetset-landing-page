import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Home from "./pages/Home";

// Lazy load pages for better performance
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));

// Loading component
const Loading = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "1.2rem",
      color: "#3bace3",
    }}
  >
    Loading...
  </div>
);

function App() {
  const location = useLocation();

  useEffect(() => {
    // Handle GitHub Pages routing
    if (location.pathname.includes('/?/')) {
      const path = location.pathname.split('/?/')[1];
      window.history.replaceState(null, '', '/' + path);
    }
  }, [location]);

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Suspense>
  );
}

export default App;
