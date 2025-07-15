const WhyChooseUs = ({
  id,
  theme = "theme1",
  heading,
  cards = [],
  style = {},
  appliedStyle = {},
}) => {
  const mergedSectionStyle = {
    ...appliedStyle,
    ...style,
  };

  console.log(heading);
  console.log("cards", cards);

  console.log("mergedSectionStyle", mergedSectionStyle);
  return (
    <section
      id={id}
      className={`why-choose-us ${theme}`}
      style={mergedSectionStyle}
    >
      <h2>{heading}</h2>

      <div
        className="card-wrapper"
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: `repeat(${cards.length}, 1fr)`,
          ...(cards[0]?.parentStyle || {}),
        }}
      >
        {cards.map((card, i) => {
          const mergedCardStyle = {
            ...card.appliedStyle,
            ...card.style,
          };

          console.log("mergedCardStyle", mergedCardStyle);

          return (
            <div
              key={card.id || i}
              className={`why-choose-us-card ${card.classes?.join(" ") || ""}`}
              style={mergedCardStyle}
            >
              {card.image && <img  src={card.image} alt={card.title} />}
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WhyChooseUs;
