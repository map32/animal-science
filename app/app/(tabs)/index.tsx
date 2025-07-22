import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";
import Text from '@/Text'
import { Image } from 'expo-image';
import { useSafeAreaInsets } from "react-native-safe-area-context";
const speciesData = [
    {
        name: "Otter",
        image: require('@/assets/images/otter.jpg'),
        description: "Otters live in unpolluted streams and lakes, and is a class 1 endangered species. The decline in water quality and destruction of living environment are reducing the species count.",
    },
    {
        name: "Leopard Cat",
        image: require('@/assets/images/leopard-cat.jpg'),
        description: "Leopard cats are a class 2 endangered species which live in forests and marshes. The destruction of their environment and roadkill threats are the main dangers.",
    },
    {
        name: "Goral",
        image: require('@/assets/images/goral.jpg'),
        description: "Gorals are a class 1 endangered species living in harsh, steep mountain ranges. Illegal poaching and reduction of their environment are threatening their survival.",
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
    <View style={{ flex: 1, position: 'relative'}}>

        <ScrollView style={[styles.container, {paddingTop: insets.top}]}>
            <View style={styles.logoContainer}>
                <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
                <Text style={styles.title}>WILDWHISPERS</Text>
            </View>
            <Text style={styles.intro}>
                <Text style={{ fontWeight: "bold" }}>Wild Whispers</Text> provides the information on 282 endangered species in Korean Peninsula, along with its distribution.
            </Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Features</Text>
                <Text style={styles.bullet}>• List of endangered species and their details</Text>
                <Text style={styles.bullet}>• Search and filtering</Text>
                <Text style={styles.bullet}>• Special logs and fundraisers</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Introduction</Text>
                <Carousel />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>What are endangered species?</Text>
                {/*자연적 또는 인위적 위협요인으로 인하여 개체 수가 크게 줄어들어 멸종위기에 처한 야생생물로서 관계 중앙행정기관의 장과 협의하여 환경부령으로 정하는 종이며 현재*/
                }
                <Text style={styles.sectionDesc}>
                    Endangered species are animals and plants that are at risk of disappearing forever. Their populations have dropped to dangerously low numbers, often because of habitat loss, pollution, hunting, or climate change.
In Korea and around the world, many unique and beautiful creatures are struggling to survive. From the Amur leopard to the crested ibis, these species need our attention and care.
By learning about them and sharing what we observe, we can all help protect Earth’s biodiversity — one species at a time.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Class 1 endangered species</Text>
                {/*자연적 또는 인위적 위협요인으로 인하여 개체 수가 크게 줄어들어 멸종위기에 처한 야생생물로서 관계 중앙행정기관의 장과 협의하여 환경부령으로 정하는 종이며 현재*/
                }
                <Text style={styles.sectionDesc}>
                    Species in danger of extinction due to natural or man-made causes reducing its numbers. Decided by the Ministry of Environment and related administrative institutions, <Text style={{ fontWeight: "bold" }}>68 Class 1 species</Text> are currently registered.
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Class 2 endangered species</Text>
                {/*자연적 또는 인위적 위협 요인으로 개체 수가 크게 줄어들고 있어 현재의 위협요인이 제거되거나 완화되지 아니할 경우 가까운 장래에 멸종위기에 처할 우려가 있는 야생생물로서 관계 중앙행정기관의 장과 협의하여 환경부령으로 정하는 종이며, 현재*/}
                <Text style={styles.sectionDesc}>
                     Species that can become extinct in the near future due to natural or man-made causes reducing its numbers if the causes are not remedied. Decided by the Ministry of Environment and related administrative institutions,<Text style={{ fontWeight: "bold" }}>214 Class 2 species</Text> are currently registered.
                </Text>
            </View>

                <Text style={styles.intro}>
                    Developed by Dong Minwoo. <AntDesign name='mail' size={16} /> minwoodong@tcis.com
                </Text>

                <Text style={styles.sectionTitl}>Information Disclaimer</Text>
                <Text style={styles.sectionDes}>
                    All information in this app are based on the data from the Institute of Ecology and the Institute of Biological Resources, and the app is not affiliated with the Korean government. The developer does not take any responsibility for any problems caused by the information.
                    {/*이 어플리케이션의 모든 정보는 국립생태원과 국립생물자원관에서 제공하는 데이터를 기반으로 하며, 대한민국 정부와 무관합니다. 어플리케이션 개발자는 이 정보로 인해 발생하는 어떠한 문제에 대해서도 책임을 지지 않습니다.*/}
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
    title: {
        flex:1,
        fontSize: 28,
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
        marginBottom: 28,
        backgroundColor: "#14998f",
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
        color: "#fff",
        marginBottom: 8,
    },
    bullet: {
        fontSize: 15,
        color: "#fff",
        marginLeft: 8,
        marginBottom: 4,
    },
    sectionDesc: {
        fontSize: 15,
        color: "#fff",
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