export type PropertyValueControlProps = {
  liveEdit: boolean;
  propertyValue: string;
  propertyValueChanged: (newPropertyValue: string) => void;
};
