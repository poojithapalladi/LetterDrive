import { useEffect, useState } from "react";

interface ToastProps {
  isVisible: boolean;
  message: string;
}

export default function Toast({ isVisible, message }: ToastProps) {
  const [isShowing, setIsShowing] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => setIsShowing(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsShowing(false);
    }
  }, [isVisible, message]);

  if (!isShowing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-[#323232] text-white px-4 py-2 rounded-md shadow-md flex items-center">
        <span className="material-icons mr-2 text-sm">check_circle</span>
        {message}
      </div>
    </div>
  );
}