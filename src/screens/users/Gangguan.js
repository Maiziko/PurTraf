import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput,  Modal, TouchableHighlight, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../config/firebase'
import { doc, getDoc } from 'firebase/firestore';

const Gangguan = ({navigation, route}) => {
    // Data Data Gas Trafo
    const [H2Value, setH2Value] = useState('');
    const [CH4Value, setCH4Value] = useState('');
    const [C2H2Value, setC2H2Value] = useState('');
    const [C2H4Value, setC2H4Value] = useState('');
    const [C2H6Value, setC2H6Value] = useState('');
    const [COValue, setCOValue] = useState('');
    const [CO2Value, setCO2Value] = useState('');

    // Chech Data 
    const [isDataComplete, setIsDataComplete] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertNumVisible, setAlertNumVisible] = useState(false);
    const [analysisResult, setAnalysisResult] = useState({
    tdcg: '',
    rogers: '',
    keyGas: '',
    doernenburg: '',
    // duval: '',
    co2co: ''
});

    const [isLoading, setIsLoading] = useState(false);
    const [dataUsers, setDataUsers] = useState([])
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

    //
    // Perhitungan TDCG
    const TDCG_Method = (Data_Gas) => {
        let fault = "";
        const TDCG = Data_Gas.reduce((acc, val) => acc + val, 0);
        if (TDCG <= 720) {
            fault = "Transformator beroperasi dalam kondisi normal";
        } else if (TDCG >= 721 && TDCG <= 1920) {
            fault = "Indikasi Komposisi gas mulai tinggi, kemungkinan timbul kegagalan, pencegahan gejala agar tidak berlanjut";
        } else if (TDCG > 1920 && TDCG <= 4630) {
            fault = "Indikasi penguraian tingkat isolasi yang tinggi Kegagalan mungkin telah terjadi. Buat Pencegahan gangguan agar tidak berlanjut";
        } else if (TDCG > 4630) {
            fault = "Indikasi kerusakan sangat tinggi dan dekomposisi isolator sudah tersebar luas. Kerusakan pada transformator segera akan terjadi";
        }
        return fault;
    }

    // Rogers Ratio Method
const Rogers_Ratio_Method = (Data_Gas) => {
    let fault = "";

    if (Data_Gas[0] !== 0 && Data_Gas[3] !== 0 && Data_Gas[4] !== 0) {
        const R1 = Data_Gas[1] / Data_Gas[0];
        const R2 = Data_Gas[2] / Data_Gas[3];
        const R5 = Data_Gas[2] / Data_Gas[4];
        if (R2 < 0.1 && (0.1 <= R1 && R1 <= 1.0) && R5 < 0.1) {
            fault = "Unit Normal";
        } else if (R2 < 0.1 && R1 < 0.1 && R5 < 0.1) {
            fault = "Low-energy density arching-PD";
        } else if ((0.1 <= R2 && R2 <= 1.0) && (0.1 <= R1 && R1 <= 1.0) && R5 > 3.0) {
            fault = "Arching-High-energy discharge";
        } else if (R2 < 0.1 && (0.1 <= R1 && R1 <= 1.0) && (0.1 <= R5 && R5 <= 3.0)) {
            fault = "Low temperatur termal";
        } else if (R2 < 0.1 && R1 > 1.0 && (0.1 <= R5 && R5 <= 3.0)) {
            fault = "Thermal < 700 C";
        } else if (R2 < 0.1 && R1 > 0.1 && R5 > 3.0) {
            fault = "Thermal > 700";
        } else {
            fault = "Kegagalan tidak bisa dideteksi";
        }
    } else {
        fault = "Rogers Ratio tidak bisa dijalankan";
    }
    return fault;
}

// KeyGas Method
const KeyGas_Method = (Data_Gas) => {
    let fault = "";
    const sum_gas = Data_Gas.reduce((acc, val) => acc + val, 0);
    const persen_gas_all = Array(7).fill(0).map((_, i) => (100 * Data_Gas[i]) / sum_gas);
    const ThO = persen_gas_all[3];
    const ThD = persen_gas_all[5];
    const Pd = persen_gas_all[0];
    const Arc = persen_gas_all[0] + persen_gas_all[2];
    const fault_rate = [ThO, ThD, Pd, Arc];
    const max_fault_rate = Math.max(...fault_rate);
    let detect_gas = 99;
    for (let i = 0; i < 4; i++) {
        if (max_fault_rate === fault_rate[i]) {
            detect_gas = i + 1;
            break;
        }
    }
    if (detect_gas === 99) {
        fault = "Data Gas Unvalid untuk di deteksi";
    } else {
        if (detect_gas === 1) {
            fault = "Thermal Oil";
        } else if (detect_gas === 2) {
            fault = "Thermal Discharge";
        } else if (detect_gas === 3) {
            fault = "Partial Discharge";
        } else if (detect_gas === 4) {
            fault = "Arching";
        }
    }
    return fault;
}

