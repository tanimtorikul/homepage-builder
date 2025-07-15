const heroImageComponent = (editor) => {
  editor.Components.addType("item-card", {
    model: {
      defaults: {
        tagName: "div",
        droppable: false,
        editable: false,
        attributes: {
          class: "hero-image-card",
        },
        traits: [],
        style: {
          backgroundImage: "url('https://via.placeholder.com/1200x400')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "4rem 2rem",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#ffffff",
          fontSize: "2rem",
          fontWeight: "bold",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        },
        classes: ["hero-image"],
      },
      init() {
        this.listenTo(this, "change:attributes", this.handleChange);
      },
      handleChange() {
        this.view.render();
      },
    },
    view: {
      onRender() {
        const attrs = this.model.getAttributes();

        this.el.innerHTML = `
         
        `;
      },
    },
  });
};

export default heroImageComponent;
