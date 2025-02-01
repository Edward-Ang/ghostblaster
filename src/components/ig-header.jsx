import { FaInstagram } from "react-icons/fa6";

function IgHeader() {
  return (
    <header
      className="flex justify-center text-black bg-white p-4 shadow-md sticky top-0"
      style={{ zIndex: 2 }}
    >
      <h1 className="text-lg font-bold flex items-center gap-2">
        <FaInstagram
          className="text-xl"
          style={{
            backgroundImage:
              "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
            WebkitBackgroundClip: "text",
          }}
        />
        Instagram
      </h1>
    </header>
  );
}

export default IgHeader;
