const searchBarComponent = (editor) => {
  editor.Components.addType("search-bar", {
    model: {
      defaults: {
        tagName: "div",
        droppable: true,
        stylable: true,
        editable: true,
        classes: ["search-bar"],
        attributes: {
          theme: "theme1",
          language: "en",
          direction: "ltr",
          showTraveler: false,
          searchType: "oneway",
          travelerType: "label",
          travelerDropdownType: "traveler-count",
        },
        traits: [],
      },

      init() {
        this.listenTo(this, "change:theme", this.updateComponents);
        this.listenTo(this, "change:searchType", this.updateComponents);
        this.listenTo(this, "change:language", this.updateComponents);
        this.listenTo(this, "change:direction", this.updateComponents);
        this.listenTo(this, "change:showTraveler", () => {
          this.updateTraitsBasedOnTraveler();
          this.updateComponents();
        });
        this.listenTo(this, "change:travelerType", () => {
          this.updateTraitsBasedOnTraveler();
          this.updateComponents();
        });
        this.listenTo(this, "change:travelerDropdownType", this.updateComponents);

        this.updateTraitsBasedOnTraveler();
        this.updateComponents();
      },

      updateTraitsBasedOnTraveler() {
        const showTraveler = this.get("showTraveler");
        const travelerType = this.get("travelerType");

        const baseTraits = [
          {
            type: "select",
            name: "theme",
            label: "Select Theme",
            options: [
              { value: "theme1", name: "Theme 1" },
              { value: "theme2", name: "Theme 2" },
            ],
            value: "theme1",
            changeProp: 1,
          },
          {
            type: "select",
            name: "searchType",
            label: "Search Type",
            options: [
              { value: "oneway", name: "One Way" },
              { value: "round", name: "Round Way" },
            ],
            value: "oneway",
            changeProp: 1,
          },
          {
            type: "select",
            name: "language",
            label: "Language",
            options: [
              { value: "en", name: "English" },
              { value: "bn", name: "বাংলা" },
            ],
            value: "en",
            changeProp: 1,
          },
          {
            type: "select",
            name: "direction",
            label: "Direction",
            options: [
              { value: "ltr", name: "Left to Right" },
              { value: "rtl", name: "Right to Left" },
            ],
            value: "ltr",
            changeProp: 1,
          },
          {
            type: "checkbox",
            name: "showTraveler",
            label: "Traveler Selection",
            value: showTraveler,
            changeProp: 1,
          },
        ];

        if (showTraveler) {
          baseTraits.push({
            type: "select",
            name: "travelerType",
            label: "Traveler Type",
            options: [
              { value: "dropdown", name: "Dropdown" },
              { value: "label", name: "Label" },
            ],
            value: "label",
            changeProp: 1,
          });

          if (travelerType === "dropdown") {
            baseTraits.push({
              type: "select",
              name: "travelerDropdownType",
              label: "Traveler Dropdown Mode",
              options: [
                { value: "traveler-count", name: "Traveler Count" },
                { value: "traveler-details", name: "Traveler Count with Details" },
              ],
              value: "traveler-count",
              changeProp: 1,
            });
          }
        }

        this.set("traits", baseTraits);
      },

      updateComponents() {
        const theme = this.get("theme");
        const searchType = this.get("searchType");
        const language = this.get("language");
        const direction = this.get("direction");
        const showTraveler = this.get("showTraveler");
        const travelerType = this.get("travelerType") || "label";
        const travelerDropdownType = this.get("travelerDropdownType") || "traveler-count";

        const texts = {
          en: {
            origin: "Origin",
            destination: "Destination",
            departure: "Departure Date",
            return: "Return Date",
            search: "Search",
            oneway: "One Way",
            round: "Round Way",
            travelers: "Travelers",
            travelerDetails: "Traveler Count with Details",
          },
          bn: {
            origin: "উৎপত্তি স্থান",
            destination: "গন্তব্য স্থান",
            departure: "যাত্রার তারিখ",
            return: "ফেরার তারিখ",
            search: "অনুসন্ধান",
            oneway: "একমুখী",
            round: "দ্বিমুখী",
            travelers: "ভ্রমণকারীর সংখ্যা",
            travelerDetails: "ভ্রমণকারী বিস্তারিতসহ সংখ্যা",
          },
        };

        const t = texts[language] || texts.en;

        const comps = [];

        if (theme === "theme2") {
          const radioComponents = [
            {
              type: "label",
              components: [
                {
                  type: "input",
                  attributes: {
                    type: "radio",
                    name: "tripType",
                    value: "oneway",
                    checked: searchType === "oneway",
                  },
                },
                { type: "textnode", content: t.oneway },
              ],
            },
          ];

          if (searchType === "round") {
            radioComponents.push({
              type: "label",
              components: [
                {
                  type: "input",
                  attributes: {
                    type: "radio",
                    name: "tripType",
                    value: "round",
                  },
                },
                { type: "textnode", content: t.round },
              ],
            });
          }

          comps.push({
            type: "div",
            classes: ["trip-radio-wrapper"],
            components: radioComponents,
          });
        }

        const directionClass = direction === "rtl" ? "rtl-direction" : "ltr-direction";

        comps.push(
          {
            type: "input",
            attributes: {
              type: "text",
              placeholder: t.origin,
              dir: direction,
            },
            classes: [directionClass],
          },
          {
            type: "input",
            attributes: {
              type: "text",
              placeholder: t.destination,
              dir: direction,
            },
            classes: [directionClass],
          },
          {
            type: "input",
            attributes: {
              type: "date",
              placeholder: t.departure,
              dir: direction,
            },
            classes: [directionClass],
          }
        );

        if (searchType === "round") {
          comps.push({
            type: "input",
            attributes: {
              type: "date",
              placeholder: t.return,
              dir: direction,
            },
            classes: [directionClass],
          });
        }

        if (showTraveler) {
          if (travelerType === "dropdown") {
            const placeholderText =
              travelerDropdownType === "traveler-details"
                ? t.travelerDetails
                : t.travelers;

            comps.push({
              type: "select",
              attributes: {
                dir: direction,
              },
              classes: [directionClass],
              components: [
                {
                  type: "option",
                  attributes: {
                    value: "",
                    disabled: true,
                    selected: true,
                    hidden: true,
                  },
                  content: placeholderText,
                },
              ],
            });
          } else {
            comps.push({
              type: "input",
              attributes: {
                type: "number",
                min: 1,
                value: 1,
                placeholder: t.travelers,
                dir: direction,
              },
              classes: [directionClass],
            });
          }
        }

        comps.push({
          type: "button",
          content: t.search,
          classes: [directionClass],
        });

        this.addAttributes({ dir: direction });
        this.addClass(directionClass);

        this.components(comps);
      },
    },
  });
};

export default searchBarComponent;
