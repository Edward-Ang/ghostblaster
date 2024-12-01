import { Chart } from "@/components/chart";
function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <header
        className="text-black bg-white p-4 shadow-md sticky top-0"
        style={{ zIndex: 2 }}
      >
        <h1 className="text-lg font-bold">Ghost Blaster</h1>
      </header>
      <div className="flex-grow p-6">
        <Chart />
      </div>
    </div>
  );
}

export default Home;
