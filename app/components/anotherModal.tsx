import React, {useState, useEffect, useRef, FC, use, PropsWithChildren} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Pressable, ScrollView, LayoutChangeEvent} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolation, runOnJS} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface BottomModalProps {
    styles?: any,
    isOpen: boolean,
    setIsOpen: (o:boolean) => void
}

const Modal: FC<PropsWithChildren<BottomModalProps>> = ({...props}) => {
    const position = useSharedValue<number>(1000);
    const height = useSharedValue<number>(0);
    const {children} = props;
    const setHeight = (e:LayoutChangeEvent) => {
        "worklet";
        height.value = e.nativeEvent.layout.height;
        position.value = e.nativeEvent.layout.height * 1.2;
    }
    const positionStyle = useAnimatedStyle(() => {return {
        transform: [
            // Example: translateY based on position value
            { translateY: position.value }
        ]
    }})
    const backerPositionStyle = useAnimatedStyle(() => ( position.value > 0 ? {
        transform: [
            { translateY: position.value }
        ]
    } : {}))

    const close = () => {props.setIsOpen(false)}
    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationY < 0) position.value = -Math.sqrt(-e.translationY);
            else position.value = e.translationY;
        })
        .onEnd((e) => {
            if (position.value > height.value / 10) {
                position.value = withTiming(height.value * 1.2, {duration: 300});
                runOnJS(close)();
            } else {
                position.value = withTiming(0, {duration: 300});
            }
        });
    
    useEffect(() => {
        if (props.isOpen) position.value = withTiming(0, {duration: 300})
        else position.value = withTiming(height.value * 1.2, {duration: 300})
    },[props.isOpen])
    return (<>
        <Animated.View style={[styles.container, props.styles?.container, backerPositionStyle]} />
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.container, props.styles?.container, positionStyle]} onLayout={setHeight}>
                {children}
            </Animated.View>
         </GestureDetector>
        </>
    )
}


const styles = StyleSheet.create({
    closing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: 'transparent'
    },
    container: {
        position: 'absolute',
        width: '100%',
        zIndex: 5,
        bottom: 0,
        backgroundColor: 'rgb(240,240,240)',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        padding: 12,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerLogo: {
        width: 80,
        height: 80
    },
    headerTitle: {
        fontSize: 24,
        color: '#14998f'
    },
    headerDesc: {
        fontSize: 10
    },
    tabView: {
        height: '100%',
        width: '100%',
        position: 'relative',
        flexDirection: 'row'
    },
    tab: {
        height: '100%',
        width: '100%',
    },
    closeIcon: {
        position: 'absolute',
        top: 16,
        right: 16
    }
})

export default Modal;