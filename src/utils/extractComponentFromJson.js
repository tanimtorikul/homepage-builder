const extractComponentsFromJson = async (parsedJson) => {
  const found = [];
  const styleMap = {};

  // Map styles by id selector
  parsedJson.styles?.forEach((style) => {
    style.selectors?.forEach((sel) => {
      if (sel.startsWith("#")) {
        const id = sel.slice(1);
        styleMap[id] = style.style;
      }
    });
  });

  const extract = (comps) => {
    if (!comps) return;
    for (const comp of comps) {
      const id = comp.attributes?.id;
      const common = {
        id,
        classes: comp.classes || [],
        style: comp.style || {},
        appliedStyle: id && styleMap[id] ? styleMap[id] : {},
      };

      switch (comp.type) {
        case "image":
          found.push({
            type: "image",
            mode: comp.attributes?.mode || "static",
            text: "",
            ...common,
            attributes: comp.attributes || {},
          });
          break;

      

        case "search-bar":
          found.push({
            type: "search-bar",
            ...common,
            attributes: comp.attributes || {},
          });
          break;

        case "card":
          found.push({
            type: "card",
            ...common,
            attributes: comp.attributes || {},
          });
          break;

        // Add more types here as needed

        default:
          // Optionally, handle unknown types or skip
          break;
      }

      if (comp.components) extract(comp.components);
    }
  };

  parsedJson.pages?.forEach((p) =>
    p.frames?.forEach((f) => extract(f.component?.components || []))
  );

  return found;
};

export default extractComponentsFromJson;
