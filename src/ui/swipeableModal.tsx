import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";

interface SwipeableModalProps {
  visible: boolean;
  onClose: () => void;
  url: string;
  height?: number;
}

const SwipeableModal: React.FC<SwipeableModalProps> = ({
  visible,
  onClose,
  url,
  height,
}) => {
  const panY = React.useRef(new Animated.Value(0)).current;
  const screenHeight = Dimensions.get("window").height;

  const modalHeight = height ?? screenHeight * 0.9; // Use provided height or default to 90% of screen

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 500,
    useNativeDriver: true,
  });

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > modalHeight * 0.3) {
          closeAnim.start(onClose);
        } else {
          resetPositionAnim.start();
        }
      },
    })
  ).current;

  const translateY = panY.interpolate({
    inputRange: [0, screenHeight],
    outputRange: [0, screenHeight],
    extrapolate: "clamp",
  });

  React.useEffect(() => {
    if (visible) {
      panY.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              height: modalHeight,
              transform: [{ translateY }],
              marginTop: screenHeight - modalHeight,
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.dragHandle}>
            <View style={styles.dragIndicator} />
          </View>

          <WebView
            source={{ uri: url }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  dragHandle: {
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  dragIndicator: {
    width: 40,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#D1D1D1",
  },
  webview: {
    flex: 1,
  },
});

export default SwipeableModal;
