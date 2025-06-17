import React, { FC, useState, useRef, useEffect} from 'react';
import {TextInput, Text, View, StyleSheet, TouchableOpacity, GestureResponderEvent} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import { AntDesign } from '@expo/vector-icons';

interface SearchBarProps {
    search: (text: string) => void,
    textInputRef: React.Ref<TextInput>,
    placeholderText? : string
};

const SearchBar: FC<SearchBarProps> = ({search, textInputRef, placeholderText}) => {
    const [text, setText] = useState('');
    const width = useSharedValue<`${number}%`>('0%');
    const widthStyle = useAnimatedStyle( () => ({width: width.value}));
    const onFocus = () => {width.value = withTiming('100%', {duration: 300})}
    const onBlur = () => {width.value = withTiming('0%', {duration: 300})}
    const onPress = (e: GestureResponderEvent) => {search(text);}
    return <View style={styles.container}>
        <View style={styles.textbox}>
            <TextInput style={styles.input}
            ref={textInputRef}
            placeholder={placeholderText || "검색하기"}
            value={text}
            onChangeText={setText}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholderTextColor='gray'
            />
            <Animated.View style={[styles.border, widthStyle]} />
        </View>
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <AntDesign name="search1" size={24} color="black" />
        </TouchableOpacity> 
    </View>
}

export default SearchBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    textbox: {
        flex: 1,
        marginVertical: 4,
        paddingVertical: 4,
        backgroundColor: 'white'
    },
    border: {
        
        height: 1,
        
        backgroundColor: 'rgb(12, 166, 232)'
    },
    input: {
        width: '100%',
        height: 24,
        color: 'black'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 28
    }
})