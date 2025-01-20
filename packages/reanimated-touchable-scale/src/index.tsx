import { ReactNode, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";
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

export function TouchableScale({
  children,
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
}: {
  children: ReactNode;
  pressedScale?: number;
  springPress?: SpringConfig;
  springRelease?: SpringConfig;
  /**
   * Currently this can be called twice due to this bug https://github.com/software-mansion/react-native-gesture-handler/pull/3343
   */
  onPressInWorklet?: () => void;
  onPressIn?: () => void;
  /**
   * Currently this can be called twice due to this bug https://github.com/software-mansion/react-native-gesture-handler/pull/3343
   */
  onPressOutWorklet?: () => void;
  onPressOut?: () => void;
  /**
   * Currently this can be called twice due to this bug https://github.com/software-mansion/react-native-gesture-handler/pull/3343
   */
  onPressWorklet?: () => void;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useSharedValue(1);

  // TODO: remove throttling when https://github.com/software-mansion/react-native-gesture-handler/pull/3343 is merged
  const handlePressIn = useMemo(() => {
    return onPressIn ? throttle(onPressIn) : undefined;
  }, [onPressIn]);
  const handlePressOut = useMemo(() => {
    return onPressOut ? throttle(onPressOut) : undefined;
  }, [onPressOut]);
  const handlePress = useMemo(() => {
    return onPress ? throttle(onPress) : undefined;
  }, [onPress]);

  const handleGestureHandlerStateChange = useGestureHandlerStateChangeHandler(
    {
      onHandlerStateChange(event) {
        "worklet";
        if (event.state === State.ACTIVE) {
          scale.value = withSpring(pressedScale, springPress);
          onPressInWorklet?.();
          if (handlePressIn) runOnJS(handlePressIn)();
        } else if (event.state === State.END) {
          scale.value = withSpring(1, springRelease);
          onPressOutWorklet?.();
          if (handlePressOut) runOnJS(handlePressOut)();
          onPressWorklet?.();
          if (handlePress) runOnJS(handlePress)();
        }
      },
    },
    [
      pressedScale,
      springPress,
      springRelease,
      onPressInWorklet,
      onPressOutWorklet,
      onPressWorklet,
    ],
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <AnimatedPureNativeButton
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

function throttle<T extends (...args: any[]) => any>(
  fn: T,
): (...args: Parameters<T>) => ReturnType<T> | void {
  let scheduled = false;
  return function (this: any, ...args: Parameters<T>): ReturnType<T> | void {
    if (scheduled) return;

    scheduled = true;
    setTimeout(() => {
      scheduled = false;
    }, 10);

    return fn.apply(this, args);
  };
}
