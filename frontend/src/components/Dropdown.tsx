import { useState } from "react";
import "../styles/dropdown.css";

interface DropdownProps {
  onSelect: (value: sort) => void;
  defaultValue?: sort
}

interface sort {
  sortType: string;
  dimension: string | null;
}

const Dropdown = ({ onSelect, defaultValue = {sortType:"All Recipe",dimension:null} }: DropdownProps) => {
  const [selected, setSelected] = useState<sort>(defaultValue);
  const [open, setOpen] = useState(false);

  const options = [{sortType:"All Recipe",dimension:null}, {sortType:"A - Z",dimension:"accending"}, {sortType:"Z - A",dimension:"decending"}, {sortType:"Rating Low to High",dimension:"ascending"}, {sortType:"Rating High to Low",dimension:"decending"}];

  const handleSelect = (option: sort) => {
    setSelected(option);
    setOpen(false);
    onSelect(option);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={() => setOpen(!open)}>
        {selected.sortType} <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <ul className="dropdown-list">
          {options.map((option) => (
            <li
              key={option.sortType}
              className="dropdown-item"
              onClick={() => handleSelect(option)}
            >
              {option.sortType}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
