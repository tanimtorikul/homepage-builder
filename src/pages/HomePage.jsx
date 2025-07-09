import { useEffect, useState } from "react";
import extractComponentsFromJson from "../utils/extractComponentFromJson";
import HeroImage from "../components/HeroImage";
import SearchBar from "../components/SearchBar";
import Topbar from "../components/Topbar";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComponents = async () => {
      const json = localStorage.getItem("product-template-json");
      if (!json) {
        setComponents([{ type: "error", text: "No data found" }]);
        setLoading(false);
        return;
      }

      const parsed = JSON.parse(json);
      const extracted = await extractComponentsFromJson(parsed);

      setComponents(extracted);
      setLoading(false);
    };

    loadComponents();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Topbar />
      <Navbar />

      <main>
        {components.map((comp, i) => {
          if (comp.type === "image") return <HeroImage key={i} {...comp} />;
          if (comp.type === "search-bar") return <SearchBar key={i} {...comp} />;
          return null;
        })}
      </main>

    </>
  );
};

export default HomePage;
