import { FaMeta } from "react-icons/fa6";

function BsHeader() {
  return (
    <header
      className="flex justify-center text-black bg-white p-4 shadow-md sticky top-0"
      style={{ zIndex: 2 }}
    >
      <h1 className="text-lg font-bold flex items-center gap-2">
        <FaMeta className="text-[#0866FF] text-xl" />
        Business Suite
      </h1>
    </header>
  );
}

export default BsHeader;
