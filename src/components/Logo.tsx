import panImage from "@/assets/pan.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  textColor?: string;
}

const Logo = ({ size = "md", className = "", textColor = "#391F06" }: LogoProps) => {
  const sizeClasses = {
    sm: {
      container: "gap-0",
      image: "w-12 h-12",
      text: "text-md",
      textMargin: "-mb-3",
      imageContainer: "w-14 h-10 overflow-hidden flex items-start justify-center"
    },
    md: {
      container: "gap-0",
      image: "w-16 h-16",
      text: "text-xl",
      textMargin: "-mb-4",
      imageContainer: "w-18 h-12 overflow-hidden flex items-start justify-center"
    },
    lg: {
      container: "gap-0",
      image: "w-18 h-18", 
      text: "text-2xl",
      textMargin: "-mb-6",
      imageContainer: "w-20 h-14 overflow-hidden flex items-start justify-center"
    },
    xl: {
      container: "gap-0",
      image: "w-20 h-20",
      text: "text-3xl",
      textMargin: "-mb-5",
      imageContainer: "w-24 h-16 overflow-hidden flex items-start justify-center"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center ${currentSize.container} ${className}`}>
      <span 
        className={`font-bold ${currentSize.text} ${currentSize.textMargin} z-10 relative`}
        style={{ 
          fontFamily: '"Playfair Display", Georgia, serif',
          color: textColor
        }}
      >
        PanPal
      </span>
      <div className={currentSize.imageContainer}>
        <img 
          src={panImage} 
          alt="Pan icon" 
          className={`${currentSize.image} transform rotate-45 object-contain`}
        />
      </div>
    </div>
  );
};

export default Logo;
