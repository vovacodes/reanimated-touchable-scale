# reanimated-touchable-scale

Smooth and perfomant scale up/down animation for your React Native pressable components.
Built with [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs) and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs).

## Installation

```sh
yarn add reanimated-touchable-scale react-native-reanimated react-native-gesture-handler
```

Make sure to follow the setup instructions for:

- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation)

## Usage

```tsx
import { TouchableScale } from "reanimated-touchable-scale";

export default function MyButton() {
  return (
    <TouchableScale
      pressedScale={0.98}
      onPress={() => console.log('Pressed!')}
    >
      <View style={styles.button}>
        <Text style={styles.text}>Press me</Text>
      </View>
    </TouchableScale>
  );
}
```

## Props

| Prop            | Type     | Default | Description                               |
| --------------- | -------- | ------- |-------------------------------------------|
| children        | ReactNode | Required | Content to render inside the touchable component |
| pressedScale    | number   | 0.98    | Scale when pressed                        |
| style           | ViewStyle | -       | Additional styles                         |
| springPress     | SpringConfig | See below* | Configuration for the press animation     |
| springRelease   | SpringConfig | See below* | Configuration for the release animation   |
| onPress         | () => void | -       | Called when press is complete (JS thread) |
| onPressWorklet  | () => void | -       | Called when press is complete (UI thread) |
| onPressIn       | () => void | -       | Called when press starts (JS thread)      |
| onPressInWorklet | () => void | -       | Called when press starts (UI thread)      |
| onPressOut      | () => void | -       | Called when press ends (JS thread)        |
| onPressOutWorklet | () => void | -       | Called when press ends (UI thread)        

*Default spring configuration:
```ts
{
  stiffness: 300,
  damping: 22,
  mass: 1.5,
  restSpeedThreshold: 0.001
  // Press spring adds: velocity: -0.5
}
```
