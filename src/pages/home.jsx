import { Chart } from "@/components/chart";
import { PieChartComponent } from "@/components/PieChart";
import { AreaChartComponent } from "@/components/AreaChart";

function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header
        className="text-black bg-white p-4 shadow-md sticky top-0"
        style={{ zIndex: 2 }}
      >
        <h1 className="text-lg font-bold">Home</h1>
      </header>
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