// Doernenburg Method
const Doernenburg_Method = (Data_Gas) => {
    let fault = "";

    if (Data_Gas[0] !== 0 && Data_Gas[1] !== 0 && Data_Gas[2] !== 0 && Data_Gas[3] !== 0) {
        const R1 = Data_Gas[1] / Data_Gas[0];
        const R2 = Data_Gas[2] / Data_Gas[3];
        const R3 = Data_Gas[2] / Data_Gas[1];
        const R4 = Data_Gas[4] / Data_Gas[2];

        if (R1 > 1.0 && R2 < 0.75 && R3 < 0.75 && R4 > 0.4) {
            fault = "Dekomposisi termal";
        } else if (R1 < 1.0 && R3 < 0.3 && R4 > 0.4) {
            fault = "Partial Discharge";
        } else if ((0.1 < R1 && R1 < 1.0) && R2 > 0.75 && R3 < 0.75 && R4 > 0.4) {
            fault = "Arching";
        } else {
            fault = "Kegagalan tidak bisa terdeteksi";
        }
    } else {
        fault = "Doesnenburg tidak bisa dijalankan";
    }
    return fault;
}

// Duval Triangle Method
const Duval_Triangle_Method = (Data_Gas) => {
    let fault = "";
    const Gas_Denominator = Data_Gas[1] + Data_Gas[2] + Data_Gas[3];
    const Gas1_CH4 = Data_Gas[1] / Gas_Denominator;
    const Gas2_C2H2 = Data_Gas[2] / Gas_Denominator;
    const Gas3_C2H4 = Data_Gas[3] / Gas_Denominator;

    if (Math.round(Gas1_CH4) === 98) {
        fault = "PD : Partial Discharged";
    } else if (Math.round(Gas2_C2H2) === 4 && Math.round(Gas3_C2H4) === 20) {
        fault = "T1 : Thermal fault, temperature under 300 C";
    } else if (Math.round(Gas2_C2H2) === 4 && Math.round(Gas3_C2H4) === 20 && Math.round(Gas3_aksen) === 50) {
        fault = "T2 : Thermal fault, temperatur over 300 C and temperature under 700 C";
        fault = "T3 : Thermal fault, temperature over 700 C";
        fault = "DT : Thermal and Electric";
        fault = "D1 : Dischard Low Energy";
        fault = "D2 : Dischard High Energy";
    }

    return fault;
}


