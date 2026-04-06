import { Toaster } from "sonner";
import { AppRoute } from "./routes/route";
function App() {
  return (
    <>
      <div className="h-screen">
        <div className="pt-10">
          <AppRoute/>
        </div>
        <Toaster />
      </div>
    </>
  );
}

export default App;
