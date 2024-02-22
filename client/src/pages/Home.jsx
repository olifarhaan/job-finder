import { useEffect, useState } from "react";
import { FaQrcode } from "react-icons/fa";
import { FaLink } from "react-icons/fa";

import CreateLink from "../components/CreateLink";
import CreateQRCode from "../components/CreateQRCode";
import CallToAction from "../components/CallToAction";

const Home = () => {
  const [tab, setTab] = useState("url");

  useEffect(() => {
    if (localStorage.getItem("qr")) {
      setTab("qr");
    }
    if (localStorage.getItem("url")) {
      setTab("url");
    }
  }, []);

  return (
    <main>
      <section className="">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto justify-center text-center px-2 my-20">
          <span className=" mx-auto bg-[#FEE5E4] px-2 py-1  block border border-accentRed text-black">
            Get started with Job Finder
          </span>
          <h1 className="text-3xl md:text-6xl">
            Find your dream jobs in no time with
            <span className="text-accentRed font-semibold home-heading">
              Job Finder
            </span>
          </h1>
          <button
            className="bg-accentRed mt-4 px-4 py-3 text-white border border-black hover:bg-accentDarkRed transition duration-500 ease-in-out"
            onClick={() => navigate("/sign-in")}
          >
            {" "}
            Get Started
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
