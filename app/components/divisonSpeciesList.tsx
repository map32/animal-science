import { FC, memo } from 'react'
import { View, StyleSheet, Text} from 'react-native'
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler'
import { SST } from '@/utils/search'
import { useRouter } from 'expo-router'

const CATEGORY_COLORS: { [key: string]: string } = {
    mammals: '#FF6384',
    birds: '#36A2EB',
    reptiles: '#FFCE56',
    amphibians: '#4BC0C0',
    fish: '#9966FF',
    insects: '#FF9F40',
    invertebrates: '#C9CBCF',
    plants: '#7AC36A',
    seaweeds: '#50B432',
    fungi: '#F7A35C',
}

const CATEGORY_LABELS_KO: { [key: string]: string } = {
    mammals: '포유류',
    birds: '조류',
    reptiles: '파충류',
    amphibians: '양서류',
    fish: '어류',
    insects: '곤충류',
    invertebrates: '무척추동물',
    plants: '육상식물',
    seaweeds: '해조류',
    fungi: '고등균류',
}

const CATEGORY_LABELS_EN: { [key: string]: string } = Object.fromEntries(
    Object.entries(CATEGORY_LABELS_KO).map(([key, value]) => [value, key])
)

interface DivisionTableProps {
    data?: SST[]
}

export const DivisionSpeciesList: FC<DivisionTableProps> = ({ data }) => {
    const router = useRouter();
    return (
        <View style={tableStyles.table}>
            <View style={tableStyles.headerRow}>
                <Text style={[tableStyles.cell, tableStyles.header]}>Name</Text>
                <Text style={[tableStyles.cell, tableStyles.header]}>Classification</Text>
                <Text style={[tableStyles.cell, tableStyles.header]}>Endangerment Level</Text>
            </View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                getItemLayout={(data, index) => (
                    { length: 60, offset: 60 * index, index }
                )}
                maxToRenderPerBatch={5}
                windowSize={5}
                initialNumToRender={5}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                                router.navigate(`/description?id=${item.id}`);
                            }}>
                        <View style={tableStyles.row}>
                            <View style={tableStyles.cell}>
                                <Text style={{fontSize: 10}}>{item.name}({item.korean_name})</Text>
                                <Text style={{fontSize: 9}}>{item.english_name}</Text>
                            </View>
                            <View style={tableStyles.labelCell}>
                                <View style={[tableStyles.colorDot, { backgroundColor: CATEGORY_COLORS[CATEGORY_LABELS_EN[item.category]] }]} />
                                <Text style={tableStyles.labelText}>{item.category}</Text>
                            </View>
                            <Text style={tableStyles.cell}>{item.class_type === 'class 1' ? 'class 1' : item.class_type === 'class 2' ? 'class 2' : 'other'}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                style={tableStyles.content}
                showsVerticalScrollIndicator={false}
                />
        </View>
    )
}

export default DivisionSpeciesList;

const tableStyles = StyleSheet.create({
    table: {
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
    },
    content: {
        height: 300
    },
    row: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    cell: {
        flex: 1,
        padding: 12,
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        fontWeight: 'bold',
    },
    labelCell: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 12,
    },
    imageCell: {
        flex: 1,
        height: 60
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    labelText: {
        fontSize: 16,
    },
})
