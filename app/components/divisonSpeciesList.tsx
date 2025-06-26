import { FC, memo } from 'react'
import { View, StyleSheet, Text} from 'react-native'
import { ScrollView } from 'react-native'
import { Image } from 'expo-image'
import { SST } from '@/utils/search'

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
    return (
        <View style={tableStyles.table}>
            <View style={tableStyles.headerRow}>
                <Text style={[tableStyles.cell, tableStyles.header]}>사진</Text>
                <Text style={[tableStyles.cell, tableStyles.header]}>이름</Text>
                <Text style={[tableStyles.cell, tableStyles.header]}>분류</Text>
                <Text style={[tableStyles.cell, tableStyles.header]}>등급</Text>
            </View>
            <ScrollView style={tableStyles.content}>
                {data?.map(({id, image_url, korean_name, english_name, class_type, category}) => (
                    <View key={id} style={tableStyles.row}>
                        <View style={tableStyles.imageCell}>
                            <Image source={image_url} style={{height:60}} />
                        </View>
                        <View style={tableStyles.cell}>
                            <Text style={{fontSize: 10}}>{korean_name}</Text>
                            <Text style={{fontSize: 10}}>{english_name}</Text>
                        </View>
                        <View style={tableStyles.labelCell}>
                            <View style={[tableStyles.colorDot, { backgroundColor: CATEGORY_COLORS[CATEGORY_LABELS_EN[category]] }]} />
                            <Text style={tableStyles.labelText}>{category}</Text>
                        </View>
                        <Text style={tableStyles.cell}>{class_type === 'class 1' ? '1급' : class_type === 'class 2' ? '2급' : '기타'}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default memo(DivisionSpeciesList);

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
