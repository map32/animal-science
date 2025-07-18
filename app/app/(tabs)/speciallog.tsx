import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import Text from '@/Text'
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const logData = [
    {
        title: "Alligator",
        date: "2025-5-17",
        description: "Ther regard that sleep; to gruntry from who would beary from what pith the shuffled o'er in the quietus consienter devoutly takes us coward"
    },
    {
        title: "Flying Squirrel",
        date: "2025-5-14",
        description: "Ther regard that sleep; to gruntry from who would beary from what pith the shuffled o'er in the quietus consienter devoutly takes us coward"
    },
    {
        title: "Tiger",
        date: "2025-4-17",
        description: "Ther regard that sleep; to gruntry from who would beary from what pith the shuffled o'er in the quietus consienter devoutly takes us coward"
    }
]

const { width } = Dimensions.get("window");
const About: React.FC = () => {
    const router = useRouter(); 
    const insets = useSafeAreaInsets();
    return (
    <View style={{ flex: 1, position: 'relative' }}>

        <ScrollView style={[styles.container, {paddingTop: insets.top}]}>
            <View style={styles.logoContainer}>
                <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>Special Log</Text>
            </View>
            <View style={styles.spacer} />
            {logData.map((item, i) => <View key={item.title} style={[styles.section, i === logData.length - 1 ? null : {borderBottomWidth: 1, borderBottomColor: "#ccc"}]}>
                <View style={styles.sectionHead}>
                    <Text style={styles.sectionTitle}>{item.title}</Text>
                    <Text style={styles.sectionDate}>{item.date}</Text>
                </View>
                <Text style={styles.sectionDesc}>{item.description}</Text>
            </View>)}

            
                <Text style={styles.sectionTitl}>정보 출처조항</Text>
                <Text style={styles.sectionDes}>
                    이 어플리케이션의 모든 정보는 국립생태원과 국립생물자원관에서 제공하는 데이터를 기반으로 하며, 대한민국 정부와 무관합니다. 어플리케이션 개발자는 이 정보로 인해 발생하는 어떠한 문제에 대해서도 책임을 지지 않습니다.
                </Text>
                <View style={{ marginTop: 20 }}>
                </View>
        </ScrollView>
    </View>
)};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(246, 246, 246)',
        padding: 20
    },
    logoContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        marginBottom: 18
    },
    logo: {
        width: 80,
        height: 80
    },
    spacer: {
        height: 32
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
        paddingVertical: 24
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
        color: "#14998f",
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