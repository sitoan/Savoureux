import { useState } from "react";
import "../styles/dropdown.css";

interface DropdownProps {
  onSelect: (value: string) => void;
  defaultValue?: string;
}

const Dropdown = ({ onSelect, defaultValue = "All Recipe" }: DropdownProps) => {
  const [selected, setSelected] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const options = ["All Recipe", "High Rating", "Vegan", "Newest"];

  const handleSelect = (option: string) => {
    setSelected(option);
    setOpen(false);
    onSelect(option);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={() => setOpen(!open)}>
        {selected} <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li
              key={option}
              className="dropdown-item"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
