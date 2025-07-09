const extractComponentsFromJson = async (parsedJson) => {
  const found = [];
  const styleMap = {};

  // Build style map from ID selectors
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
        direction: comp.direction || comp.attributes?.direction || "ltr",
        language: comp.language || comp.attributes?.language || "en",
      };

      // ✅ Search Bar component
      if (comp.type === "search-bar") {
        found.push({
          type: "search-bar",
          theme: comp.attributes?.theme || "theme1",
          returnField: comp.attributes?.returnField || "with-return",
          components: (comp.components || []).map((child) => ({
            tag: child.type,
            id: child.attributes?.id,
            placeholder: child.attributes?.placeholder,
            type: child.attributes?.type,
            content: child.content,
            classes: child.classes || [],
            style: child.attributes?.id ? styleMap[child.attributes.id] || {} : {},
            components: child.components || [],
            attributes: child.attributes || {},
          })),
          ...common,
        });
      }

      // ✅ Image component
      else if (comp.type === "image") {
        found.push({
          type: "image",
          alt: comp.attributes?.alt || "",
          src: comp.attributes?.src || "",
          ...common,
          attributes: comp.attributes || {},
        });
      }

      // ✅ Text component (title/headline)
      else if (comp.type === "text") {
        const content =
          comp.components?.find((c) => c.type === "textnode")?.content || "";

        found.push({
          type: "text",
          content,
          ...common,
          attributes: comp.attributes || {},
        });
      }

      // Recurse into nested children
      if (comp.components) extract(comp.components);
    }
  };

  // Loop through all pages & frames
  parsedJson.pages?.forEach((p) =>
    p.frames?.forEach((f) => extract(f.component?.components || []))
  );

  return found;
};

export default extractComponentsFromJson;
