import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import speciesData from "@/assets/species_info.json";
import englishSpeciesData from '@/assets/translated_species_info_full.json'
import { Image } from 'expo-image'
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Helper to find species by id
function getSpeciesById(id: number) {
    const koreanData = speciesData.find((item: any) => item.id === id);
    let englishData = englishSpeciesData.find((item: any) => item.id === id);
    const koreanDist = koreanData?.extra_sections.find((item: Object) => 'img_url' in item);
    const i = englishData?.extra_sections.findIndex((item) => item.title === "Distribution");
    //@ts-ignore
    englishData!.extra_sections[i!]['img_url'] = koreanDist?.img_url;
    return {...koreanData, ...englishData} as any;
}

const map = {
    "포유류": "Mammal",
    "조류": "Avian",
    "파충류": "Reptile",
    "양서류": "Amphibian",
    "어류": "Fish",
    "곤충류": "Insect",
    "무척추동물": "Invertebrate",
    "육상식물": "Plant",
    "해조류": "Seaweed",
    "고등균류": "Fungi"
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
                <Text>Page Not Found</Text>
                <Text
                    style={{ color: "#007AFF", marginTop: 16 }}
                    onPress={() => router.back()}
                >
                    Go Back
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
                <Text style={styles.koreanName}>{data.name} ({data.korean_name})</Text>
                <Text style={styles.englishName}>{data.english_name}</Text>
                {/*@ts-ignore*/}
                <Text style={styles.category}>{map[data.category] ?? data.category}</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Classification</Text>
                    {data.category_hierarchy.map((item: any, idx: number) => (
                        <Text key={idx} style={styles.hierarchyText}>
                            {item.type}: {item.english} ({item.korean})
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Conservation</Text>
                    {data.conservation_actions.map((item: any, idx: number) => (
                        <Text key={idx} style={styles.actionText}>
                            {item.institutions}: {item.action_type}
                        </Text>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>History</Text>
                    {data.conservation_history.map((item: any, idx: number) => (
                        <Text key={idx} style={styles.historyText}>
                            • {item}
                        </Text>
                    ))}
                </View>

                {data.extra_sections.map((section: any, idx: any) =>
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