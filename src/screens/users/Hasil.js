import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseAuth, firestore } from '../../config/firebase'
import { destroyKey, getKey } from '../../config/localStorage'
import { doc, getDoc } from 'firebase/firestore';

const Hasil = ({ navigation, route }) => {
  // Set state dengan nilai dari route.params saat komponen dimount
  const { tdcg, rogers, keyGas, doernenburg, duval, co2co, purifikasiTime, performaTrafo, kondisiTrafo, tindakanTrafo, predUmur, source } = route.params;
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
          <Text style={{ marginTop: '10%', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' }}>Hasil Analisis</Text>
        </View>
      </View>

      <Text style={{ fontSize: 28, fontWeight: '600',paddingLeft: '5%', marginBottom: 20,marginTop:'5%', color:'#F69912' }}>Keadaan Trafomu</Text>
            
      <View style={{ justifyContent: 'space-between', marginBottom: 20,alignItems: 'center' }}>
        <View style={{padding: 20,width: 'auto', height:'auto',backgroundColor: '#FFCA7E',borderRadius: 10}}>
          {(source !== 'Umur' && source !== 'Purifikasi') && (
            <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode TDCG : <Text style={{ fontWeight:'bold' }}>{tdcg}</Text></Text>
          )}
          {(source !== 'Umur' && source !== 'Purifikasi') && (<Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode Rogers : <Text style={{ fontWeight:'bold' }}>{rogers}</Text> </Text>)}
          {(source !== 'Umur' && source !== 'Purifikasi') && (<Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode KeyGas : <Text style={{ fontWeight:'bold' }}>{keyGas}</Text></Text>)}
          {/* {(source !== 'Umur' && source !== 'Purifikasi') && (<Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode Doernenburg : {doernenburg}</Text>)} */}
          {(source !== 'Umur' && source !== 'Purifikasi') && (<Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode Doernenburg : <Text style={{ fontWeight:'bold' }}>{doernenburg}</Text></Text>)}
          {(source !== 'Umur' && source !== 'Purifikasi') && (<Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode CO2CO : <Text style={{ fontWeight:'bold' }}>{co2co}</Text></Text>)}
          {/* <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Hasil dengan metode Duval : {duval}</Text> */}
          {(source === 'Semua' || source === 'Purifikasi') && (
            <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Waktu Purifikasi : {purifikasiTime}</Text>
          )}
          {(source === 'Semua' || source === 'Umur') && (
            <Text style={{ marginBottom: 2, color:'#C57604',fontWeight: 400,fontSize:20,textAlign: 'justify'}}>Berdasarkan hasil perhitungan persentase nilai performa kondisi transformator, nilainya menunjukkan sebesar {performaTrafo !== undefined ? performaTrafo.toFixed(2) : ''}% yang berarti trafo berada pada kondisi {kondisiTrafo} dan memerlukan tindakan {tindakanTrafo} dengan prediksi umur {predUmur} </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default Hasil;
