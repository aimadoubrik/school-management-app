import { Search } from "lucide-react";

const SearchBar = () => {
    return (
        <label className="input input-bordered flex items-center gap-2">
            <Search className="w-5 h-5 opacity-50" />
            <input
                type="text"
                placeholder="Search anything..."
                className="grow"
            />
        </label>
    );
};

export default SearchBar;
