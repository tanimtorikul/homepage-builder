import themeStyles from "../utils/themeStyles";

const whyChooseUsComponent = (editor) => {
  // Card Wrapper
  editor.Components.addType("card-wrapper", {
  model: {
    defaults: {
      tagName: "div",
      droppable: true,
      attributes: { class: "card-wrapper" },
      components: [{ type: "why-choose-us-card" }],
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        gap: "1rem",
        width: "100%",
      },
      traits: [
        {
          type: "select",
          name: "columns",
          label: "Columns",
          options: [
            { value: "1", name: "1 Columns" },
            { value: "2", name: "2 Columns" },
            { value: "3", name: "3 Columns" },
            { value: "4", name: "4 Columns" },
          ],
          default: "3",
          changeProp: 1,
        },
      ],
    },
    init() {
      this.listenTo(this, "change:columns", this.updateColumns);
      this.updateColumns();
    },
    updateColumns() {
      const cols = parseInt(this.get("columns"));

      //  Make sure to re-set grid layout every time
      this.setStyle({
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: "1rem",
        width: "100%",
      });

      const existingCards = this.components().filter(
        (c) => c.get("type") === "why-choose-us-card"
      );

      if (existingCards.length < cols) {
        const toAdd = cols - existingCards.length;
        for (let i = 0; i < toAdd; i++) {
          this.append({ type: "why-choose-us-card" });
        }
      }

      if (existingCards.length > cols) {
        const toRemove = existingCards.slice(cols);
        toRemove.forEach((card) => card.remove());
      }

      this.trigger("change:style"); 
      editor.trigger("component:update", this);
    },
  },
  view: {
    onRender() {
      this.el.style.display = "grid";
      this.el.style.gap = "1rem";
      this.el.style.gridTemplateColumns = `repeat(4, 1fr)`;
      this.el.style.width = "100%";
    },
  },
});


  // Card Component
  editor.Components.addType("why-choose-us-card", {
    model: {
      defaults: {
        tagName: "div",
        droppable: true,
        attributes: { class: "why-choose-us-card" },
        components: [
          {
            type: "image",
            attributes: {
              src: "https://via.placeholder.com/50",
              alt: "Icon",
            },
            style: {
              width: "50px",
              height: "50px",
              display: "block",
              margin: "0 auto 10px",
            },
          },
          {
            tagName: "h3",
            type: "text",
            content: "Card Title",
            style: {
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "8px",
              textAlign: "center",
            },
          },
          {
            tagName: "p",
            type: "text",
            content: "Description goes here",
            style: {
              fontSize: "14px",
              textAlign: "center",
              margin: "0",
            },
          },
        ],
        style: {
          padding: "1.5rem",
          borderRadius: "8px",
        },
      },
      init() {
        const parent = this.closestType("why-choose-us");
        if (parent) {
          this.listenTo(parent, "change:theme", () => {
            this.applyTheme(parent.get("theme"));
          });
          this.applyTheme(parent.get("theme"));
        }
      },
      applyTheme(theme) {
        const styles = themeStyles[theme || "theme1"];
        const removeKeys = [
          "background-color",
          "color",
          "box-shadow",
          "border",
          "border-left",
          "border-right",
          "text-align",
        ];
        removeKeys.forEach((key) => this.removeStyle(key));

        this.setStyle(
          {
            ...styles,
            padding: "1.5rem",
            "border-radius": "8px",
          },
          { important: true }
        );

        this.em.trigger("component:update", this);
        this.em.trigger("component:styleUpdate", this);
      },
    },
    view: {
      onRender() {
        this.el.style.display = "flex";
        this.el.style.flexDirection = "column";
      },
    },
  });

  // Section
  editor.Components.addType("why-choose-us", {
    model: {
      defaults: {
        tagName: "section",
        attributes: { class: "why-choose-us-section" },
        components: [
          {
            type: "text",
            content: "Why Choose Us?",
            style: {
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "700",
              margin: "0 0 2rem 0",
            },
          },
          {
            type: "card-wrapper",
          },
        ],
        style: {
          padding: "3rem 1rem",
          backgroundColor: "#ffffff",
        },
        traits: [
          {
            type: "select",
            name: "theme",
            label: "Theme",
            options: [
              { value: "theme1", name: "Theme 1" },
              { value: "theme2", name: "Theme 2" },
              { value: "theme3", name: "Theme 3" },
              { value: "theme4", name: "Theme 4" },
              { value: "theme5", name: "Theme 5" },
            ],
            default: "theme1",
            changeProp: 1,
          },
        ],
      },
      init() {
        this.listenTo(this, "change:theme", this.updateTheme);
        this.updateTheme();
      },
      updateTheme() {
        const theme = this.get("theme") || "theme1";
        const cards = this.findType("why-choose-us-card");
        cards.forEach((card) => card.applyTheme(theme));
        editor.trigger("component:update", this);
      },
    },
    view: {
      onRender() {
        this.el.style.display = "block";
      },
    },
  });
};

export default whyChooseUsComponent;
