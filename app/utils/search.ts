import speciesInfo from '@/assets/species_info.json'
import districtCodes from '@/assets/district_codes.json'

const divisionAlias = {
    "서울": "서울특별시",
    "서울시": "서울특별시",
    "부산": "부산광역시",
    "부산시": "부산광역시",
    "대구": "대구광역시",
    "대구시": "대구광역시",
    "인천": "인천광역시",
    "인천시": "인천광역시",
    "광주": "광주광역시",
    "광주시": "광주광역시",
    "대전": "대전광역시",
    "대전시": "대전광역시",
    "울산": "울산광역시",
    "울산시": "울산광역시",
    "세종": "세종특별자치시",
    "세종시": "세종특별자치시",
    "경기": "경기도",
    "경기도": "경기도",
    "강원": "강원특별자치도",
    "강원도": "강원특별자치도",
    "충북": "충청북도",
    "충청북도": "충청북도",
    "충남": "충청남도",
    "충청남도": "충청남도",
    "전북": "전북특별자치도",
    "전라북도": "전북특별자치도",
    "전남": "전라남도",
    "전라남도": "전라남도",
    "경북": "경상북도",
    "경상북도": "경상북도",
    "경남": "경상남도",
    "경상남도": "경상남도",
    "제주": "제주특별자치도",
    "제주도": "제주특별자치도",
    "제주특별자치도": "제주특별자치도"
}
const convertAlias = (text: string) => {
  return divisionAlias[text as keyof typeof divisionAlias];
}

export interface SST {
    id: number,
    class_type: string,
    category: string,
    korean_name: string,
    english_name: string,
    image_url: string | null
}

export type SpeciesSummaryType = SST | undefined;

const speciesInfoById = speciesInfo.reduce((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
}, {} as Record<number, typeof speciesInfo[0]>);

export const searchSpecies = (keyword: string): SST[] => {
    return speciesInfo
        .filter((obj) => obj.korean_name.includes(keyword) || obj.english_name.includes(keyword))
        .map(({ id, class_type, category, korean_name, english_name, image_url }) => ({
            id,
            class_type,
            category,
            korean_name,
            english_name,
            image_url
        }));
}

export const searchSpeciesDetail = (id: number): any => {
    return speciesInfoById[id]
}

export const searchSpeciesSummary = (id: number): SpeciesSummaryType => {
    const obj = speciesInfoById[id]
    if (!obj) return undefined;
    const { class_type, category, korean_name, english_name, image_url } = obj;
    return { id , class_type, category, korean_name, english_name, image_url }
}

export const searchAreas = (keyword: string): any[] => {
    return Object.entries(districtCodes)
    .filter(
        ([key, value]) => 
            value.Province.includes(keyword) || value.SIG_KOR_NM.includes(keyword)
    ).map(([k,v]) => ({...v, code: k}))
}