import { ComponentProps, ReactNode } from "react";
import {
  PureNativeButton,
  State,
  createNativeWrapper,
} from "react-native-gesture-handler";
import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useEvent,
  useHandler,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

const AnimatedPureNativeButton = createNativeWrapper(
  Animated.createAnimatedComponent(PureNativeButton),
  {
    shouldCancelWhenOutside: false,
    shouldActivateOnStart: false,
  },
);

export const defaultSpringRelease = {
  stiffness: 300,
  damping: 22,
  mass: 1.5,
  restSpeedThreshold: 0.001,
};

export const defaultSpringPress = {
  ...defaultSpringRelease,
  // Add a little bit of push so even quick taps are noticeable.
  velocity: -0.5,
};

type AnimatedTouchableScaleProps = Omit<
  ComponentProps<typeof AnimatedPureNativeButton>,
  "onPressIn" | "onPressOut" | "onPress"
>;

export function TouchableScale({
  children,
  disabled,
  pressedScale = 0.98,
  springPress = defaultSpringPress,
  springRelease = defaultSpringRelease,
  onPressInWorklet,
  onPressIn,
  onPressOutWorklet,
  onPressOut,
  onPressWorklet,
  onPress,
  style,
  ...props
}: AnimatedTouchableScaleProps & {
  children: ReactNode;
  disabled?: boolean;
  pressedScale?: number;
  springPress?: SpringConfig;
  springRelease?: SpringConfig;
  onPressInWorklet?: () => void;
  onPressIn?: () => void;
  onPressOutWorklet?: () => void;
  onPressOut?: () => void;
  onPressWorklet?: () => void;
  onPress?: () => void;
}) {
  const scale = useSharedValue(1);

  const handleGestureHandlerStateChange = useGestureHandlerStateChangeHandler(
    {
      onHandlerStateChange(event) {
        "worklet";
        if (disabled) return;

        if (event.state === State.ACTIVE) {
          scale.value = withSpring(pressedScale, springPress);
          onPressInWorklet?.();
          if (onPressIn) runOnJS(onPressIn)();
        } else if (event.state === State.END) {
          scale.value = withSpring(1, springRelease);
          onPressOutWorklet?.();
          if (onPressOut) runOnJS(onPressOut)();
          onPressWorklet?.();
          if (onPress) runOnJS(onPress)();
        } else if (event.state === State.CANCELLED) {
          scale.value = withSpring(1, springRelease);
        }
      },
    },
    [
      disabled,
      pressedScale,
      springPress,
      springRelease,
      onPressInWorklet,
      onPressIn,
      onPressOutWorklet,
      onPressOut,
      onPressWorklet,
      onPress,
    ],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPureNativeButton
      {...props}
      onHandlerStateChange={handleGestureHandlerStateChange}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPureNativeButton>
  );
}

function useGestureHandlerStateChangeHandler(
  handlers: {
    onHandlerStateChange?: (event: any, context: any) => void;
  },
  dependencies?: Array<unknown>,
) {
  const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);

  return useEvent(
    (event) => {
      "worklet";
      const { onHandlerStateChange } = handlers;

      if (!onHandlerStateChange) return;
      if (!event.eventName.endsWith("onGestureHandlerStateChange")) return;

      onHandlerStateChange(event, context);
    },
    ["onGestureHandlerStateChange"],
    doDependenciesDiffer,
  );
}

/**
 * Spring animation configuration.
 *
 * @param mass - The weight of the spring. Reducing this value makes the
 *   animation faster. Defaults to 1.
 * @param damping - How quickly a spring slows down. Higher damping means the
 *   spring will come to rest faster. Defaults to 10.
 * @param duration - Length of the animation (in milliseconds). Defaults to
 *   2000.
 * @param dampingRatio - How damped the spring is. Value 1 means the spring is
 *   critically damped, and value `>`1 means the spring is overdamped. Defaults
 *   to 0.5.
 * @param stiffness - How bouncy the spring is. Defaults to 100.
 * @param velocity - Initial velocity applied to the spring equation. Defaults
 *   to 0.
 * @param overshootClamping - Whether a spring can bounce over the `toValue`.
 *   Defaults to false.
 * @param restDisplacementThreshold - The displacement below which the spring
 *   will snap to toValue without further oscillations. Defaults to 0.01.
 * @param restSpeedThreshold - The speed in pixels per second from which the
 *   spring will snap to toValue without further oscillations. Defaults to 2.
 * @param reduceMotion - Determines how the animation responds to the device's
 *   reduced motion accessibility setting. Default to `ReduceMotion.System` -
 *   {@link ReduceMotion}.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/#config-
 */
export type SpringConfig = {
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
  reduceMotion?: ReduceMotion;
} & (
  | {
      mass?: number;
      damping?: number;
      duration?: never;
      dampingRatio?: never;
      clamp?: never;
    }
  | {
      mass?: never;
      damping?: never;
      duration?: number;
      dampingRatio?: number;
      clamp?: { min?: number; max?: number };
    }
);
