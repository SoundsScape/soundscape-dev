import React from "react";
import L from "leaflet";

interface Props {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
}

function Filter({ setSelectedCategory }: Props) {
  const categories = [
    "Pop",
    "Rock",
    "Hip Hop",
    "Other",
  ];

  const [theme, setTheme] = React.useState("dark-theme");

  React.useEffect(() => {
    document.body.className = theme;

  const mapContainer = document.querySelector(".leaflet-container");
    if (mapContainer) {
      if (theme === "light-theme") {
        mapContainer.classList.remove("dark-theme");
      } else {
        mapContainer.classList.add("dark-theme");
      }
    }
  }, [theme]);

  const changeTheme = () => {
    if (theme === "light-theme") {
      setTheme("dark-theme");
    } else {
      setTheme("light-theme");
    }
  };

  return (
    <div className="flex flex-row">
      <div className="filter__select mr-4">
        <select onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="theme-toggler">
        <input
          type="checkbox"
          id="theme-toggler__checkbox"
          className="theme-toggler__checkbox"
        />
        <label
          htmlFor="theme-toggler__checkbox"
          className="theme-toggler__label"
          onClick={changeTheme}
        >
          Toggle
        </label>
      </div>
    </div>
  );
}

export default Filter;
