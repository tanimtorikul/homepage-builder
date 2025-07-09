const SearchText = ({ content, classes = [], style = {}, appliedStyle = {} }) => {
  const combinedStyle = { ...style, ...appliedStyle };

  return (
    <div className="container">
      <div className={classes.join(" ")} style={combinedStyle}>
        {content}
      </div>
    </div>
  );
};

export default SearchText;
