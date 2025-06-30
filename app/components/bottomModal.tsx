import React, {useState, useEffect, useRef, FC, use} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Pressable, ScrollView, LayoutChangeEvent} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withTiming, interpolate, Extrapolation, runOnJS} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import DivisionGraph from './divisionGraph';
import { DivisionTable } from './divisionTable';
import { DivisionSpeciesList } from './divisonSpeciesList';

interface BottomModalProps {
    styles: any,
    isOpen: boolean,
    setIsOpen: (o:boolean) => void
    data?: any
}

const Modal: FC<BottomModalProps> = ({...props}) => {
    const position = useSharedValue<number>(1000);
    const height = useSharedValue<number>(0);
    const panRef = useRef(null)
    const setHeight = (e:LayoutChangeEvent) => {
        "worklet";
        height.value = e.nativeEvent.layout.height;
        position.value = e.nativeEvent.layout.height * 1.2;
    }
    const tabWidth = useSharedValue(0);
    const setTabWidth = (e:LayoutChangeEvent) => {
        tabWidth.value = e.nativeEvent.layout.width;
    }
    const tabIndex = useSharedValue(0); //0 for leftmost, 1, 2, 3, ...
    const tabPosition = useSharedValue(0);
    const directionLocked = useSharedValue(false);
    const isHorizontal = useSharedValue(true);
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

    const tabPositionStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: tabPosition.value }
        ]
    }))
    const moveLeft = () => {
        "worklet";
        if (tabIndex.value > 0) {
            tabIndex.value -= 1;
            tabPosition.value = withTiming(-tabIndex.value * tabWidth.value, {duration: 300});
        } else {
            tabIndex.value = 0;
            tabPosition.value = withTiming(0, {duration: 300});
        }
    }
    const moveRight = () => {
        "worklet";
        if (tabIndex.value < 1) {
            tabIndex.value += 1;
            tabPosition.value = withTiming(-tabIndex.value * tabWidth.value, {duration: 300});
        } else {
            tabIndex.value = 1;
            tabPosition.value = withTiming(-tabIndex.value * tabWidth.value, {duration: 300});
        }
    }

    const close = () => {props.setIsOpen(false)}
    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            if (!directionLocked.value) {
                if (e.translationX === 0 && e.translationY === 0) return;
                if (Math.abs(e.translationX) > Math.abs(e.translationY)) {
                    isHorizontal.value = true;
                } else {
                    isHorizontal.value = false;
                }
                directionLocked.value = true;
            }
            if (isHorizontal.value) {
                tabPosition.value = -tabIndex.value * tabWidth.value + e.translationX;
            } else {
                if (e.translationY < 0) position.value = -Math.sqrt(-e.translationY);
                else position.value = e.translationY;
            }
        })
        .onEnd((e) => {
            directionLocked.value = false;
            //console.log(e.translationX, e.translationY);
            if (isHorizontal.value) {
                if (e.translationX < 0)
                {
                    moveRight();
                } else {
                    moveLeft();
                }
            } else {
                if (position.value > height.value / 10) {
                    position.value = withTiming(height.value * 1.2, {duration: 300});
                    runOnJS(close)();
                } else {
                    position.value = withTiming(0, {duration: 300});
                }
            }
        });
    
    useEffect(() => {
        if (props.isOpen) position.value = withTiming(0, {duration: 300})
        else position.value = withTiming(height.value * 1.2, {duration: 300})
    },[props.isOpen])
    return (<>
        {props.isOpen ? <Pressable style={styles.closing} onPress={close}/> : null}
        <Animated.View style={[styles.container, props.styles.container, backerPositionStyle]} />
        <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.container, props.styles.container, positionStyle]} onLayout={setHeight}>
                    <View style={styles.tabView} onLayout={setTabWidth}>
                        <Animated.View style={[styles.tab, tabPositionStyle]}>
                            <DivisionGraph size={200} data={props.data?.distribution}/>
                            <DivisionTable data={props.data?.distribution} />
                        </Animated.View>
                        <Animated.View style={[styles.tab, tabPositionStyle]}>
                            <DivisionSpeciesList data={props.data?.speciesList} />
                        </Animated.View>
                    </View>
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
        backgroundColor: 'rgba(0,0,0,0.5)'
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