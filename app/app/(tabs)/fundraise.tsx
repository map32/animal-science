import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import Text from '@/Text'
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const formatPrice = (num: number) => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const { width } = Dimensions.get("window");

const About: React.FC = () => {
    const router = useRouter(); 
    const insets = useSafeAreaInsets();
    return (
    <View style={{ flex: 1, position: 'relative' }}>

        <ScrollView style={[styles.container, {paddingBottom: insets.bottom, paddingTop: insets.top}]}>
            <View style={styles.statusContainer}>
                <Image source={require('@/assets/images/status-icon.png')} style={styles.logo}>
                </Image>
                <View style={styles.statusBox}>
                    <Text style={styles.statusTitle}>Fundraising Status</Text>
                    <View style={styles.statusBar}>
                        <View style={styles.statusBarFilled} />
                    </View>
                </View>
            </View>
            <Text style={styles.price}>USD $2,123</Text>
            <Text style={styles.desc}>Help protecting and caring endangered animals on the special log</Text>
            <View style={styles.section}>
                <Text style={styles.sectionDesc}>
                    Provide proper food, care, and habitat 
for the endangered species I look after.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionDesc}>
                        Cover medical checkups and supplies 
to keep them healthy.
                </Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionDesc}>
                    Create a safe and enriched environment 
where they can grow and thrive
                </Text>
            </View>
            <View style={styles.emailContainer}>
                <AntDesign name='mail' size={32} color='white' />
                <Text style={styles.desc}>minwoodong@tcis.com</Text>
            </View>
        </ScrollView>
    </View>
)};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#14998f',
        padding: 20
    },
    statusContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginBottom: 20
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 12
    },
    statusBox: {
        flex: 1,
        height: 80,
        justifyContent: 'space-between',
        paddingLeft: 24
    },
    statusTitle: {
        fontFamily: 'PoppinsBold',
        fontSize: 20,
        color: '#fff'
    },
    statusBar: {
        borderRadius: 100,
        height: 20,
        backgroundColor: '#fff',
        overflow: 'hidden',
        width: '100%'
    },
    statusBarFilled: {
        borderRadius: 100,
        height: '100%',
        backgroundColor: '#b8d8d6',
        width: '66%'
    },
    spacer: {
        height: 32
    },
    price: {
        fontFamily: 'PoppinsBold',
        fontSize: 28,
        color: '#fff'
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
    intro: {
        fontSize: 16,
        color: "#444",
        marginBottom: 18,
        lineHeight: 22,
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
    sectionTitl: {
        fontSize: 16,
        color: "#ccc",
        marginBottom: 8,
    },
    sectionDes: {
        fontSize: 10,
        color: "#ccc",
        lineHeight: 16,
    },
    emailContainer: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginHorizontal: 40
    },
    carouselContainer: {
        marginTop: 8,
        marginBottom: 8,
    },
    carouselItem: {
        width: width - 72,
        backgroundColor: "#e6f0fa",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
    },
    carouselImage: {
        width: width - 100,
        height: 160,
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: "#cbd5e1",
    },
    speciesName: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#22577a",
        marginBottom: 6,
    },
    speciesDesc: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
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