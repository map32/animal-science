import { FC, useEffect, useState } from "react";
import { TextInput, TouchableOpacity, Text, View, StyleSheet } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import SearchBar from "./searchbar";

interface CollapsibleSearchBarProps {
    search: (text: string) => void,
    title: string,
    textInputRef: React.Ref<TextInput>,
    placeholderText? : string,
    open: boolean,
    setOpen: (open: boolean) => void
}

const CollapsibleSearchBar: FC<CollapsibleSearchBarProps> = ({open, setOpen, search, title, textInputRef, placeholderText}) => {
    const searchBarHeight = useSharedValue(0); // Shared value for the search bar's height
    const animatedSearchBarHeight = useSharedValue(0);
    const searchContainerStyle = useAnimatedStyle(() => ({
        height: animatedSearchBarHeight.value,
        overflow: 'hidden', // Crucial to clip content when height is animating
    }));
    const toggleSearch = () => {
        if (!open) setOpen(true);
        else {
            setOpen(false);
        }
    }

    const onSearchBarLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0 && searchBarHeight.value === 0) {
        searchBarHeight.value = withTiming(height,{
                duration: 300,
            });
        }
    };

    useEffect(() => {
        if (open) {
            animatedSearchBarHeight.value = withTiming(searchBarHeight.value,{
                duration: 300,
            });
        } else animatedSearchBarHeight.value = withTiming(0,{
                duration: 300,
            });
    },[open])

    return (<>
        <TouchableOpacity style={[{ zIndex: 1 }]} onPress={toggleSearch}>
            <Text style={styles.sectionText}>
                {title}
            </Text>
        </TouchableOpacity>
        <Animated.View style={[styles.searchContainer, searchContainerStyle]}>
            <View style={{position: 'absolute', width: '100%'}} onLayout={onSearchBarLayout}>
                <SearchBar search={search} textInputRef={textInputRef} placeholderText={placeholderText} />
            </View>
            </Animated.View>
    </>)
}

const styles = StyleSheet.create({
    sectionText: {
        fontSize: 18
    },
    searchContainer: {
        overflow: 'hidden'
    }
})

export default CollapsibleSearchBar;