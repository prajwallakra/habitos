import clsx from "clsx";
import { useRef, useState, useEffect } from "react";

export const Select = ({ options, filter, onFilterChange }) => {
    const selectRef = useRef(null)
    const [selectedOption, setSelectedOption] = useState(filter);
    const [isOpen, setIsOpen] = useState(false);
    const [focusIndex, setFocusIndex] = useState(Math.max(options.findIndex((e, i) => e.value === filter), 0));

    const handleClick = (value, index) => {
        onFilterChange(value);
        setSelectedOption(value);
        setFocusIndex(index);
        setIsOpen(false);
    };
    const handleClose = (e) => {
        if (isOpen && selectRef.current && !selectRef.current.contains(e.target)) setIsOpen(false);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return

        const key = e.key;
        if (key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
        }
        else if (key === "ArrowDown" && focusIndex < options.length - 1) {
            e.preventDefault();
            setFocusIndex(p => (p + 1));
        }
        else if (key === "ArrowUp" && focusIndex > 0) {
            e.preventDefault();
            setFocusIndex(p => ((p - 1)));
        }
        else if (key === "Enter") {
            e.preventDefault();
            handleClick(options[focusIndex].value, focusIndex);
        }

    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClose);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousedown', handleClose);
            document.removeEventListener('keydown', handleKeyDown);

        }
    })

    const SelectedFilter = options.filter(e => e.value === selectedOption);
    return (
        <div ref={selectRef} className="relative cursor-pointer">
            <div
                className="relative text-(--text-primary) bg-(--bg-main) rounded-md py-2 px-4 flex justify-between items-center w-50"
                onClick={() => setIsOpen(!isOpen)}>
                <span>{SelectedFilter[0].label}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg>
            </div>
            {isOpen &&
                <div className="flex flex-col gap-1 border border-(--accent) rounded-md absolute top-12 left-0 w-50 p-1 text-sm">
                    {options.map((option, index) => {
                        return (
                            <div key={option.value} className={clsx(" px-4 py-2 rounded-sm hover:bg-text-600/50 ", (focusIndex === index) && "bg-gray-600/50", (selectedOption === option.value) && "bg-[#8564e2]! text-white")} onClick={() => handleClick(option.value, index)}>
                                {option.label}
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
};
