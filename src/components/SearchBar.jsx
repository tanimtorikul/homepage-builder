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
  const {
    handleSubmit,
    control,
    register,
    watch,
  } = useForm({
    defaultValues: {
      tripType: "round",
    },
  });

  const tripType = watch("tripType");
  const [tripTypeTouched, setTripTypeTouched] = useState(false);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "tripType") {
        setTripTypeTouched(true);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const showReturnDate = tripType === "round" || !tripTypeTouched;

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
    if (data.return_date && tripType === "round")
      data.return_date = data.return_date.format("YYYY-MM-DD");
    console.log("Form Data:", data);
  };

  return (
    <form
      id={id}
      onSubmit={handleSubmit(onSubmit)}
      style={{ ...appliedStyle, marginBlock: "2rem", }}
      className={classes?.join(" ")}
      lang={language}
      dir={direction}
    >
      {components.map((field, idx) => {
        if (field.placeholder === "Return Date" && !showReturnDate) return null;

        if (field.classes?.includes("trip-radio-wrapper") && field.components) {
          return (
            <div key={idx} className={`flex gap-4 ${field.classes?.join(" ")}`}>
              {field.components.map((radioOption, radioIdx) => (
                <label
                  key={radioIdx}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    {...register("tripType")}
                    value={radioOption.components[0].attributes.value}
                    defaultChecked={radioOption.components[0].attributes.checked}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">
                    {radioOption.components[1].content}
                  </span>
                </label>
              ))}
            </div>
          );
        }

        const name =
          field.placeholder?.toLowerCase().replace(/ /g, "_") || `field_${idx}`;

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

        if (field.tag === "select") {
          const travelerType =
            field.components?.[0]?.content === "Traveler Count with Details"
              ? "Traveler Count with Details"
              : "Traveler";

          const options =
            travelerType === "Traveler Count with Details"
              ? [
                  { label: "Adult", value: "adult" },
                  { label: "Child", value: "child" },
                  { label: "Senior", value: "senior" },
                ]
              : [{ label: "Traveler", value: "traveler" }];

          return (
            <Controller
              key={idx}
              name="traveler"
              control={control}
              defaultValue={travelerType}
              render={({ field: { onChange, value } }) => (
                <select
                  onChange={onChange}
                  value={value}
                  className={`${
                    field.classes?.join(" ") || ""
                  } border border-gray-600 px-2 py-2 rounded focus:outline-none`}
                  style={{
                    minWidth: 150,
                    backgroundColor: "white",
                    ...field.style,
                    ...field.appliedStyle,
                  }}
                >
                  {options.map(({ label, value }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              )}
            />
          );
        }

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