// CO2 CO Ratio Method
const CO2_CO_Ratio_Method = (Data_Gas) => {
    let fault = "";
    if (Data_Gas[5] !== 0) {
        const Rasio = Data_Gas[6] / Data_Gas[5];
        if (3 <= Rasio && Rasio <= 10) {
            fault = "Normal";
        } else {
            fault = "Fault Detect";
        }
    } else {
        fault = "CO2/CO Ratio tidak bisa dijalankan";
    }
    return fault;
}

    const handleInputChange = (text, setValue) => {
        // Memeriksa apakah nilai yang dimasukkan adalah angka
        if (/^\d*\.?\d*$/.test(text)) {
            setValue(text);
        } else {
            // Jika nilai yang dimasukkan bukan angka, tampilkan pesan kesalahan
            setAlertNumVisible(true);
        }
    };


    const navigateToHome = () => {
        navigation.replace('Mainmenu', {userId: userId});
    };

    useEffect(() => {
        if (isDataComplete) {
            navigation.navigate('Hasil', {userId: userId, source: 'Gangguan',
                tdcg: analysisResult.tdcg,
                rogers: analysisResult.rogers,
                keyGas: analysisResult.keyGas,
                doernenburg: analysisResult.doernenburg,
                // duval: analysisResult.duval,
                co2co: analysisResult.co2co
            });
        }
    }, [isDataComplete]);

    const handleAnalysis = () => {
    // Kumpulkan semua data gas
    const gasData = [
        parseFloat(H2Value),
        parseFloat(CH4Value),
        parseFloat(C2H2Value),
        parseFloat(C2H4Value),
        parseFloat(C2H6Value),
        parseFloat(COValue),
        parseFloat(CO2Value)
    ];

    const gasDataTDCG = [
        parseFloat(H2Value),
        parseFloat(CH4Value),
        parseFloat(C2H2Value),
        parseFloat(C2H4Value),
        parseFloat(C2H6Value),
        parseFloat(COValue),
    ];

    // Periksa apakah semua data telah diisi
    if (checkDataCompletion()) {

        // Panggil fungsi analisis dengan data gas sebagai argumen
        const tdcgResult = TDCG_Method(gasDataTDCG);
        const rogersResult = Rogers_Ratio_Method(gasData);
        const keyGasResult = KeyGas_Method(gasData);
        const doernenburgResult = Doernenburg_Method(gasData);
        // const duvalResult = Duval_Triangle_Method(gasData);
        const co2coResult = CO2_CO_Ratio_Method(gasData);

        // Tetapkan hasil analisis ke variabel state
        setAnalysisResult({
            tdcg: tdcgResult,
            rogers: rogersResult,
            keyGas: keyGasResult,
            doernenburg: doernenburgResult,
            // duval: duvalResult,
            co2co: co2coResult
        });

        navigation.navigate('Hasil', {userId: userId,
            analysisResult: {
                tdcg: tdcgResult,
                rogers: rogersResult,
                keyGas: keyGasResult,
                doernenburg: doernenburgResult,
                // duval: duvalResult,
                co2co: co2coResult
            },
            
        });
    }
};



    const navigateToHasil = () => {
        handleAnalysis();
    }
    
    // Check Data Valid 
    const checkDataCompletion = () => {
        // const awalTdcgValue = awalTdcgInputRef.current.value;
        // const akhirTdcgValue = akhirTdcgInputRef.current.value;

        // Periksa apakah ada nilai input yang kosong
        if (
            H2Value.trim() !== '' &&
            C2H4Value.trim() !== '' &&
            CO2Value.trim() !== '' &&
            CH4Value.trim() !== '' &&
            C2H6Value.trim() !== '' &&
            C2H2Value.trim() !== '' &&
            COValue.trim() !== ''
        ) {
            // Jika semua data telah diisi, set status menjadi true
            setIsDataComplete(true);
            return true;
        } else {
            // Jika ada data yang belum diisi, set status menjadi false
            setIsDataComplete(false);
            // Jika ada data yang belum terisi, tampilkan pesan kesalahan dengan menggunakan FancyAlert
            setAlertVisible(true);
            return false;
            
        }
    };

    const handleClose = () => {
        setAlertVisible(false);
    };

    const handleNumClose = () => {
        setAlertNumVisible(false);
    };

    return (

        <View style={{ flex: 1, paddingBottom: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: '#FFF6E9', maxWidth: 480 }}>
            <View style={{ position : 'static', paddingTop: 4, paddingRight: 2.5, paddingBottom: 40, paddingLeft: 5, width: '100',height:'16', backgroundColor:'#FFC107' }}>
                <View style={{ marginTop: '10%', marginLeft: '2%' }}>
                    <TouchableOpacity onPress={navigateToHome} style={{ position: 'absolute', top: 20, left: 5, borderRadius: 50, backgroundColor: '#FFFFFF', padding: 10 }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ position : 'relative',justifyContent: 'center',alignContent: 'center' }}>
                    <Text style={{ marginTop: '10%', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' }}>Analisis Gangguan Trafomu</Text>
                </View>
            </View>
        
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 , color:'#004268' }}>Silahkan Masukkan Data Gas</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>H2</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={H2Value} onChangeText={(text) => handleInputChange(text, setH2Value)} keyboardType="numeric"/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>C2H4</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={C2H4Value} onChangeText={(text) => handleInputChange(text, setC2H4Value)} keyboardType="numeric"/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>CO2</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={CO2Value} onChangeText={(text) => handleInputChange(text, setCO2Value)} keyboardType="numeric"/>
                    </View>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>CH4</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={CH4Value} onChangeText={(text) => handleInputChange(text, setCH4Value)} keyboardType="numeric"/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>C2H6</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={C2H6Value} onChangeText={(text) => handleInputChange(text, setC2H6Value)} keyboardType="numeric"/>
                    </View>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>C2H2</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={C2H2Value} onChangeText={(text) => handleInputChange(text, setC2H2Value)} keyboardType="numeric"/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>CO</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={COValue} onChangeText={(text) => handleInputChange(text, setCOValue)} keyboardType="numeric"/>
                    </View>
                </View>

                <TouchableOpacity 
                    style={{ justifyContent: 'center',
                                height: 54, width: 355,
                                alignItems: 'center',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                marginTop: '80%',
                                backgroundColor: '#FFAC33',
                                borderRadius: 10,}} onPress={navigateToHasil}>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#FFFFFF' }}>Analisis Sekarang!</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Komponen FancyAlert untuk menampilkan pesan kesalahan */}
                <Modal
                    visible={alertVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleClose}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.iconText}>X</Text>
                            </View>
                            <Text style={styles.messageText}>Mohon lengkapi semua data terlebih dahulu!</Text>
                            <TouchableHighlight
                                style={styles.buttonContainer}
                                onPress={handleClose}
                                underlayColor="#DDDDDD"
                            >
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={alertNumVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={handleClose}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.iconText}>X</Text>
                            </View>
                            <Text style={styles.messageText}>Data yang valid hanyalah angka!</Text>
                            <TouchableHighlight
                                style={styles.buttonContainer}
                                onPress={handleNumClose}
                                underlayColor="#DDDDDD"
                            >
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
        </View>
    );

}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFAC33',
        borderRadius: 50,
        width: 50,
        height: 50,
        alignSelf: 'center',
    },
    iconText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    messageText: {
        marginTop: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#FFAC33',
        textAlign: 'center',
    },
    buttonContainer: {
        borderRadius: 10,
        backgroundColor: '#FFAC33',
        paddingVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});


export default Gangguan;
