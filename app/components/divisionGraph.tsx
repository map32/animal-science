import PieChart from 'react-native-pie-chart'
import { FC, useMemo } from 'react'
import { View, StyleSheet, Text} from 'react-native'

interface DivisionGraphProps {
    size: number,
    data?: {[key: string]: string}
}

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


const DivisionGraph: FC<DivisionGraphProps> = ({size, data}) => {
    const slices = useMemo(() => {
        return data !== undefined ? Object.entries(data)
            .filter(([key, value]) => key !== "total" && key !== "name" && key !== "code" && value !== "0")
            .map(([key, value]) => ({value: parseInt(value, 10), color: CATEGORY_COLORS[key], label:{text: CATEGORY_LABELS_KO[key]}})) : []
    }, [data])
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{data ? data['name'] : ''} 멸종위기종 분포</Text>
            {slices.length > 0 ? <PieChart widthAndHeight={size} series={slices} cover={0.5}/> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24
    }
})

export default DivisionGraph;