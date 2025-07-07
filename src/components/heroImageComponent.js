const heroImageComponent = (editor) => {
  editor.Components.addType("item-card", {
    model: {
      defaults: {
        tagName: "div",
        droppable: false,
        editable: false,
        attributes: {
          itemName: "Name",
          price: "price",
        },
        traits: [
          { type: "text", name: "itemName", label: "Item Name" },
          { type: "text", name: "price", label: "Price" },
        ],
        // Remove inline styles (define them in the Style Manager instead)
        style: {}, 
        classes: ["item-card"], // Add a default CSS class
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
          <h4 >${attrs.itemName}</h4>
          <p >${attrs.price}</p>
        `;
        
        // Preserve existing classes and don't override styles
        if (!this.el.classList.contains("item-card")) {
          this.el.classList.add("item-card");
        }
      },
    },
  });
};

export default heroImageComponent;