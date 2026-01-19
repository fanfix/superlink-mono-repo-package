import { CountryDropdown } from "../ui/CountryDropdown";

const meta = {
  title: "Components/Forms/CountryDropdown",
  component: CountryDropdown,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    country: {
      control: "text",
    },
    countries: {
      control: "object",
    },
  },
};

export default meta;

export const Default = {
  args: {
    country: "United States of America",
    countries: ["United States of America"],
  },
};

export const MultipleCountries = {
  args: {
    country: "United States of America",
    countries: [
      "United States of America",
      "Canada",
      "United Kingdom",
      "Germany",
      "France",
      "Japan",
      "Australia",
    ],
  },
};

export const SelectedCanada = {
  args: {
    country: "Canada",
    countries: [
      "United States of America",
      "Canada",
      "United Kingdom",
      "Germany",
      "France",
    ],
  },
};

export const Interactive = {
  args: {
    country: "United States of America",
    countries: [
      "United States of America",
      "Canada",
      "United Kingdom",
      "Germany",
      "France",
      "Japan",
      "Australia",
    ],
    onCountryChange: (country: string) =>
      console.log("Selected country:", country),
  },
};
