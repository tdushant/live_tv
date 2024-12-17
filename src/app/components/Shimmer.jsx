// components/Shimmer.js
const Shimmer = ({ className, style }) => {
    return (
      <div
        className={`shimmer ${className}`}
        style={{
          ...style,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          width: "100%",
          height: "100%",
        }}
      ></div>
    );
  };
  
  export default Shimmer;
  