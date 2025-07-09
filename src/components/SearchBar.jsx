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

  console.log('components', components)

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
          // Trip type radios (theme2)
          if (
            field.tag === "div" &&
            field.classes?.includes("trip-radio-wrapper") &&
            field.components?.length
          ) {
            return (
              <div
                key={idx}
                className="trip-radio-wrapper"
                style={{ ...field.style, ...field.appliedStyle }}
              >
                {field.components.map((labelComp, i) => {
                  const input = labelComp.components.find(
                    (c) => c.type === "input"
                  );
                  const text = labelComp.components.find(
                    (c) => c.type === "textnode"
                  );

                  return (
                    <label
                      key={i}
                      style={{
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type={input?.attributes?.type || "radio"}
                        name={input?.attributes?.name || "tripType"}
                        value={input?.attributes?.value || ""}
                        defaultChecked={!!input?.attributes?.checked}
                        {...register(input?.attributes?.name || "tripType")}
                      />
                      {text?.content}
                    </label>
                  );
                })}
              </div>
            );
          }

          // Skip Return Date if not needed
          if (field.placeholder === "Return Date" && !showReturn) return null;

          // Render select dropdown
          if (field.type === "select") {
            return (
              <Controller
                key={idx}
                name="traveler" // Change this if you want dynamic field names
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
                      minWidth: 150,
                      padding: "8px",
                      borderRadius: "6px",
                      ...field.style,
                      ...field.appliedStyle,
                    }}
                  >
                    <option value="" disabled>
                      {field.components?.[0]?.content || "Select..."}
                    </option>
                    {field.components
                      ?.filter((c) => c.type === "option")
                      .map((option, i) => (
                        <option
                          key={i}
                          value={option.attributes?.value || option.content}
                        >
                          {option.content}
                        </option>
                      ))}
                  </select>
                )}
              />
            );
          }

          // Date Pickers
          if (
            field.tag === "input" &&
            (field.placeholder === "Departure Date" ||
              field.placeholder === "Return Date")
          ) {
            const name = field.placeholder.toLowerCase().replace(" ", "_");
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

          // Regular input (including traveler input as number)
          if (field.tag === "input") {
            const name = field.placeholder.toLowerCase().replace(" ", "_");
            return (
              <input
                key={idx}
                type={field.attributes?.type || "text"}
                placeholder={field.placeholder}
                className={`${
                  field.classes?.join(" ") || ""
                } border border-gray-300 px-2 py-1 rounded`}
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
                } px-4 py-1 rounded border border-gray-400`}
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
