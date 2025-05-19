import { Chart } from "@/components/chart";
import { PieChartComponent } from "@/components/PieChart";
import { AreaChartComponent } from "@/components/AreaChart";
import { useTheme } from "@/contexts/ThemeContext";

function Home() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col w-full min-h-screen">
      <header
        className={`text-black p-4 shadow-md sticky top-0 ${theme === "dark" ? "text-white var(--background)" : "text-black var(--background)"}`}
        style={{ zIndex: 2 }}
      >
        <h1 className="text-lg font-bold">Dashboard</h1>
      </header>
      <hr className={`${theme === "dark" ? "border-gray-700 shadow-md" : "border-gray-300"}`} />
      <div className="flex flex-col w-full">
        <div className="p-4 pb-0 flex gap-4">
          <div className="flex-1">
            <Chart />
          </div>
          <PieChartComponent />
        </div>
        <div className="p-4">
          <AreaChartComponent />
        </div>
      </div>
    </div>
  );
}

export default Home;
