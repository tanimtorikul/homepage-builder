const HeroImage = ({ attributes, style, appliedStyle }) => {
  console.log("attributes", attributes);
  console.log("style", style);
  console.log("appliedStyle", appliedStyle);

  const imgSrc = attributes?.src;
  const imgAlt = attributes?.alt;

  const combinedStyle = { ...style, ...appliedStyle };

  return (
    <section
      className="hero-section"
      style={{ width: "100%", ...combinedStyle }}
    >
      <img
        src={imgSrc}
        alt={imgAlt}
        style={{ width: "100%", ...combinedStyle }}
      />
    </section>
  );
};

export default HeroImage;
