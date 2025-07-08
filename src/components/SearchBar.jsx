import { useEffect, useState } from "react";
import { Select, DatePicker, Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";

const { Option } = Select;

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

  // Initialize React Hook Form
  const { handleSubmit, control, register } = useForm();

  useEffect(() => {
    // Load locations data from JSON or API
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

  // form submit handler
  const onSubmit = (data) => {
    // converting moment data to string
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
      style={appliedStyle}
      className={classes?.join(" ")}
      lang={language}
      dir={direction}
    >
      {components.map((field, idx) => {
        // Trip type radio buttons section
        if (
          field.tag === "div" &&
          field.classes?.includes("trip-radio-wrapper") &&
          field.components?.length
        ) {
          return (
            <div key={idx} className="trip-radio-wrapper" style={field.style}>
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

        // Hide return date if not needed
        if (field.placeholder === "Return Date" && !showReturn) return null;

        // Select dropdown for Origin/Destination
        const isSelect =
          field.placeholder === "Origin" || field.placeholder === "Destination";

        if (field.tag === "input" && isSelect) {
          return (
            <Controller
              key={idx}
              name={field.placeholder.toLowerCase()}
              control={control}
              defaultValue={undefined}
              render={({ field: { onChange, value, ref, ...rest } }) => (
                <Select
                  {...rest}
                  onChange={onChange}
                  value={value}
                  placeholder={field.placeholder}
                  style={{ minWidth: 200, ...field.style }}
                  className={field.classes?.join(" ")}
                  ref={ref}
                  showSearch
                  optionFilterProp="children"
                >
                  {locations.map((loc, i) => (
                    <Option key={i} value={loc.value}>
                      {loc.label}
                    </Option>
                  ))}
                </Select>
              )}
            />
          );
        }

        // DatePicker for Departure/Return Date
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
                  style={{ minWidth: 200, ...field.style }}
                  className={field.classes?.join(" ")}
                  ref={ref}
                />
              )}
            />
          );
        }

        // Regular input
        if (field.tag === "input") {
          const name = field.placeholder.toLowerCase().replace(" ", "_");
          return (
            <input
              key={idx}
              type={field.type || "text"}
              placeholder={field.placeholder}
              className={`${
                field.classes?.join(" ") || ""
              } border border-gray-300 bg-white px-2 py-1 rounded`}
              style={field.style}
              {...register(name)}
            />
          );
        }

        // Button as submit
        if (field.tag === "button") {
          return (
            <Button
              key={idx}
              htmlType="submit"
              className={`${
                field.classes?.join(" ") || ""
              } bg-[#EFEFEF] rounded px-4 py-1`}
              style={field.style}
            >
              {field.content || "Search"}
            </Button>
          );
        }

        return null;
      })}
    </form>
  );
};

export default SearchBar;
