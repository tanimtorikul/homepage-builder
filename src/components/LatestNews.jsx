import Marquee from "react-fast-marquee";

const LatestNews = ({ text, appliedStyle, classes = [], direction = "ltr", language = "en" }) => {
  return (
    <section
      className={`container rounded-lg flex items-center overflow-hidden py-12 ${classes.join(" ")}`}
      lang={language}
      dir={direction}
    >
      {/* Label - fixed styling, not affected by appliedStyle */}
      <span className="text-lg font-semibold rounded-lg rounded-tr-none rounded-br-none text-white bg-[#0B1B35] px-3 py-2.5 whitespace-nowrap">
        Latest News
      </span>

      {/* Scrolling Text - affected by appliedStyle */}
      {text ? (
        <div style={appliedStyle} className="flex-1">
          <Marquee
            gradient={false}
            speed={100}
            direction={direction === "rtl" ? "left" : "right"}
          >
            {text}
          </Marquee>
        </div>
      ) : (
        <span className="text-sm text-gray-500 px-3">No news available</span>
      )}
    </section>
  );
};

export default LatestNews;