import { useState } from "react";
import { FormSubmit, InputChange } from "../../utils/TypeScript";
import Input from "../form-elements/Input";
import Button from "../global/Button";

interface ISearch {
  handler: (search: string) => void;
}
const SearchBox = ({ handler }: ISearch) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormSubmit) => {
    e.preventDefault();
    if (value.trim().length > 0) handler(value);
  };

  const handleChange = (e: InputChange) => {
    const value = e.target.value;
    setValue(value);

    const text = value.trim();
    if (!text) handler(text);
  };

  return (
    <form className="row" onSubmit={handleSubmit}>
      <div className="col">
        <Input
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={value}
          onChange={handleChange}
        />
      </div>
      <div className="col-auto ps-0">
        <Button type="submit" color="purple" title="Search">
          <i className="fas fa-search" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBox;
