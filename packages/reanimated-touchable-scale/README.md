# reanimated-touchable-scale

Smooth and perfomant scale up/down animation for your React Native pressable components.
Built with [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs) and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs).


https://github.com/user-attachments/assets/8478b06e-6686-4679-a57c-7b392ecda5c3

## Features

### 🚀 Performance First
- Runs animations on the UI thread using Reanimated worklets
- Zero bridge traffic during animations
- Smooth 60+ FPS animations even during heavy bridge load

### 🎯 Purposefully Built
- Specifically designed for scale animations on touch
- Optimized spring configurations for natural feeling feedback
- Works great for buttons, cards, and any pressable components really

### 💪 Production Ready
- Built on stable primitives (Reanimated + Gesture Handler)
- Handles edge cases like rapid taps and interrupted gestures
- TypeScript support
- Supports both Old and New Architecture, iOS and Android

### 🎨 Highly Customizable
- Configurable scale values and spring animations
- Supports both JS and UI thread event handlers

### 🪶 Lightweight
- Few dependencies (only Reanimated and Gesture Handler)
- Small implementation (~150 lines of code)
- No external assets or resources

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
