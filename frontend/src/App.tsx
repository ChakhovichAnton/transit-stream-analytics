import InteractiveMap from "./components/InteractiveMap";
import TopBar from "./components/TopBar";
import { VisualizationSettingsProvider } from "./context/visualizationSettings";

const App = () => {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 h-full">
        <VisualizationSettingsProvider>
          <InteractiveMap />
        </VisualizationSettingsProvider>
      </div>
    </div>
  );
};

export default App;
