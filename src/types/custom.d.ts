declare module '@/assets/images/wheek/wheek.png' {
  import { ImageSourcePropType } from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '@/components/StepsAuth/RenderRegisterSteps' {
  import { ReactNode } from 'react';
  export function renderRegisterStep(props: any): ReactNode;
}

declare module '@/components/StepsAuth/styles' {
  import { StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
  export const stylesSteps: {
    logo: StyleProp<ImageStyle>;
    // Add other style properties as needed
  };
}

// Add other module declarations as needed
