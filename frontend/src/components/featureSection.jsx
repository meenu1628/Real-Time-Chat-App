export default function FeatureSection({
  title,
  description,
  bgColor,
  circleBg,
  innerCircleBg,
  textColor,
  message,
}) {
  return (
    <div className="p-12 flex items-center" style={{ backgroundColor: bgColor }}>
      <div className="space-y-6 flex-1">
        <h2 className="text-3xl font-bold" style={{ color: textColor }}>
          {title}
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: textColor }}>
          {description}
        </p>
      </div>

      <div className="ml-8 relative">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: circleBg }}>
            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: innerCircleBg }}></div>
          </div>
        </div>
        <div className="absolute -top-2 -right-2 bg-white rounded-lg px-2 py-1 text-xs font-medium text-black" >
        {message}
        </div>
       
      </div>
    </div>
  );
}
