import { FC, memo } from 'react'
import { View, StyleSheet, Text} from 'react-native'
import { ScrollView } from 'react-native'

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

interface DivisionTableProps {
    data?: { [key: string]: string }
}

export const DivisionTable: FC<DivisionTableProps> = ({ data }) => {
    if (!data) return null
    const rows = Object.entries(data)
        .filter(([key, value]) => key !== "total" && key !== "name" && value !== "0")
    return (
        <View style={tableStyles.table}>
            <View style={tableStyles.headerRow}>
                <Text style={[tableStyles.cell, tableStyles.header]}>분류</Text>
                <Text style={[tableStyles.cell, tableStyles.header]}>개수</Text>
            </View>
            <ScrollView style={tableStyles.content}>
                {rows.map(([key, value]) => (
                    <View key={key} style={tableStyles.row}>
                        <View style={tableStyles.labelCell}>
                            <View style={[tableStyles.colorDot, { backgroundColor: CATEGORY_COLORS[key] }]} />
                            <Text style={tableStyles.labelText}>{CATEGORY_LABELS_KO[key]}</Text>
                        </View>
                        <Text style={tableStyles.cell}>{value}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default memo(DivisionTable);

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
        height: 250
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
