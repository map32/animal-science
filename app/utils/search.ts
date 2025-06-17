import speciesInfo from '@/assets/species_info.json'
import districtCodes from '@/assets/district_codes.json'

export const searchSpecies = (keyword: string): any[] => {
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
    return speciesInfo.find((obj) => obj.id === id);
}

export const searchAreas = (keyword: string): any[] => {
    return Object.entries(districtCodes)
    .filter(
        ([key, value]) => 
            value.Province.includes(keyword) || value.SIG_KOR_NM.includes(keyword)
    ).map(([k,v]) => ({...v, code: k}))
}