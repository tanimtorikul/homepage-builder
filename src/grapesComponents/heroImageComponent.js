const heroImageComponent = (editor) => {
  editor.Components.addType("item-card", {
    model: {
      defaults: {
        tagName: "div",
        droppable: false,
        editable: false,
        attributes: {
         
        },
        traits: [
        
        ],
    
        style: {}, 
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