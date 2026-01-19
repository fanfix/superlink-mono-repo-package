import { DocumentTypeRadio } from "../ui/DocumentTypeRadio";

const meta = {
  title: "Components/Forms/DocumentTypeRadio",
  component: DocumentTypeRadio,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    selectedDocumentType: {
      control: { type: "radio" },
      options: ["passport", "drivers-license"],
    },
    showTitle: {
      control: "boolean",
    },
    title: {
      control: "text",
    },
  },
};

export default meta;

export const Default = {
  args: {
    selectedDocumentType: "passport",
  },
};

export const PassportSelected = {
  args: {
    selectedDocumentType: "passport",
  },
};

export const DriversLicenseSelected = {
  args: {
    selectedDocumentType: "drivers-license",
  },
};

export const WithoutTitle = {
  args: {
    selectedDocumentType: "passport",
    showTitle: false,
  },
};

export const CustomTitle = {
  args: {
    selectedDocumentType: "passport",
    title: "Select Your Document",
  },
};

export const Interactive = {
  args: {
    selectedDocumentType: "passport",
    onDocumentTypeChange: (type: string) =>
      console.log("Selected document:", type),
  },
};
