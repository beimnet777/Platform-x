import React, { useState, useEffect } from "react";

interface SwitcherOneProps {
  isOpen: boolean;
  onToggle: (isOpen: boolean) => void;
}

const SwitcherOne: React.FC<SwitcherOneProps> = ({ isOpen, onToggle }) => {
  const [enabled, setEnabled] = useState<boolean>(isOpen);

  useEffect(() => {
    setEnabled(isOpen); // Sync local state with the prop value
  }, [isOpen]);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggle(newEnabled);
  };

  return (
    <div>
      <label
        htmlFor="toggle1"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="toggle1"
            className="sr-only"
            checked={enabled}
            onChange={handleToggle}
          />
          <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
          <div
            className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
              enabled && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherOne;
