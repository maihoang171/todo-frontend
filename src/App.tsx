import AppRoutes from "./routes/app-routes";
import { Toaster } from "sonner";
function App() {
  return (
    <>
      <div className="h-screen">
        <div className="pt-10">
          <AppRoutes />
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default App;
