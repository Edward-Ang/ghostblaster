import { FaWhatsapp } from "react-icons/fa6";
import { useTheme } from "@/contexts/ThemeContext";

function WaHeader() {
  const { theme } = useTheme();

  return (
    <>
      <header
        className={`flex justify-center p-4 shadow-md sticky top-0 ${
          theme === "dark"
            ? "text-white var(--background)"
            : "text-black bg-white"
        }`}
        style={{ zIndex: 2 }}
      >
        <h1 className="text-lg font-bold flex items-center gap-2">
          <FaWhatsapp className="text-xl text-[#25D366]" />
          WhatsApp
        </h1>
      </header>
      <hr
        className={`${
          theme === "dark" ? "border-gray-700 shadow-md" : "border-gray-300"
        }`}
      />
    </>
  );
}

export default WaHeader;
