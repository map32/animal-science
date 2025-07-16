import React from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import speciesData from "@/assets/species_info.json";
import { Image } from 'expo-image'
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Helper to find species by id
function getSpeciesById(id: number) {
    return speciesData.find((item: any) => item.id === id);
}

export default function DescriptionScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const id = Number(params.id);
    const data = getSpeciesById(id);
    if (!data) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>데이터를 찾을 수 없습니다.</Text>
                <Text
                    style={{ color: "#007AFF", marginTop: 16 }}
                    onPress={() => router.back()}
                >
                    이전으로 돌아가기
                </Text>

            </View>
        );
    }
    return (
        <SafeAreaView style={[styles.safe, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
            <View style={{flex: 1, width: '100%'}} >
            <ScrollView style={styles.container}>
                {typeof data.image_url === "string" && data.image_url ? (
                    <Image source={{ uri: data.image_url }} style={styles.mainImage} />
                ) : null}
                <Text style={styles.koreanName}>{data.korean_name}</Text>
                <Text style={styles.englishName}>{data.english_name}</Text>
                <Text style={styles.category}>{data.category}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>분류학적 위치</Text>
                    {data.category_hierarchy.map((item, idx) => (
                        <Text key={idx} style={styles.hierarchyText}>
                            {item.type}: {item.korean} ({item.english})
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>보전조치</Text>
                    {data.conservation_actions.map((item, idx) => (
                        <Text key={idx} style={styles.actionText}>
                            {item.institutions}: {item.action_type}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>지정이력</Text>
                    {data.conservation_history.map((item, idx) => (
                        <Text key={idx} style={styles.historyText}>
                            • {item}
                        </Text>
                    ))}
                </View>

                {data.extra_sections.map((section, idx) =>
                    section.content ? (
                        <View style={styles.section} key={idx}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <Text style={styles.sectionContent}>{section.content}</Text>
                            {"img_url" in section && section.img_url ? (
                                
                                <Image
                                    source={{ uri: section.img_url }}
                                    style={styles.extraImage}
                                />
                            ) : null}
                        </View>
                    ) : null
                )}
            </ScrollView>
            <TouchableOpacity style={styles.backButton} onPress={() => {router.back();}}>
                    <AntDesign name="back" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {height: '100%', width: '100%', position: 'relative'},
    container: { flex: 1, backgroundColor: 'rgb(246, 246, 246)', padding: 16},
    mainImage: { width: "100%", aspectRatio: 1, borderRadius: 12, marginBottom: 16 },
    koreanName: { fontSize: 28, fontWeight: "bold", marginBottom: 4 },
    englishName: { fontSize: 18, color: "#666", marginBottom: 4 },
    category: { fontSize: 16, color: "#888", marginBottom: 16 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
    hierarchyText: { fontSize: 16, marginBottom: 2 },
    actionText: { fontSize: 16, marginBottom: 2 },
    historyText: { fontSize: 16, marginBottom: 2 },
    sectionContent: { fontSize: 16, marginBottom: 2, lineHeight: 22 },
    extraImage: { aspectRatio: 0.5, borderRadius: 8, marginTop: 8, resizeMode: 'contain' },
    backButton: { position: 'absolute', top: 8,
        zIndex: 1,
        right: 8,
    height: 40,
    width: 40,
    backgroundColor: 'rgb(60, 65, 69)', justifyContent: 'center', alignItems: 'center'}
});