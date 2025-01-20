import { useCallback, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import { TouchableScale } from "reanimated-touchable-scale";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
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
    };
  }, []);

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

            <Text>Old Architecture</Text>

            <TouchableScale
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
                  backgroundColor: "black",
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
