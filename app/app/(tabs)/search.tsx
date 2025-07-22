import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView } from "react-native";
import Text from '@/Text'
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { searchAreas, searchEnglishSpeciesDetail, searchSpecies, searchSpeciesDetail } from "@/utils/search";
import CollapsibleSearchBar from "@/components/collapsibleSearchBar";
import Modal from "@/components/anotherModal";
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
    const search = (text: string) => {setSpeciesResult(searchSpecies(text, true))}
    const searchDistricts = (text: string) => {setDistrictsResult(searchAreas(text))}
    const [item, setItem] = useState<any>()
    const height = useSharedValue(0);
    const [isOpen, setIsOpen] = useState(false)
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

    useEffect(() => {
        if (item) setIsOpen(true);
    },[item])
    const close = () => {if (ref) ref.current?.blur(); if (ref2) ref2.current?.blur()}
    return (
        <>
        <Modal isOpen={isOpen} setIsOpen={setIsOpen} styles={{container:{height:'100%'}}}>
            <View style={{flex: 1}} />
            <Image source={item?.extra_sections.at(-1).img_url} style={{marginBottom: 8, width: '100%', height: 300}} contentFit="contain" />
             <View style={modal.headerContainer}>
                <View style={{justifyContent:'space-between', flex: 1}}>
                    <Text style={modal.headerTitle}>{item?.name}</Text>
                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text style={[modal.headerDesc, {marginBottom:16}]}>{item?.korean_name + '\n' + item?.english_name}</Text>
                        <TouchableOpacity onPress={() => router.navigate(`/description?id=${item?.id}`)} style={{paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, backgroundColor:'#14998f', alignSelf:'center'}}>
                            <Text style={{fontSize: 9.5, color:'#fff'}}>Full Details</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Image source={item?.image_url} style={modal.headerLogo} />
             </View>
             <View style={modal.tbl}>
                <View style={modal.row}>
                    <View style={modal.cell1}>
                        <Text style={{fontSize:9.5, textAlign:'center', color:'#14998f'}}>Level of Endangerment</Text>
                    </View>
                    <View style={modal.cell5}>
                        <Text style={{flexWrap: 'wrap', fontSize:9.5, color:'#14998f'}}>{item?.conservation_actions[5].action_type}</Text>
                    </View>
                </View>
                <View style={modal.row}>
                    <View style={modal.cell1}>
                        <Text style={{fontSize:9.5, textAlign:'center', color:'#14998f'}}>Threats</Text>
                    </View>
                    <View style={modal.cell5}>
                        <Text style={{flexWrap: 'wrap', fontSize:9.5, color:'#14998f'}} numberOfLines={4}>{item?.extra_sections.at(-3).content}</Text>
                    </View>
                </View>
                <View style={[modal.row, {height: 160}]}>
                    <View style={modal.cell1}>
                        <Text style={{fontSize:9.5, textAlign:'center', color:'#14998f'}}>Description</Text>
                    </View>
                    <View style={modal.cell5}>
                        <Text style={{flexWrap: 'wrap', fontSize:9.5, color:'#14998f'}} numberOfLines={12}>{item?.extra_sections.at(-5).content}</Text>
                    </View>
                </View>
             </View>
        </Modal>
    <KeyboardAvoidingView behavior='padding' style={{ flex: 1, position: 'relative' }}>
        <ScrollView style={[styles.container, {paddingBottom: insets.bottom, paddingTop: insets.top}]}>
            <View style={styles.logoContainer}>
                <Image source={require('@/assets/images/logo.png')} style={[styles.logo, {backgroundColor:'white'}]} />
                <Text style={styles.title}>Animal Search</Text>
            </View>
            <View style={styles.statusContainer}>
                <Animated.View style={styles.section} onLayout={(e) => {if (defaultHeight === 0) setDefaultHeight(e.nativeEvent.layout.height)}}>
                    <SearchBar search={search} textInputRef={ref}  placeholderText='Search By Name'/>
                    <SpeciesList open={speciesSearchOpen} data={speciesResult} setData={setItem} />
                </Animated.View>
                {/*<View style={styles.section}>
                    <SearchBar search={searchDistricts} textInputRef={ref2} placeholderText="Search Area" />
                    <DistrictList data={districtsResult} open={speciesDistributionOpen} openModal={() => {}}/>
                </View>*/}
            </View>
            <View style={styles.statusContainer}>
                
            </View>
        </ScrollView>

    </KeyboardAvoidingView>
    </>
)};

const ITEM_HEIGHT = 60;
const DISTRICT_HEIGHT = 40;

interface SpeciesListProps {
    data: any[]
    open: boolean
    setData: (item: any) => void
}

const SpeciesList: FC<SpeciesListProps> = memo(({data, open, setData}) => {
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
                            style={{flexDirection:'row', marginBottom: 8, backgroundColor:'#fafafa'}}
                            onPress={() => {const data = searchEnglishSpeciesDetail(item.id);  setData(data)}}
                        >
                            <Image source={item['image_url']} style={{width:ITEM_HEIGHT * 1.33, height: ITEM_HEIGHT, borderRadius: 4}} />
                            <View style={{flex: 1, justifyContent: 'center', paddingLeft: 8}}>
                                <Text style={{color: '#14998f'}}>{item['name']}({item['korean_name']})</Text>
                                <Text style={{fontSize: 10, color: '#14998f'}}>{item['english_name']}</Text>
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
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    headerLogo: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginLeft: 8,
        marginBottom: 8
    },
    headerTitle: {
        fontSize: 24,
        color: '#14998f'
    },
    headerDesc: {
        fontSize: 10
    },
    tbl: {
        gap: 8
    },
    row: {
        height: 60,
        flexDirection: 'row',
        width: '100%',
        gap: 8
    },
    cell1: {
        width: '20%',
        backgroundColor: '#ece8c2',
        borderRadius:2,
        justifyContent: 'center',
        alignContent: 'center',
        padding: 4
    },
    cell5: {
        width: '80%',
        backgroundColor: '#ece8c2',
        borderRadius:2,
        padding: 4,
        justifyContent: 'center',
        alignContent: 'center',
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
    logoContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginBottom: 18
    },
    title: {
        flex:1,
        fontSize: 28,
        color: "white",
        textAlign: "center"
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