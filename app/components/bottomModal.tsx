import React, {useState, useEffect, useRef, FC} from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import {StyleSheet, View, Text, TouchableOpacity, Pressable, ScrollView} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import DivisionGraph from './divisionGraph';
import { DivisionTable } from './divisionTable';

interface BottomModalProps {
    styles: any,
    isOpen: boolean,
    setIsOpen: (o:boolean) => void
    data?: any
}

const Modal: FC<BottomModalProps> = ({...props}) => {
    const position = useSharedValue<`${number}%`>('110%');
    const positionStyle = useAnimatedStyle(() => ({
        transform: [
            // Example: translateY based on position value
            { translateY: position.value }
        ]
    }))

    const close = () => {props.setIsOpen(false)}
    
    useEffect(() => {
        if (props.isOpen) position.value = withTiming('0%', {duration: 300})
        else position.value = withTiming('110%', {duration: 300})
    },[props.isOpen])
    
    return (<>
        {props.isOpen ? <Pressable style={styles.closing} onPress={close}/> : null}
        <Animated.View style={[styles.container, props.styles.container, positionStyle]}>
            <TouchableOpacity style={styles.closeIcon} onPress={close}>
                <AntDesign name="closecircleo" size={32} color="black"/>
            </TouchableOpacity>
            <DivisionGraph size={200} data={props.data}/>
            <DivisionTable data={props.data} />
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
        bottom: 0,
        backgroundColor: 'rgb(240,240,240)',
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        padding: 12
    },
    closeIcon: {
        position: 'absolute',
        top: 16,
        right: 16
    }
})

export default Modal;