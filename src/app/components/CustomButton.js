import { withVibration, VIBRATION_PATTERNS } from '../utils/vibration';

export default function CustomButton({ 
  children, 
  onClick, 
  className = "", 
  vibrationPattern = VIBRATION_PATTERNS.BUTTON_TAP,
  disableVibration = false,
  ...props 
}) {
  const handleClick = disableVibration ? onClick : withVibration(onClick, vibrationPattern);

  return (
    <button
      onClick={handleClick}
      className={`
        w-full
        bg-white
        text-[#7370fd]
        px-6
        py-4
        rounded-xl
        font-semibold
        text-lg
        hover:bg-gray-50
        active:bg-gray-100
        transition-all
        duration-200
        shadow-md
        hover:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-white
        focus:ring-opacity-50
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
