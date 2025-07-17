import { FC, useEffect, useRef, useState } from "react";
import { DimensionValue, StyleSheet, View, Text, TouchableOpacity, Pressable, TextInput, FlatList, LayoutChangeEvent, ScrollView } from "react-native"
import Animated, {runOnJS, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { searchSpecies, searchAreas } from '@/utils/search'
import { Image } from 'expo-image'
import React, { memo } from "react";
import CollapsibleSearchBar from "./collapsibleSearchBar";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import SearchBar from "./searchbar";

const ITEM_HEIGHT = 60;
const DISTRICT_HEIGHT = 24;
const SIDENAV_WIDTH = 300;

interface SideNavProps {
    isOpen: boolean,
    setOpen: (o: boolean) => void,
    openModal: (item: any) => void
}

const SideNav: FC<SideNavProps> = ({isOpen, setOpen, openModal}) => {
    const left = useSharedValue<`${number}%` | number>('-100%');
    const ref = useRef<TextInput>(null);
    const ref2 = useRef<TextInput>(null);
    const drawerStyle = useAnimatedStyle(() => ({transform: [{translateX: left.value}]}));
    const [speciesSearchOpen, setSpeciesSearchOpen] = useState(false);
    const [speciesDistributionOpen, setSpeciesDistributionOpen] = useState(false);
    const [speciesResult, setSpeciesResult] = useState<any[]>([]);
    const [districtsResult, setDistrictsResult] = useState<any[]>([]);
    const search = (text: string) => {setSpeciesResult(searchSpecies(text))}
    const searchDistricts = (text: string) => {setDistrictsResult(searchAreas(text))}
    const close = () => {setOpen(false); if (ref) ref.current?.blur(); if (ref2) ref2.current?.blur()}
    const onNavButtonPress = () => setOpen(!isOpen);
    const router = useRouter();
    const gesture = Gesture.Pan()
        .onUpdate((e) => {
            if (e.translationX > 0) return;
            left.value = e.translationX;
        }).onEnd((e) => {
            if (typeof left.value !== 'number') return;
            if (typeof left.value === 'number' && left.value > -100) {
                left.value = withTiming(0,{
                    duration: 300,
                });
            } else {
                left.value = withTiming(-SIDENAV_WIDTH,{
                    duration: 300,
                });
                runOnJS(close)()
            }
        })
    useEffect(() => {
        if (isOpen) {
            left.value = withTiming(0,{
                duration: 300,
            });
        } else {
            left.value = withTiming(-SIDENAV_WIDTH,{
                duration: 300,
            });
        }
    },[isOpen])


    return (
        <>
            <View style={styles.menuButton}>
                <Feather name="menu" size={24} color="white" onPress={onNavButtonPress}/>
            </View>
            {isOpen ? <Pressable style={styles.closing} onPress={close}/> : null}
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.container, drawerStyle]}>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>
                            한국의 멸종위기종 리스트
                        </Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.sectionList}>
                            <View style={styles.pad} />
                            <View style={styles.section}>
                                <SearchBar search={search} textInputRef={ref} placeholderText="Search Species By Name"/>
                            </View>
                            <SpeciesList open={speciesSearchOpen} data={speciesResult} />
                            <View style={styles.section}>
                                <CollapsibleSearchBar open={speciesDistributionOpen} setOpen={setSpeciesDistributionOpen} title="멸종위기종 분포" search={searchDistricts} textInputRef={ref2} placeholderText="시군구 검색" />
                            </View>
                            <DistrictList data={districtsResult} open={speciesDistributionOpen} openModal={openModal}/>
                            <View style={styles.pad} />
                            <TouchableOpacity style={styles.section} onPress={() => router.push('/about')}>
                                <Text style={styles.sectionText}>
                                    About
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </GestureDetector>
        </>
    )
}

interface SpeciesListProps {
    data: any[]
    open: boolean
}

