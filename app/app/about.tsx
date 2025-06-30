import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import { Image } from 'expo-image';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
const speciesData = [
    {
        name: "수달",
        image: require('@/assets/images/otter.jpg'),
        description: "수달은 깨끗한 하천과 호수에 서식하며, 1급 멸종위기종입니다. 수질 오염과 서식지 파괴로 개체수가 감소하고 있습니다.",
    },
    {
        name: "삵",
        image: require('@/assets/images/leopard-cat.jpg'),
        description: "삵은 산림과 습지 등 다양한 환경에 서식하는 2급 멸종위기종입니다. 서식지 파괴와 도로 교통사고 등으로 위협받고 있습니다.",
    },
    {
        name: "산양",
        image: require('@/assets/images/goral.jpg'),
        description: "산양은 험준한 산악지대에 서식하는 1급 멸종위기종입니다. 밀렵과 서식지 감소로 위협받고 있습니다.",
    },
];

const { width } = Dimensions.get("window");

const Carousel = () => {
    return (
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.carouselContainer}
        >
            {speciesData.map((item, idx) => (
                <View style={styles.carouselItem} key={idx}>
                    <Image source={item.image} style={styles.carouselImage} />
                    <Text style={styles.speciesName}>{item.name}</Text>
                    <Text style={styles.speciesDesc}>{item.description}</Text>
                </View>
            ))}
        </ScrollView>
    );
};

const About: React.FC = () => {
    const router = useRouter(); 
    const insets = useSafeAreaInsets();
    return (
    <View style={{ flex: 1, position: 'relative', paddingTop: insets.top, paddingBottom: insets.bottom }}>

        <ScrollView style={styles.container}>
            <Text style={styles.title}>앱 소개</Text>
            <Text style={styles.intro}>
                <Text style={{ fontWeight: "bold" }}>한반도 멸종위기뷰</Text>은 한반도에 서식하는 멸종위기 동식물에 대한 정보를 제공합니다. 사용자는 멸종위기종의 분포, 특징, 보호 현황 등을 쉽게 확인할 수 있습니다.
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>주요 기능</Text>
                <Text style={styles.bullet}>• 멸종위기종 목록 및 상세 정보 제공</Text>
                <Text style={styles.bullet}>• 검색 및 필터 기능 지원</Text>
                <Text style={styles.bullet}>• 최신 보호 정책 및 뉴스 안내</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>멸종위기종 소개</Text>
                <Carousel />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>1급 멸종위기종</Text>
                <Text style={styles.sectionDesc}>
                    자연적 또는 인위적 위협요인으로 인하여 개체 수가 크게 줄어들어 멸종위기에 처한 야생생물로서 관계 중앙행정기관의 장과 협의하여 환경부령으로 정하는 종이며 현재 <Text style={{ fontWeight: "bold" }}>68종</Text>이 지정되었다.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>2급 멸종위기종</Text>
                <Text style={styles.sectionDesc}>
                    자연적 또는 인위적 위협 요인으로 개체 수가 크게 줄어들고 있어 현재의 위협요인이 제거되거나 완화되지 아니할 경우 가까운 장래에 멸종위기에 처할 우려가 있는 야생생물로서 관계 중앙행정기관의 장과 협의하여 환경부령으로 정하는 종이며, 현재 <Text style={{ fontWeight: "bold" }}>214종</Text>이 지정되었다.
                </Text>
            </View>
        </ScrollView>
        <TouchableOpacity style={[styles.backButton, {marginTop: insets.top + 8}]} onPress={() => {router.back();}}>
            <AntDesign name="back" size={24} color="white" />
        </TouchableOpacity>
    </View>
)};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(246, 246, 246)',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginVertical: 16,
        color: "#2d3748",
        textAlign: "center",
    },
    intro: {
        fontSize: 16,
        color: "#444",
        marginBottom: 18,
        lineHeight: 22,
    },
    section: {
        marginBottom: 28,
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#3182ce",
        marginBottom: 8,
    },
    bullet: {
        fontSize: 15,
        color: "#333",
        marginLeft: 8,
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: 15,
        color: "#444",
        lineHeight: 21,
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