import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchSection = () => {
  const _navigate = useNavigate();
  const [_searchQuery, _setSearchQuery] = useState("");
  const [_selectedLocation, _setSelectedLocation] = useState<any>(null);
  const [_propertyType, _setPropertyType] = useState("");
  const [_priceRange, _setPriceRange] = useState("");
  const [_location, _setLocation] = useState("");
  return <div>{/* Search implementation */}</div>;
};
export default SearchSection;
