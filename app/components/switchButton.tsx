import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

interface SwitchButtonProps {
    left: string,
    right: string,
    current: string,
    onSwitch: (text: string) => void,
}

export const SwitchButton: React.FC<SwitchButtonProps> = ({
    left,
    right,
    current,
    onSwitch,
}) => {
    const buttonWidth = 56;
    const switchWidth = buttonWidth * 2;
    const switchHeight = 32;

    const isLeft = current === left;
    const anim = useSharedValue(isLeft ? 0 : 1);

    React.useEffect(() => {
        anim.value = withTiming(isLeft ? 0 : 1, { duration: 200 });
    }, [isLeft, anim]);

    const animatedSliderStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: anim.value * buttonWidth }
        ],
    }));

    return (
        <View style={styles.container}>
            <View style={[
                styles.switchBackground,
                { width: switchWidth, height: switchHeight, borderRadius: switchHeight / 2 }
            ]}>
                <Animated.View
                    style={[
                        styles.slider,
                        {
                            width: buttonWidth,
                            height: switchHeight,
                            borderRadius: switchHeight / 2,
                        },
                        animatedSliderStyle,
                    ]}
                />
                <Pressable
                    style={styles.button}
                    onPress={() => onSwitch(left)}
                >
                    <Text style={[styles.text, isLeft && styles.activeText]}>
                        {left}
                    </Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={() => onSwitch(right)}
                >
                    <Text style={[styles.text, !isLeft && styles.activeText]}>
                        {right}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        position: 'absolute',
        bottom: 16,
        left: 16
    },
    switchBackground: {
        flexDirection: "row",
        backgroundColor: "#eee",
        position: "relative",
        overflow: "hidden",
    },
    slider: {
        position: "absolute",
        backgroundColor: "#fff",
        elevation: 2,
        zIndex: 1,
    },
    button: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2,
    },
    text: {
        color: "#888",
        fontWeight: "bold",
        fontSize: 14,
    },
    activeText: {
        color: "#222",
    },
});