const SpeciesList: FC<SpeciesListProps> = memo(({data, open}) => {
    const router = useRouter();
    const height = useSharedValue(0);
    const [storedHeight,setStoredHeight] = useState(0);
    const heightStyle = useAnimatedStyle(() => ({height: height.value}));

    useEffect(() => {
        if (open) height.value = withTiming(storedHeight, {duration: 300})
        else height.value = withTiming(0, {duration: 300})
    }, [open])

    useEffect(() => {
        if (open) height.value = withTiming(ITEM_HEIGHT * data.length, {duration: 300})
        setStoredHeight(ITEM_HEIGHT * data.length);
    },[data])

    return (
        <Animated.View style={[styles.searchList, heightStyle]}>
            <View style={{position: 'absolute', width: '100%'}}>
                <FlatList 
                    data={data}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.searchItem}
                            onPress={() => {
                                router.navigate(`/description?id=${item.id}`);
                            }}
                        >
                            <Image source={item['image_url']} style={styles.searchItemImage} />
                            <View style={{flex: 1, justifyContent: 'center'}}>
                                <Text>{item['korean_name']}</Text>
                                <Text style={{fontSize: 10}}>{item['english_name']}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item['english_name']}
                />
            </View>
        </Animated.View>
    )
});

interface DistrictListProps {
    data: any[],
    open: boolean,
    openModal: (item: any) => void
}

const DistrictList: FC<DistrictListProps> = memo(({data, open, openModal}) => {
    const router = useRouter();
    const height = useSharedValue(0);
    const [storedHeight,setStoredHeight] = useState(0);
    const heightStyle = useAnimatedStyle(() => ({height: height.value}));

    useEffect(() => {
        if (open) height.value = withTiming(storedHeight, {duration: 300})
        else height.value = withTiming(0, {duration: 300})
    }, [open])

    useEffect(() => {
        if (open) height.value = withTiming(DISTRICT_HEIGHT * data.length, {duration: 300})
        setStoredHeight(DISTRICT_HEIGHT * data.length);
    },[data])
    return (
        <Animated.View style={[styles.searchList, heightStyle]}>
            <View style={{position: 'absolute', width: '100%'}}>
                <FlatList 
                    data={data}
                    scrollEnabled={false}
                    renderItem={({item}) => <TouchableOpacity style={{width: '100%'}} onPress={() => openModal(item)}>
                        <View style={{flex: 1, justifyContent: 'center', height: DISTRICT_HEIGHT}}>
                            <Text>{item['Province']} {item['SIG_KOR_NM']}</Text>
                        </View>
                    </TouchableOpacity>}
                    keyExtractor={item => item['code']}
                />
            </View>
        </Animated.View>
    )
});

const styles = StyleSheet.create({
    menuButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        height: 40,
        width: 40,
        backgroundColor: 'rgb(60, 65, 69)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        position: 'absolute',
        zIndex: 3,
        top: 0,
        width: SIDENAV_WIDTH,
        height: '100%',
        backgroundColor: 'rgb(246, 246, 246)',
        flexDirection: 'column',
        padding: 16
    },
    closing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    title: {
        borderBottomColor: 'rgb(55,55,55)',
        backgroundColor: 'rgb(246, 246, 246)',
        zIndex:1,
        borderBottomWidth: 1,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleText: {
        fontSize: 24,
    },
    sectionList: {
        position: 'relative',
        backgroundColor: 'rgb(246, 246, 246)',
    },
    pad: {
        height: 8,
        backgroundColor: 'rgb(246, 246, 246)',
        zIndex: 1
    },
    section: {
        position: 'relative',
        paddingBottom: 8,
    },
    sectionText: {
        fontSize: 18
    },
    searchContainer: {
        overflow: 'hidden'
    },
    searchList: {
        backgroundColor: 'rgb(244, 238, 213)',
        overflow: 'hidden',
    },
    searchItem: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        width: '100%',
        height: ITEM_HEIGHT
    },
    searchItemImage: {
        height: '100%',
        width: ITEM_HEIGHT
    }
})

export default SideNav;