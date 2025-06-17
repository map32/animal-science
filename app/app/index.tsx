import { useAssets } from "expo-asset";
import { useRef, useState, useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet } from "react-native";
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

type divisionType = "시/도" | "시/군/구"

export default function Index() {
  const webviewRef = useRef<WebView>(null);
  const [index, err] = useAssets(require('@/assets/map.html'));
  const [safeAreaWidth, setSafeAreaWidth] = useState(400);
  const [html, setHtml] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(); 
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
      const selected: any = distributions.find((obj) => {return obj.name === data.name})
      if (selected) {
        setSelectedData({...selected['distribution'], name: data.name})
      }
      setModalOpen(true)
    } else if (type === 'district-click') {
      const selected: any = districtCodes[data['SIG_CD'] as keyof typeof districtCodes]
      console.log(distributions.find(obj => selected.Province.includes(obj.name)))
      if (selected) {
        setSelectedData({...selected['distribution'], name: data.name})
      }
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
      width: '100%'
      }}
      onLayout={event => {
      const { width } = event.nativeEvent.layout;
      setSafeAreaWidth(width);
      }}
    >
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
        <View style={styles.menuButton}>
          <Feather name="menu" size={24} color="white" onPress={onNavButtonPress}/>
        </View>
        <SideNav isOpen={drawerOpen} setOpen={setDrawerOpen} />
        <SwitchButton left="시/도" right="시/군/구" current={view} onSwitch={(text) => {switchView(text as divisionType)}}/>
        <BottomModal isOpen={modalOpen} data={selectedData} setIsOpen={setModalOpen} styles={{container:{height:'80%'}}} />
      </View>
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