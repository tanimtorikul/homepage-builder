import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import { useForm, Controller } from "react-hook-form";

const SearchBar = ({
  components,
  appliedStyle,
  classes,
  id,
  language,
  direction,
  theme,
  returnField,
}) => {
  const [locations, setLocations] = useState([]);
  const showReturn = theme === "theme1" && returnField === "with-return";

  const { handleSubmit, control, register } = useForm();

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await fetch("locations.json");
        const data = await response.json();
        setLocations(data);
      } catch (err) {
        console.error("Failed to load location data:", err);
      }
    };
    loadLocations();
  }, []);

  const onSubmit = (data) => {
    if (data.departure_date)
      data.departure_date = data.departure_date.format("YYYY-MM-DD");
    if (data.return_date)
      data.return_date = data.return_date.format("YYYY-MM-DD");
    console.log("Form Data:", data);
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      style={{ ...appliedStyle, marginTop: "1rem", marginBottom: "1rem" }}
      className={classes?.join(" ")}
      lang={language}
      dir={direction}
    >
      {components.map((field, idx) => {
        // Skip Return Date if not needed
        if (field.placeholder === "Return Date" && !showReturn) return null;

        const name =
          field.placeholder?.toLowerCase().replace(/ /g, "_") || `field_${idx}`;

        // Native select for Origin/Destination
        const isSelectDropdown =
          field.tag === "input" &&
          (field.placeholder === "Origin" ||
            field.placeholder === "Destination");

        if (isSelectDropdown) {
          return (
            <Controller
              key={idx}
              name={field.placeholder.toLowerCase()}
              control={control}
              defaultValue=""
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <select
                  {...rest}
                  ref={ref}
                  onChange={onChange}
                  value={value}
                  className={field.classes?.join(" ")}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid gray",
                    minWidth: 150,
                    padding: "8px",
                    borderRadius: "6px",
                    ...field.style,
                    ...field.appliedStyle,
                  }}
                >
                  <option value="" disabled>
                    {field.placeholder}
                  </option>
                  {locations.map((loc, i) => (
                    <option key={i} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              )}
            />
          );
        }

        // DatePicker
        if (
          field.tag === "input" &&
          (field.placeholder === "Departure Date" ||
            field.placeholder === "Return Date")
        ) {
          return (
            <Controller
              key={idx}
              name={name}
              control={control}
              defaultValue={null}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <DatePicker
                  {...rest}
                  onChange={onChange}
                  value={value || null}
                  placeholder={field.placeholder}
                  style={{
                    backgroundColor: "white",
                    border: "1px solid gray",
                    minWidth: 150,
                    padding: "8px",
                    borderRadius: "6px",
                    ...field.style,
                    ...field.appliedStyle,
                  }}
                  className={field.classes?.join(" ")}
                  ref={ref}
                />
              )}
            />
          );
        }

        // Traveler dropdowns coming as <select> — override as <input>
        if (field.tag === "select") {
          const placeholder =
            field.components?.[0]?.content === "Travelers"
              ? "Travelers"
              : field.components?.[0]?.content === "Traveler Count with Details"
              ? "Traveler Count with Details"
              : "Traveler";

          return (
            <input
              key={idx}
              type="text"
              placeholder={placeholder}
              className={`${
                field.classes?.join(" ") || ""
              } border border-gray-600 px-2 py-2 rounded focus:outline-none`}
              style={{
                backgroundColor: "white",
                ...field.style,
                ...field.appliedStyle,
              }}
              {...register("traveler")}
            />
          );
        }

        // Generic text input fallback
        if (field.tag === "input") {
          return (
            <input
              key={idx}
              type={field.type || "text"}
              placeholder={field.placeholder}
              className={`${
                field.classes?.join(" ") || ""
              } border border-gray-600 px-2 py-2 rounded focus:outline-none`}
              style={{
                backgroundColor: "white",
                ...field.style,
                ...field.appliedStyle,
              }}
              {...register(name)}
            />
          );
        }

        // Submit button
        if (field.tag === "button") {
          return (
            <button
              key={idx}
              type="submit"
              className={`${
                field.classes?.join(" ") || ""
              } px-4 py-2 rounded border border-gray-600`}
              style={{
                backgroundColor: "white",
                cursor: "pointer",
                ...field.style,
                ...field.appliedStyle,
              }}
            >
              {field.content || "Search"}
            </button>
          );
        }

        return null;
      })}
    </form>
  );
};

export default SearchBar;
