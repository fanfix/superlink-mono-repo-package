import { styled } from "@mui/material/styles";
import { useState } from "react";

export interface DocumentTypeRadioProps {
  /**
   * Selected document type
   */
  selectedDocumentType?: "passport" | "drivers-license";
  /**
   * Callback when document type changes
   */
  onDocumentTypeChange?: (type: "passport" | "drivers-license") => void;
  /**
   * Show title
   */
  showTitle?: boolean;
  /**
   * Custom title
   */
  title?: string;
  /**
   * Custom className
   */
  className?: string;
}

const Container = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  width: "100%",
  maxWidth: "400px",
});

const DocumentTypeSection = styled("div")({
  display: "flex",
  flexDirection: "column",
  width: "100%",
});

const DocumentTypeTitle = styled("h3")({
  fontSize: "var(--document-type-title-font-size)",
  fontWeight: "var(--document-type-title-font-weight)",
  color: "var(--document-type-title-color)",
  margin: 0,
  marginBottom: "var(--document-type-title-margin-bottom)",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
});

const DocumentOption = styled("label")<{ selected: boolean }>((props) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "var(--document-type-option-background)",
  borderRadius: "var(--document-type-option-border-radius)",
  padding: "var(--document-type-option-padding)",
  width: "var(--document-type-option-width)",
  marginBottom: "var(--document-type-option-margin-bottom)",
  fontSize: "var(--document-type-option-font-size)",
  fontWeight: "var(--document-type-option-font-weight)",
  color: "var(--document-type-option-color)",
  cursor: "var(--document-type-option-cursor)",
  transition: "var(--document-type-option-transition)",
  boxSizing: "border-box",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",

  "&:hover": {
    backgroundColor: "#f3f4f6",
  },

 

  "&:last-child": {
    marginBottom: 0,
  },
}));

const RadioButton = styled("div")<{ selected: boolean }>((props) => ({
  width: "var(--radio-button-size)",
  height: "var(--radio-button-size)",
  borderRadius: "50%",
  border: props.selected
    ? "var(--radio-button-border-selected)"
    : "var(--radio-button-border)",
  background: "var(--radio-button-background)",
  cursor: "var(--radio-button-cursor)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  transition: "all 0.2s ease",

  "&::after": props.selected
    ? {
        content: '""',
        width: "var(--radio-button-dot-size)",
        height: "var(--radio-button-dot-size)",
        borderRadius: "50%",
        background: "var(--radio-button-dot-color)",
        transition: "all 0.2s ease",
      }
    : {},
}));

const HiddenInput = styled("input")({
  position: "absolute",
  opacity: 0,
  pointerEvents: "none",
});

export const DocumentTypeRadio = ({
  selectedDocumentType = "passport",
  onDocumentTypeChange,
  showTitle = true,
  title = "Document type",
  className,
}: DocumentTypeRadioProps) => {
  const [selectedDocument, setSelectedDocument] =
    useState(selectedDocumentType);

  const handleDocumentTypeChange = (type: "passport" | "drivers-license") => {
    setSelectedDocument(type);
    onDocumentTypeChange?.(type);
  };

  return (
    <Container className={className}>
      <DocumentTypeSection>
        {showTitle && <DocumentTypeTitle>{title}</DocumentTypeTitle>}

        <DocumentOption
          selected={selectedDocument === "passport"}
          onClick={() => handleDocumentTypeChange("passport")}
        >
          <span>Passport</span>
          <RadioButton selected={selectedDocument === "passport"} />
          <HiddenInput
            type="radio"
            name="documentType"
            value="passport"
            checked={selectedDocument === "passport"}
            onChange={() => handleDocumentTypeChange("passport")}
          />
        </DocumentOption>

        <DocumentOption
          selected={selectedDocument === "drivers-license"}
          onClick={() => handleDocumentTypeChange("drivers-license")}
        >
          <span>Driver's license</span>
          <RadioButton selected={selectedDocument === "drivers-license"} />
          <HiddenInput
            type="radio"
            name="documentType"
            value="drivers-license"
            checked={selectedDocument === "drivers-license"}
            onChange={() => handleDocumentTypeChange("drivers-license")}
          />
        </DocumentOption>
      </DocumentTypeSection>
    </Container>
  );
};