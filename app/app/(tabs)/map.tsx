import { useAssets } from "expo-asset";
import { useRef, useState, useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import {readAsStringAsync} from 'expo-file-system';
import WebView, { WebViewMessageEvent } from "react-native-webview";
import Feather from '@expo/vector-icons/Feather';
import divisions from '@/assets/divisions.json'
import SideNav from "@/components/sidenav";
import BottomModal from "@/components/bottomModal";
import distributions from '@/assets/species_distribution.json'
import districts from '@/assets/districts.json';
import districtCodes from '@/assets/district_codes.json';
import { SwitchButton } from "@/components/switchButton";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import district_species from '@/assets/district_species_names.json'
import province_species from '@/assets/province_species_names.json'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { searchSpeciesDetail, searchSpeciesSummary, convertAlias, convertCodeAlias, searchAreaByName } from "@/utils/search";

type divisionType = "시/도" | "시/군/구"

export default function Index() {
  const webviewRef = useRef<WebView>(null);
  const [index, err] = useAssets(require('@/assets/map.html'));
  const [safeAreaWidth, setSafeAreaWidth] = useState(400);
  const [html, setHtml] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>();
  const insets = useSafeAreaInsets();
  const [view, setView] = useState<divisionType>("시/도");
  if (index && index[0].localUri) {
    readAsStringAsync(index[0].localUri).then((data) => {
        setHtml(data);
    });
  }
  const onNavButtonPress = () => setDrawerOpen(!drawerOpen);
  const injectedJS = `
    window.divisionsGeojson = ${JSON.stringify(divisions)};
    window.districtsGeojson = ${JSON.stringify(districts)};
    loadDivisions();
    true;
  `;
  const handleMessage= (event: WebViewMessageEvent) => {
    const parsed = JSON.parse(event.nativeEvent.data);
    const {type, data} = parsed;
    if (type === 'area-click') {
      const selected: any = searchAreaByName(data.name);
      if (selected) {
        const foundSpeciesList = province_species[selected['name'] as keyof typeof province_species]
        let speciesList: any[] = [];
        if (foundSpeciesList) {
          speciesList = foundSpeciesList.map((item) => item.id ? searchSpeciesSummary(item.id) : null).filter((item) => item !== null)
        }
        setSelectedData({distribution: {...selected, name: data.name}, speciesList})
      }
      setModalOpen(true)
    } else if (type === 'district-click') {
      const code = data['SIG_CD']
      const selected: any = districtCodes[code as keyof typeof districtCodes]
      if (selected) {
        const foundObj = distributions.find((obj) => {return convertAlias(obj.name) === convertAlias(selected['Province'])});
        const found = foundObj ? foundObj['districts_distribution']?.find((obj) => obj.code === convertCodeAlias(code)) : undefined;
        const foundSpeciesList = district_species[code as keyof typeof district_species];
        let speciesList: any[] = [];
        if (foundSpeciesList) {
          speciesList = foundSpeciesList.map((item) => item.id ? searchSpeciesSummary(item.id) : null).filter((item) => item !== null)
        }
        setSelectedData({distribution: found, speciesList})
        setModalOpen(true)
      }
    }
  }

  const openModalFromSideNav = (item: any) => {
    const code = item['code']
    const selected: any = districtCodes[code as keyof typeof districtCodes]
    if (selected) {
      const foundObj = distributions.find((obj) => {return convertAlias(obj.name) === convertAlias(selected['Province'])});
      const found = foundObj ? foundObj['districts_distribution']?.find((obj) => obj.code === convertCodeAlias(code)) : undefined;
      const foundSpeciesList = district_species[code as keyof typeof district_species];
        let speciesList: any[] = [];
        if (foundSpeciesList) {
          speciesList = foundSpeciesList.map((item) => item.id ? searchSpeciesSummary(item.id) : null).filter((item) => item !== null)
        }
        console.log(selected, code, convertCodeAlias(code), found)
        setSelectedData({distribution: found, speciesList})
      setModalOpen(true)
    }
  }

  const switchView = (text: divisionType) => {
    if (text === view) return;
    if (text === "시/도") {
        webviewRef.current?.injectJavaScript(`
          loadDivisions();
          true;
          `) ;
        setView("시/도")
    } else {
      webviewRef.current?.injectJavaScript(`
          loadDistricts();
          true;
          `) ;
      setView("시/군/구")
        }
  }

  return (
    <SafeAreaView
      style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: '100%',
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      }}
      onLayout={event => {
      const { width } = event.nativeEvent.layout;
      setSafeAreaWidth(width);
      }}
    >
      <GestureHandlerRootView>
        <View>
          <WebView
          ref={webviewRef}
          originWhitelist={['*']}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          source={{html: html || ''}}

          style={{ flex: 1, width: safeAreaWidth }}
          injectedJavaScript={injectedJS}
          />
          <TouchableOpacity style={styles.menuButton} onPress={onNavButtonPress}>
            <Feather name="menu" size={24} color="white"/>
          </TouchableOpacity>
          <SideNav isOpen={drawerOpen} setOpen={setDrawerOpen} openModal={openModalFromSideNav} />
          <SwitchButton left="시/도" right="시/군/구" current={view} onSwitch={(text) => {switchView(text as divisionType)}}/>
          <BottomModal isOpen={modalOpen} data={selectedData} setIsOpen={setModalOpen} styles={{container:{height:'80%'}}} />
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    height: 40,
    width: 40,
    backgroundColor: 'rgb(60, 65, 69)',
    alignItems: 'center',
    justifyContent: 'center'
  }
})


