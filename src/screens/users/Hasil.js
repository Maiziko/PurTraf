import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore';
import * as Localization from 'expo-localization';
import i18n from '../../../i18n';
import { useLanguage } from '../../utils/LanguageContext';

const Hasil = ({ navigation, route }) => {
  const { language } = useLanguage();

  const getDayName = (day) => {
    return i18n.t(`days.${day}`);
  }
  // Set state dengan nilai dari route.params saat komponen dimount
  const { tdcg, rogers, keyGas, doernenburg, duval, co2co, purifikasiTime, performaTrafo, kondisiTrafo, tindakanTrafo, predUmur, source, hari, hari_selisih } = route.params;
  const [isLoading, setIsLoading] = useState(false);
    const [dataUsers, setDataUsers] = useState([]);
    const { userId } = route.params;

    useEffect(() => {
        setIsLoading(true)
        const docRef = doc(firestore, "users", userId)
        getDoc(docRef).then((doc) => {
        setDataUsers(doc.data())
        }).finally(() => {
        setIsLoading(false)
        })
    }, [userId])

  const navigateToHome = () => {
    navigation.navigate('Mainmenu',{userId: userId});
  };

  useEffect(() => {
    console.log('Source:', source);
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: '#FFF6E9', maxWidth: 480 }}>
      <View style={{ flexDirection: 'column', paddingTop: 4, paddingRight: 2.5, paddingBottom: 40, paddingLeft: 5, width: '100%',height:'16%', backgroundColor:'#FFC107' }}>
        <View style={{ marginTop: '10%', marginLeft: '2%' }}>
          <TouchableOpacity onPress={navigateToHome} style={{ position: 'absolute', top: 20, left: 5, borderRadius: 50, backgroundColor: '#FFFFFF', padding: 10 }}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ position : 'relative',justifyContent: 'center',alignContent: 'center' }}>
          <Text style={{ marginTop: '10%', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' }}>{i18n.t('report')}</Text>
        </View>
      </View>

      <Text style={{ fontSize: 28, fontWeight: '600',paddingLeft: '5%', marginBottom: 5,marginTop:10, color:'#F69912' }}>{i18n.t('condition')}</Text>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40 }}>    
      <View style={{ justifyContent: 'space-between', marginBottom: 20,alignItems: 'center',padding: 10 }}>
        <View style={{padding: 20,width: 'auto', height:'auto',backgroundColor: '#FDEBD0',borderRadius: 10, }}>
          {(source !== 'Umur' && source !== 'Purifikasi') && (
            <View style={{padding: 8, width: 'auto', height:'auto',backgroundColor: '#FFFFFF',borderRadius: 5, }}>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify', fontWeight: 'bold'}}>{i18n.t('tdcRep')}</Text>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify'}}>{i18n.t("bam")} <Text style={{ fontWeight:'bold' }}>TDCG</Text> {i18n.t("dh")} : <Text style={{ fontWeight:'bold' }}>{tdcg}</Text></Text>
            </View>
          )}
          {(source !== 'Umur' && source !== 'Purifikasi') && (
            <View style={{ marginTop:'5%', padding: 8, width: 'auto', height:'auto',backgroundColor: '#FFFFFF',borderRadius: 5,}}>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify', fontWeight: 'bold'}}>{i18n.t('RogersRep')}</Text>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify'}}>{i18n.t("bam")} <Text style={{ fontWeight:'bold' }}>Rogers</Text> {i18n.t("dh")} : <Text style={{ fontWeight:'bold' }}>{rogers}</Text></Text>
            </View>)}
          {(source !== 'Umur' && source !== 'Purifikasi') && (
          <View style={{ marginTop:'5%',padding: 8, width: 'auto', height:'auto',backgroundColor: '#FFFFFF',borderRadius: 5,}}>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify', fontWeight: 'bold'}}>{i18n.t('keygasRep')}</Text>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify'}}>{i18n.t("bam")} <Text style={{ fontWeight:'bold' }}>KeyGas</Text> {i18n.t("dh")} : <Text style={{ fontWeight:'bold' }}>{keyGas}</Text></Text>
            </View>)}
          {/* {(source !== 'Umur' && source !== 'Purifikasi') && (<Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode Doernenburg : {doernenburg}</Text>)} */}
          {(source !== 'Umur' && source !== 'Purifikasi') && (
          <View style={{ marginTop:'5%', padding: 8, width: 'auto', height:'auto',backgroundColor: '#FFFFFF',borderRadius: 5,}}>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify', fontWeight: 'bold'}}>{i18n.t('DoernRep')}</Text>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify'}}>{i18n.t("bam")} <Text style={{ fontWeight:'bold' }}>Doernenburg</Text> {i18n.t("dh")} : <Text style={{ fontWeight:'bold' }}>{doernenburg}</Text></Text>
            </View>)}
          {(source !== 'Umur' && source !== 'Purifikasi') && (
            <View style={{ marginTop:'5%', padding: 8, width: 'auto', height:'auto',backgroundColor: '#FFFFFF',borderRadius: 5,}}>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify', fontWeight: 'bold'}}>{i18n.t('co2coRep')}</Text>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify'}}>{i18n.t("bam")} <Text style={{ fontWeight:'bold' }}>CO2CO</Text> {i18n.t("dh")} : <Text style={{ fontWeight:'bold' }}>{co2co}</Text></Text>
            </View>)}
          {/* <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode Duval : {duval}</Text> */}
          {(source === 'Semua' || source === 'Purifikasi') && (
            <View style={{ marginTop:'5%',padding: 8, width: 'auto', height:'auto',backgroundColor: '#FFFFFF',borderRadius: 5,}}>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify', fontWeight: 'bold'}}>{i18n.t('purifRep')}</Text>
              <Text style={{ marginBottom: 2, color: '#C57604', fontWeight: 400, fontSize: 17, textAlign: 'justify' }}>{i18n.t("otc")} <Text style={{ fontWeight: 'bold' }}>{hari_selisih} {i18n.t("d")}</Text> {i18n.t("fp")} <Text style={{ fontWeight: 'bold' }}>{getDayName(hari)}, {purifikasiTime}</Text></Text>
            </View>
          )}
          {(source === 'Semua' || source === 'Umur') && (
            <View style={{ marginTop:'5%',padding: 8, width: 'auto', height:'auto',backgroundColor: '#FFFFFF',borderRadius: 5,}}>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify', fontWeight: 'bold'}}>{i18n.t('healtRep')}</Text>
              <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:17,textAlign: 'justify'}}>{i18n.t("Bsd")} <Text style={{ fontWeight:'bold' }}>{performaTrafo !== undefined ? performaTrafo.toFixed(2) : ''}%</Text> {i18n.t("whc")} <Text style={{ fontWeight:'bold' }}>{kondisiTrafo}</Text> {i18n.t("car")} <Text style={{ fontWeight:'bold' }}>{tindakanTrafo}</Text> {i18n.t("awa")} <Text style={{ fontWeight:'bold' }}>{predUmur}</Text> </Text>
            </View>
          )}
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

export default Hasil;
