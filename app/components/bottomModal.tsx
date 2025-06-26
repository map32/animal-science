import React, {useState, useEffect, useRef, FC} from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
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
    const position = useSharedValue<number>(0);
    const height = useSharedValue<number>(0);
    const setHeight = (e:LayoutChangeEvent) => {
        height.value = e.nativeEvent.layout.height;
        position.value = height.value * 1.2;
    }
    const tabWidth = useSharedValue(0);
    const setTabWidth = (e:LayoutChangeEvent) => {
        tabWidth.value = e.nativeEvent.layout.width;
    }
    const tabIndex = useSharedValue(0); //0 for leftmost, 1, 2, 3, ...
    const tabPosition = useSharedValue(0);
    const directionLocked = useSharedValue(false);
    const isHorizontal = useSharedValue(true);
    const positionStyle = useAnimatedStyle(() => ({
        transform: [
            // Example: translateY based on position value
            { translateY: position.value }
        ]
    }))
    const tabPositionStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: tabPosition.value }
        ]
    }))
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            if (!directionLocked.value) {
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
                position.value = e.translationY;
            }
        })
        .onEnd((e) => {
            directionLocked.value = false;
            if (isHorizontal.value) {
                if (-tabPosition.value < tabWidth.value / 2)
                {
                    tabIndex.value = 0;
                    tabPosition.value = withTiming(0, {duration: 300})
                } else {
                    tabIndex.value = 1;
                    tabPosition.value = withTiming(-tabIndex.value * tabWidth.value, {duration: 300})
                }
            } else {
                if (position.value > height.value / 2) {
                    position.value = withTiming(height.value * 1.2, {duration: 300});
                } else {
                    position.value = withTiming(0, {duration: 300});
                }
            }
        });

    const close = () => {props.setIsOpen(false)}
    
    useEffect(() => {
        console.log('useeffect called:', props.isOpen); 
        if (props.isOpen) position.value = withTiming(0, {duration: 300})
        else position.value = withTiming(height.value * 1.2, {duration: 300})
    },[props.isOpen])

    return (<>
        {props.isOpen ? <Pressable style={styles.closing} onPress={close}/> : null}
            <Animated.View style={[styles.container, props.styles.container, positionStyle]} onLayout={setHeight}>
                <GestureDetector gesture={panGesture}>
                    <View style={styles.tabView} onLayout={setTabWidth}>
                        <Animated.View style={[styles.tab, tabPositionStyle]}>
                            <DivisionGraph size={200} data={props.data?.distribution}/>
                            <DivisionTable data={props.data?.distribution} />
                        </Animated.View>
                        <Animated.View style={[styles.tab, tabPositionStyle]}>
                            <DivisionSpeciesList data={props.data?.speciesList} />
                        </Animated.View>
                    </View>
                </GestureDetector>
            </Animated.View>
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
        bottom: -10000,
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