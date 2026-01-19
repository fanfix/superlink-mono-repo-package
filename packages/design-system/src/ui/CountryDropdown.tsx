import { FC, useState } from "react";
import { Box, Select, MenuItem, FormControl } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";

export interface CountryDropdownProps {
  /**
   * Selected country
   */
  country?: string;
  /**
   * Available countries
   */
  countries?: string[];
  /**
   * Callback when country changes
   */
  onCountryChange?: (country: string) => void;
  /**
   * Custom className
   */
  className?: string;
  /**
   * System props for styling
   */
  sx?: SxProps<Theme>;
}

export const CountryDropdown: FC<CountryDropdownProps> = ({
  country = "United States of America",
  countries = ["United States of America"],
  onCountryChange,
  className,
  sx,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(country);

  const handleCountryChange = (event: any) => {
    const newCountry = event.target.value;
    setSelectedCountry(newCountry);
    onCountryChange?.(newCountry);
  };

  return (
    <Box className={className} sx={sx}>
      <FormControl
        sx={{
          width: "var(--country-dropdown-width)",
          "& .MuiOutlinedInput-root": {
            height: "var(--country-dropdown-height)",
            backgroundColor: "var(--country-dropdown-background)",
            borderRadius: "var(--country-dropdown-border-radius)",
            fontSize: "var(--country-dropdown-font-size)",
            fontWeight: "var(--country-dropdown-font-weight)",
            color: "var(--country-dropdown-color)",
            cursor: "var(--country-dropdown-cursor)",
            "& fieldset": {
              border: "var(--country-dropdown-border)",
            },
            "&:hover fieldset": {
              border: "var(--country-dropdown-border-hover)",
            },
            "&.Mui-focused fieldset": {
              border: "var(--country-dropdown-border-focus)",
              outline: "var(--country-dropdown-focus-outline)",
            },
          },
        }}
      >
        <Select
          value={selectedCountry}
          onChange={handleCountryChange}
          displayEmpty
          sx={{
            "& .MuiSelect-select": {
              padding: "var(--country-dropdown-padding)",
            },
            "& .MuiSelect-icon": {
              color: "var(--country-dropdown-arrow-color)",
            },
          }}
        >
          {countries.map((countryOption) => (
            <MenuItem key={countryOption} value={countryOption}>
              {countryOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
