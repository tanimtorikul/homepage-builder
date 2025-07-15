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

     

      // ✅ Image
      if (comp.type === "image") {
        found.push({
          type: "image",
          alt: comp.attributes?.alt || "",
          src: comp.attributes?.src || "",
          ...common,
          attributes: comp.attributes || {},
        });
      }

      // ✅ Text
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

      // ✅ Search Bar
      else if (comp.type === "search-bar") {
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

      // ✅ Latest News
      else if (comp.type === "latest-news") {
        found.push({
          type: "latest-news",
          mode: comp.attributes?.mode || "static",
          text: "",
          ...common,
        });
      }

       // ✅ Skip why-choose-us-card directly
      if (comp.type === "why-choose-us-card") continue;

      // ✅ Why Choose Us Section
      if (comp.type === "why-choose-us") {
        const wrapper = comp.components?.find((c) => c.type === "card-wrapper");

        const cards = (wrapper?.components || []).map((card) => {
          const imageComp = card.components?.find((c) => c.type === "image");
          const titleComp = card.components?.find((c) => c.tagName === "h3");
          const paraComp = card.components?.find((c) => c.tagName === "p");

          const title =
          titleComp?.content ||  titleComp?.components?.find((c) => c.type === "textnode")?.content || "";
          const description = paraComp?.content ||  paraComp?.components?.find((c) => c.type === "textnode")?.content || "";

          return {
            id: card.attributes?.id,
            image: imageComp?.attributes?.src || "",
            title,
            description,
            style: card.style || {},
            appliedStyle: card.attributes?.id ? styleMap[card.attributes.id] || {} : {},
            classes: card.classes || [],
          };
        });

        const heading =
          comp.attributes?.heading ||
          comp.attributes?.title ||
          comp.components?.find((c) => c.type === "text")?.components?.find((c) => c.type === "textnode")?.content ||
          "Why Choose Us?";

        found.push({
          type: "why-choose-us",
          heading,
          theme: comp.attributes?.theme || "theme1",
          cards,
          ...common,
        });

        // ✅ extract other components inside section, excluding the card-wrapper
        extract(comp.components?.filter((c) => c.type !== "card-wrapper" && c.type !== "why-choose-us-card"));
        continue;
      }

      if (comp.components) extract(comp.components);
    }
  };

  // 🔁 Loop through all pages & frames
  parsedJson.pages?.forEach((p) =>
    p.frames?.forEach((f) => extract(f.component?.components || []))
  );

  // Load dynamic news if required
  for (const comp of found) {
    if (comp.type === "latest-news") {
      if (comp.mode === "static") {
        const original = parsedJson.pages
          .flatMap((p) => p.frames || [])
          .flatMap((f) => f.component?.components || [])
          .find((c) => c.attributes?.id === comp.id);
        comp.text = original?.text || original?.attributes?.text || "";
      } else {
        try {
          const res = await fetch("/data.json");
          const data = await res.json();
          comp.text = data?.latestNews || "No dynamic news found.";
        } catch {
          comp.text = "Failed to load dynamic news.";
        }
      }
    }
  }

  return found;
};

export default extractComponentsFromJson;
