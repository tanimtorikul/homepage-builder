const latestNewsComponent = (editor) => {
  editor.I18n.addMessages({
    en: {
      latestNews: {
        trait: {
          mode: "News Mode",
          static: "Static",
          dynamic: "Dynamic",
          staticText: "Static News Text",
          direction: "Text Direction",
          language: "Language",
        },
      },
    },
  });

  editor.Components.addType("latest-news", {
    model: {
      defaults: {
        tagName: "div",
        attributes: {
          mode: "static",
          text: "This is a static latest news scrolling text...",
          direction: "ltr",
          language: "en",
        },
        traits: [],
        droppable: false,
        editable: false,
        classes: ["latest-news-marquee"],
        style: {
          display: "block",
          width: "100%",
          overflow: "hidden",
          padding: "10px",
          boxSizing: "border-box",
          backgroundColor: "#069494 ",
          border: "1px solid #ccc",
          borderRadius: "6px",
          color: "#333",
          fontSize: "16px",
          fontWeight: "700",
          fontFamily: "'Segoe UI', sans-serif",
        },
      },

      init() {
        this.updateTraits();

        // Direction change
        this.listenTo(this, "change:attributes:direction", () => {
          this.view.render();
        });

        this.listenTo(this, "change:attributes:mode", () => {
          this.updateTraits();
          this.view.render();
        });

        this.listenTo(this, "change:attributes:language", () => {
          this.updateTraits();
          this.view.render();
        });

        this.listenTo(this, "change:attributes:text", () => {
          this.view.render();
        });
      },

      updateTraits() {
        const mode = this.get("attributes").mode;
        const traits = [
          {
            type: "select",
            name: "mode",
            label: "News Mode",
            options: [
              { value: "static", name: "Static" },
              { value: "dynamic", name: "Dynamic" },
            ],
            value: "static",
          },
          {
            type: "select",
            name: "direction",
            label: "Text Direction",
            options: [
              { value: "ltr", name: "Left to Right" },
              { value: "rtl", name: "Right to Left" },
            ],
            value: "ltr",
            changeProp: 1,
          },
        ];

        if (mode === "static") {
          traits.push(
            {
              type: "text",
              name: "text",
              label: "Static News Text",
              placeholder: "Enter static news text",
              changeProp: 1,
            },
            {
              type: "select",
              name: "language",
              label: "Language",
              options: [
                { value: "en", name: "English" },
                { value: "ar", name: "Arabic" },
              ],
              value: "en",
              changeProp: 1,
            }
          );
        }

        this.set("traits", traits);
      },
    },

    view: {
  onRender() {
    const attrs = this.model.getAttributes();
    const { text, mode, direction, language } = attrs;

    // Apply default styles to outer element
    Object.assign(this.el.style, {
    display: "block",
          width: "100%",
          overflow: "hidden",
          padding: "10px",
          boxSizing: "border-box",
          backgroundColor: "#069494 ",
          border: "1px solid #ccc",
          borderRadius: "6px",
          color: "#333",
          fontSize: "16px",
          fontWeight: "700",
          fontFamily: "'Segoe UI', sans-serif",
    });

    // Set direction
    this.el.setAttribute("dir", direction);
    this.el.style.direction = direction;

    // Clear old content
    this.el.innerHTML = "";

    // Create wrapper and set content
    const wrapper = document.createElement("div");

    let finalText = "";
    if (mode === "static") {
      finalText = text || (language === "ar" ? "نص الأخبار الثابتة" : "This is a static latest news scrolling text...");
    } else {
      finalText = language === "ar"
        ? "سيظهر آخر الأخبار الديناميكية هنا..."
        : "Dynamic latest news will appear here...";
    }

    wrapper.textContent = finalText;

    // Optional: Add some style to the inner wrapper if needed
    wrapper.style.whiteSpace = "nowrap";
    wrapper.style.display = "inline-block";
    wrapper.style.width = "100%";
    wrapper.style.textAlign = direction === "rtl" ? "right" : "left";
    wrapper.style.paddingLeft = direction === "rtl" ? "0" : "20px";
    wrapper.style.paddingRight = direction === "rtl" ? "20px" : "0";

    this.el.appendChild(wrapper);
  }
}

  });
};

export default latestNewsComponent;
