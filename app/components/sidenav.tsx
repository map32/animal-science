import { FC, useEffect, useRef, useState } from "react";
import { DimensionValue, StyleSheet, View, Text, TouchableOpacity, Pressable, TextInput, FlatList } from "react-native"
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { searchSpecies, searchAreas } from '@/utils/search'
import { Image } from 'expo-image'
import React, { memo } from "react";
import CollapsibleSearchBar from "./collapsibleSearchBar";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";

interface SideNavProps {
    isOpen: boolean,
    setOpen: (o: boolean) => void
}

const SideNav: FC<SideNavProps> = ({isOpen, setOpen}) => {
    const left = useSharedValue<`${number}%`>('-100%');
    const ref = useRef<TextInput>(null);
    const ref2 = useRef<TextInput>(null);
    const drawerStyle = useAnimatedStyle(() => ({transform: [{translateX: left.value}]}));
    const [speciesResult, setSpeciesResult] = useState<any[]>([]);
    const [districtsResult, setDistrictsResult] = useState<any[]>([]);
    const search = (text: string) => {setSpeciesResult(searchSpecies(text))}
    const searchDistricts = (text: string) => {setDistrictsResult(searchAreas(text))}
    const close = () => {setOpen(false); if (ref) ref.current?.blur(); if (ref2) ref2.current?.blur()}
    const onNavButtonPress = () => setOpen(!isOpen);
    useEffect(() => {
        if (isOpen) {
            left.value = withTiming('0%',{
                duration: 300,
            });
        } else {
            left.value = withTiming('-100%',{
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
            <Animated.View style={[styles.container, drawerStyle]}>
                <View style={styles.title}>
                    <Text style={styles.titleText}>
                        한국의 멸종위기종 리스트
                    </Text>
                </View>
                <View style={styles.sectionList}>
                    <View style={styles.pad} />
                    <View style={styles.section}>
                        <CollapsibleSearchBar title="멸종위기종 정보" search={search} textInputRef={ref} />
                    </View>
                    <SpeciesList data={speciesResult} />
                    <View style={styles.section}>
                        <CollapsibleSearchBar title="멸종위기종 분포" search={searchDistricts} textInputRef={ref2} placeholderText="시군구 검색" />
                    </View>
                    <DistrictList data={districtsResult} />
                    <View style={styles.section}>
                        <Text style={styles.sectionText}>
                            About
                        </Text>
                    </View>
                </View>
            </Animated.View>
        </>
    )
}

interface SpeciesListProps {
    data: any[]
}

const SpeciesList: FC<SpeciesListProps> = memo(({data}) => {
    const router = useRouter();
    return (
        <FlatList 
            data={data}
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
            style={styles.searchList}
        />
    )
});

interface DistrictListProps {
    data: any[]
}

const DistrictList: FC<DistrictListProps> = memo(({data}) => {
    return (
        <FlatList 
            data={data}
            renderItem={({item}) => <TouchableOpacity style={{width: '100%'}}>
                <View style={{flex: 1, justifyContent: 'center', height: 24}}>
                    <Text>{item['Province']} {item['SIG_KOR_NM']}</Text>
                </View>
            </TouchableOpacity>}
            keyExtractor={item => item['code']}
            style={styles.searchList}
        />
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
        zIndex: 5,
        top: 0,
        width: 300,
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
        backgroundColor: 'rgb(244, 238, 213)'
    },
    searchItem: {
        borderBottomWidth: 1,
        flexDirection: 'row',
        width: '100%',
        height: 60
    },
    searchItemImage: {
        height: '100%',
        width: 60
    }
})

export default SideNav;