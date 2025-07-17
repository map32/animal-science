import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from "react-native";
import Text from '@/Text'
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { searchAreas, searchSpecies } from "@/utils/search";
import CollapsibleSearchBar from "@/components/collapsibleSearchBar";
import SearchBar from "@/components/searchbar";

const formatPrice = (num: number) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const { width } = Dimensions.get("window");

const About: React.FC = () => {
    const router = useRouter(); 
    const insets = useSafeAreaInsets();
    const ref = useRef<TextInput>(null);
    const ref2 = useRef<TextInput>(null);
    const ref3 = useRef<Animated.View>(null);
    const [speciesSearchOpen, setSpeciesSearchOpen] = useState(true);
    const [speciesDistributionOpen, setSpeciesDistributionOpen] = useState(true);
    const [speciesResult, setSpeciesResult] = useState<any[]>([]);
    const [districtsResult, setDistrictsResult] = useState<any[]>([]);
    const search = (text: string) => {setSpeciesResult(searchSpecies(text))}
    const searchDistricts = (text: string) => {setDistrictsResult(searchAreas(text))}
    const height = useSharedValue(0);
    const [storedHeight, setStoredHeight] = useState(0);
    const [defaultHeight, setDefaultHeight] = useState(0);
    useEffect(() => {
        if (speciesSearchOpen) height.value = withTiming(storedHeight, {duration: 300})
        else height.value = withTiming(0, {duration: 300})
    }, [speciesSearchOpen])

    useEffect(() => {
        if (speciesSearchOpen) height.value = withTiming(ITEM_HEIGHT * speciesResult.length + defaultHeight, {duration: 300})
        setStoredHeight(ITEM_HEIGHT * speciesResult.length + defaultHeight);
    },[speciesResult])
    const close = () => {if (ref) ref.current?.blur(); if (ref2) ref2.current?.blur()}
    return (
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, position: 'relative' }}>

        <ScrollView style={[styles.container, {paddingBottom: insets.bottom, paddingTop: insets.top}]}>
            <View style={styles.statusContainer}>
                <Animated.View style={styles.section} onLayout={(e) => {if (defaultHeight === 0) setDefaultHeight(e.nativeEvent.layout.height)}}>
                    <SearchBar search={search} textInputRef={ref}  placeholderText='Search By Name'/>
                    <SpeciesList open={speciesSearchOpen} data={speciesResult} />
                </Animated.View>
                {/*<View style={styles.section}>
                    <SearchBar search={searchDistricts} textInputRef={ref2} placeholderText="Search Area" />
                    <DistrictList data={districtsResult} open={speciesDistributionOpen} openModal={() => {}}/>
                </View>*/}
            </View>
            <View style={styles.statusContainer}>
                
            </View>
        </ScrollView>
        <TouchableOpacity style={[styles.backButton, {marginTop: insets.top + 8}]} onPress={() => {router.back();}}>
            <AntDesign name="back" size={24} color="white" />
        </TouchableOpacity>
    </KeyboardAvoidingView>
)};

const ITEM_HEIGHT = 60;
const DISTRICT_HEIGHT = 40;

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
        if (open) height.value = withTiming(ITEM_HEIGHT * data.length + 8 * (data.length-1), {duration: 300})
        setStoredHeight(ITEM_HEIGHT * data.length + 8 * (data.length-1));
    },[data])

    return (
        <Animated.View style={[heightStyle, {overflow: 'hidden'}]}>
            <View style={[{position: 'absolute', width: '100%'}, styles.searchList]}>
                <FlatList 
                    data={data}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={{flexDirection:'row', marginBottom: 8}}
                            onPress={() => {
                                router.navigate(`/description?id=${item.id}`);
                            }}
                        >
                            <Image source={item['image_url']} style={{width:ITEM_HEIGHT * 1.33, height: ITEM_HEIGHT}} />
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
        <Animated.View style={[ heightStyle]}>
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


const modal = StyleSheet.create({
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



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14998f',
        padding: 20,
        width: '100%'
    },
    statusContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 12
    },
    desc: {
        color: '#fff',
        marginVertical: 20,
        fontSize: 18
    },
    title: {
        flex:1,
        fontSize: 28,
        fontWeight: "bold",
        color: "#14998f",
        textAlign: "center"
    },
    section: {
        borderRadius: 20,
        backgroundColor: '#fff',
        padding: 40,
        marginVertical: 10,
        width: '100%'
    },
    sectionHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24
    },
    sectionTitle: {
        fontSize: 28,
        fontFamily: 'PoppinsBold',
        color: "#14998f"
    },
    sectionDate: {
        fontSize: 12,
        color: '#14998f'
    },
    bullet: {
        fontSize: 15,
        color: "#fff",
        marginLeft: 8,
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: 15,
        color: "#000",
        lineHeight: 21,
    },
    searchList: {
        backgroundColor: 'white'
    },
    footer: {
        fontSize: 15,
        color: "#555",
        textAlign: "center",
        marginVertical: 18,
    },
    backButton: { position: 'absolute', top: 8,
        zIndex: 1,
        right: 8,
    height: 40,
    width: 40,
    backgroundColor: 'rgb(60, 65, 69)', justifyContent: 'center', alignItems: 'center'}
});
export default About;