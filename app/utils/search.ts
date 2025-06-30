import speciesInfo from '@/assets/species_info.json'
import districtCodes from '@/assets/district_codes.json'
import distributions from '@/assets/species_distribution.json'
import district_species from '@/assets/district_species_names.json'
import province_species from '@/assets/province_species_names.json'

//시/도 이름의 별칭을 본명으로 변환하는 매핑핑
const divisionAlias = {
    "서울": "서울특별시",
    "서울시": "서울특별시",
    "서울특별시": "서울특별시",
    "부산광역시": "부산광역시",
    "부산": "부산광역시",
    "부산시": "부산광역시",
    "대구광역시": "대구광역시",
    "대구": "대구광역시",
    "대구시": "대구광역시",
    "인천광역시": "인천광역시",
    "인천": "인천광역시",
    "인천시": "인천광역시",
    "광주광역시": "광주광역시",
    "광주": "광주광역시",
    "광주시": "광주광역시",
    "대전광역시": "대전광역시",
    "대전": "대전광역시",
    "대전시": "대전광역시",
    "울산광역시": "울산광역시",
    "울산": "울산광역시",
    "울산시": "울산광역시",
    "세종특별자치시": "세종특별자치시",
    "세종": "세종특별자치시",
    "세종시": "세종특별자치시",
    "경기": "경기도",
    "경기도": "경기도",
    "강원": "강원특별자치도",
    "강원도": "강원특별자치도",
    "강원특별자치도": "강원특별자치도",
    "충북": "충청북도",
    "충청북도": "충청북도",
    "충남": "충청남도",
    "충청남도": "충청남도",
    "전북": "전북특별자치도",
    "전라북도": "전북특별자치도",
    "전북특별자치도": "전북특별자치도",
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

//districtCodes와 districts의 폐지된 시/군/구 코드를 species_distribution에서 사용하는 현존 코드로 매핑
const codeAlias = {
    "45111": "52111",  // 전주시 완산구
    "45113": "52113",  // 전주시 덕진구
    "45130": "52130",  // 군산시
    "45140": "52140",  // 익산시
    "45180": "52180",  // 정읍시
    "45190": "52190",  // 남원시
    "45210": "52210",  // 김제시
    "45710": "52710",  // 완주군
    "45720": "52720",  // 진안군
    "45730": "52730",  // 무주군
    "45740": "52740",  // 장수군
    "45750": "52750",  // 임실군
    "45770": "52770",  // 순창군
    "45790": "52790",  // 고창군
    "45800": "52800"   // 부안군
}
export const convertAlias = (text: string) => {
  return divisionAlias[text as keyof typeof divisionAlias];
}

export const convertCodeAlias = (code: string) => {
    return codeAlias[code as keyof typeof codeAlias] || code;
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

export const searchAreaByName = (name: string): any | undefined => {
    const selected: any = distributions.find((obj) => {return obj.name === name})
    return selected ? {...selected['distribution'], name} : undefined;
}