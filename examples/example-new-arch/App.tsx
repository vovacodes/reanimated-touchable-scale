import { useCallback, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, Switch, Text, View } from "react-native";
import { TouchableScale } from "reanimated-touchable-scale";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [pressesCount, setPressesCount] = useState(0);

  const handlePressIn = useMemo(() => {
    return () => {
      console.log("↓ -----", _WORKLET);
    };
  }, []);
  const handlePressOut = useMemo(() => {
    return () => {
      console.log("↑ -----", _WORKLET);
    };
  }, []);
  const handlePress = useMemo(() => {
    return () => {
      console.log("↓↑ -----", _WORKLET);
      setPressesCount(pressesCount + 1);
    };
  }, [pressesCount]);

  const handlePressInWorklet = useCallback(() => {
    "worklet";
    console.log("onPressInWorklet", _WORKLET);
  }, []);

  const handlePressOutWorklet = useCallback(() => {
    "worklet";
    console.log("onPressOutWorklet", _WORKLET);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
          <View
            style={{
              flex: 1,
              paddingHorizontal: 20,
              gap: 20,
              backgroundColor: "#fff",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/*spacer*/}
            <View />

            <View
              style={{
                gap: 20,
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text style={{ fontSize: 18 }}>New Architecture</Text>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Text>Enable Button</Text>
                <Switch
                  value={isEnabled}
                  trackColor={{ true: "rgb(48, 164, 108)" }}
                  onValueChange={(value) => {
                    setIsEnabled(value);
                  }}
                />
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Text>Presses count</Text>
                <Text>{pressesCount}</Text>
              </View>
            </View>

            <TouchableScale
              disabled={!isEnabled}
              pressedScale={0.99}
              style={{ width: "100%" }}
              onPressInWorklet={handlePressInWorklet}
              onPressIn={handlePressIn}
              onPressOutWorklet={handlePressOutWorklet}
              onPressOut={handlePressOut}
              onPressWorklet={() => {
                "worklet";
                console.log("onPressWorklet", _WORKLET);
              }}
              onPress={handlePress}
            >
              <View
                style={{
                  width: "100%",
                  height: 60,
                  borderRadius: 999,
                  borderCurve: "continuous",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgb(48, 164, 108)",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Press me
                </Text>
              </View>
            </TouchableScale>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
