import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Button, TextInput,  Modal, TouchableHighlight, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { firebaseAuth, firestore } from '../../config/firebase'
import { destroyKey, getKey } from '../../config/localStorage'
import { doc, getDoc } from 'firebase/firestore';

const Semua = ({navigation, route}) => {
    // Data Data Gas Trafo
    const [H2Value, setH2Value] = useState('');
    const [CH4Value, setCH4Value] = useState('');
    const [C2H2Value, setC2H2Value] = useState('');
    const [C2H4Value, setC2H4Value] = useState('');
    const [C2H6Value, setC2H6Value] = useState('');
    const [COValue, setCOValue] = useState('');
    const [CO2Value, setCO2Value] = useState('');

    // Data Data TDCG 
    const [awalTdcgValue, setawalTdcgValue] = useState('');
    const [akhirTdcgValue, setakhirTdcgValue] = useState('');


    // Data Data Tanggal 
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    // const [showPicker, setShowPicker] = useState(false);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    // Data Data Tambahan 
    const [DSValue, setDSValue] = useState(0.0);
    const [AcidValue, setAcidValue] = useState(0.0);
    const [MoisureValue, setMoisureValue] = useState(0.0);
    const [ITValue, setITValue] = useState(0.0);
    const [FuranValue, setFuranValue] = useState(0.0);
    const [TCValue, setTCValue] = useState(0.0);

    const [isDataComplete, setIsDataComplete] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [analysisResult, setAnalysisResult] = useState({
    tdcg: '',
    rogers: '',
    keyGas: '',
    doernenburg: '',
    // duval: '',
    co2co: '',
    purifikasiTime: '',
    performaTrafo: 0,
    kondisiTrafo: '',
    tindakanTrafo: '',
    predUmur:''
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
    // const handleDateChange = (event, selectedDate) => {
    //     if(event.type === 'set') {
    //         const currentDate = selectedDate || date;
    //         setDate(currentDate);
    //         setShowPicker(false);
    //     }
    // }

    // if (/^[1-9]*$/.test(text)) {
    //     setawalTdcgValue(text);
    // }

    //
    const Standart_Gas_H2 = [100, 200, 300, 500, 700];
    const Standart_Gas_CH4 = [75, 125, 200, 400, 600];
    const Standart_Gas_C2H6 = [65, 80, 100, 120, 150];
    const Standart_Gas_C2H4 = [50, 80, 100, 150, 200];
    const Standart_Gas_C2H2 = [3, 7, 35, 50, 80, 80];
    const Standart_Gas_CO = [350, 700, 900, 1100, 1400];
    const Standart_Gas_CO2 = [2500, 3000, 4000, 5000, 7000];


    // Fungsi Di Luar
    const Search_SiandWi = (Data_Gas, Standart_Gas) => {
        let Si = 0;
        let Wi = 0;

        if (Data_Gas <= Standart_Gas[0]) {
            Si = 1;
        } else if (Standart_Gas[0] < Data_Gas && Data_Gas <= Standart_Gas[1]) {
            Si = 2;
        } else if (Standart_Gas[1] < Data_Gas && Data_Gas <= Standart_Gas[2]) {
            Si = 3;
        } else if (Standart_Gas[2] < Data_Gas && Data_Gas <= Standart_Gas[3]) {
            Si = 4;
        } else if (Standart_Gas[3] < Data_Gas && Data_Gas <= Standart_Gas[4]) {
            Si = 5;
        } else {
            Si = 6;
        }

        if (Standart_Gas[0] === 350 || Standart_Gas[0] === 2500) {
            Wi = 1;
        } else if (Standart_Gas[0] === 100) {
            Wi = 2;
        } else if (
            Standart_Gas[0] === 75 ||
            Standart_Gas[0] === 65 ||
            Standart_Gas[0] === 50
        ) {
            Wi = 3;
        } else if (Standart_Gas[0] === 3) {
            Wi = 5;
        }

        return [Si, Wi];
    };


    // Fungsi Di Luar
    const hitung_nilai_kesehatan_DGA_Transformator = (data) => {
        let numerator = 0;
        let denominator = 0;

        data.forEach(item => {
            numerator += item.Si_Konsentrasi_gas * item.Wi_Konsentrasi_gas;
            denominator += item.Wi_Konsentrasi_gas;
        });

        const nilai_kesehatan_DGA = numerator / denominator;
        return nilai_kesehatan_DGA;
    };


    const Dielectric_Strength_Std = [52, 47, 35];
    const Acidity_Std = [0.04, 0.1, 0.15];
    const Moisure_Std = [20, 25, 30];
    const Interfacial_Tension_Std = [30, 23, 18];

    // Fungsi Di Luar
    const Search_SiWi_Minyak = (Data_variabel, Standart_Variabel) => {
        let Si = 0;
        let Wi = 0;
        
        if (Data_variabel <= Standart_Variabel[0]) {
            Si = 1;
        } else if (Standart_Variabel[0] < Data_variabel && Data_variabel <= Standart_Variabel[1]) {
            Si = 2;
        } else if (Standart_Variabel[1] < Data_variabel && Data_variabel <= Standart_Variabel[2]) {
            Si = 3;
        } else {
            Si = 4;
        }
        
        if (Standart_Variabel[0] === 20) {
            Wi = 4;
        } else if (Standart_Variabel[0] === 0.04) {
            Wi = 1;
        }
        
        return [Si, Wi];
    };

    // Fungsi Di Luar
    const Search_SiWi_Minyak_2 = (Data_variabel, Standart_Variabel) => {
        let Si = 0;
        let Wi = 0;
        
        if (Data_variabel >= Standart_Variabel[0]) {
            Si = 1;
        } else if (Standart_Variabel[0] > Data_variabel && Data_variabel >= Standart_Variabel[1]) {
            Si = 2;
        } else if (Standart_Variabel[1] > Data_variabel && Data_variabel >= Standart_Variabel[2]) {
            Si = 3;
        } else {
            Si = 4;
        }
        
        if (Standart_Variabel[0] === 52) {
            Wi = 3;
        } else if (Standart_Variabel[0] === 30) {
            Wi = 2;
        }
        
        return [Si, Wi];
    };

    // Fungsi Di Luar
    const Kualitas_minyak = (data) => {
        const numerator = data['Si_Konsentrasi_Minyak'].reduce((acc, val, index) => acc + (val * data['Wi_Konsentrasi_Minyak'][index]), 0);
        const denominator = data['Wi_Konsentrasi_Minyak'].reduce((acc, val) => acc + val, 0);
        return numerator / denominator;
    };

    // Fungsi Di Luar
    const Index_Kualitas_Minyak_or_DGA = (Kualitas_Minyak) => {
    let Indeks = '';
    if (Kualitas_Minyak < 1.2) {
        Indeks = 'A';
    } else if (1.2 <= Kualitas_Minyak && Kualitas_Minyak < 1.5) {
        Indeks = 'B';
    } else if (1.5 <= Kualitas_Minyak && Kualitas_Minyak < 2) {
        Indeks = 'C';
    } else if (2 <= Kualitas_Minyak && Kualitas_Minyak < 3) {
        Indeks = 'D';
    } else if (Kualitas_Minyak >= 3) {
        Indeks = 'E';
    }
    return Indeks;
    };

    const furan_std = [0, 100, 250, 500, 1000];

    // Fungsi Di Luar
    const Indeks_Furan = (Furan, furan_std) => {
    let indeks = '';
    if (furan_std[0] < Furan && Furan <= furan_std[1]) {
        indeks = 'A';
    } else if (furan_std[1] < Furan && Furan <= furan_std[2]) {
        indeks = 'B';
    } else if (furan_std[2] < Furan && Furan <= furan_std[3]) {
        indeks = 'C';
    } else if (furan_std[3] < Furan && Furan <= furan_std[4]) {
        indeks = 'D';
    } else {
        indeks = 'E';
    }
    return indeks;
    };


    // Fungsi Di Luar
    const HiFj_parameter = (komponen) => {
    let HiFJ = -1;
    if (komponen === 'A') {
        HiFJ = 4;
    } else if (komponen === 'B') {
        HiFJ = 3;
    } else if (komponen === 'C') {
        HiFJ = 2;
    } else if (komponen === 'D') {
        HiFJ = 1;
    } else if (komponen === 'E') {
        HiFJ = 0;
    }
    return HiFJ;
    };

    const Kj_gas = [8, 10, 5];

    const hitung_nilai_akhir_indeks_kesehatan = (data, HiFj_Tap) => {
        const numerator = data['parameter_uji'].reduce((acc, val, index) => acc + (val * data['HIF'][index]), 0);
        const denominator = data['parameter_uji'].reduce((acc, val) => acc + (4 * val), 0);
        const Kj_Tap = 5;
        const nilai_sumTap = 0.4 * ((HiFj_Tap * Kj_Tap) / (4 * Kj_Tap));
        const nilai_akhir_indeks_kesehatan = ((0.6 * (numerator / denominator)) + nilai_sumTap) * 100;
        return nilai_akhir_indeks_kesehatan;
    };

    // Fungsi Di Luar
    const penilaian_trafo = (hasil_perhitungan) => {
    let Kondisi = "";
    let Tindakan = "";
    let Pred_umur = "";

    if (85 < hasil_perhitungan && hasil_perhitungan <= 100) {
        Kondisi = "Baik";
        Tindakan = "Perawatan Normal";
        Pred_umur = "Lebih dari 15 Tahun";
    } else if (70 < hasil_perhitungan && hasil_perhitungan <= 85) {
        Kondisi = "Normal";
        Tindakan = "Perawatan Normal";
        Pred_umur = "Lebih dari 10 Tahun";
    } else if (50 < hasil_perhitungan && hasil_perhitungan <= 70) {
        Kondisi = "Waspada";
        Tindakan = "Meningkatkan Pengujian atau diagnosis";
        Pred_umur = "10 Tahun";
    } else if (30 < hasil_perhitungan && hasil_perhitungan <= 50) {
        Kondisi = "Jelek";
        Tindakan = "Memulai perencanaan penanganan resiko";
        Pred_umur = "Kurang dari 10 Tahun";
    } else if (0 < hasil_perhitungan && hasil_perhitungan <= 30) {
        Kondisi = "Sangat Jelek";
        Tindakan = "Penanganan dan pemulaian resiko";
        Pred_umur = "Mendekati akhir umur";
    }

    return [Kondisi, Tindakan, Pred_umur];
    };

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

// console.log(`Berdasarkan hasil perhitungan persentase nilai performa kondisi transformator, nilainya menunjukkan sebesar ${hasil_perhitungan.toFixed(2)}% yang berarti trafo berada pada kondisi ${penilaian_trafo(hasil_perhitungan)[0]} dan Memerlukan tindakan ${penilaian_trafo(hasil_perhitungan)[1]} dengan prediksi umur ${penilaian_trafo(hasil_perhitungan)[2]}`);

//
const tambah_hari = (tanggal_awal, selisih_hari) => {
    const tgl_awal = new Date(tanggal_awal);
    const tgl_hasil = new Date(tgl_awal.setDate(tgl_awal.getDate() + selisih_hari));
    return tgl_hasil.toISOString().split('T')[0];
}

const Purifikasi_time = (ppm_day, TDCG_Akhir) => {
    let purifikasi = 0;
    purifikasi = (1921 - TDCG_Akhir) / ppm_day;

    return Math.abs(Math.round(purifikasi));
}

    const Ppm_day = (TDCG_Awal, TDCG_Akhir, Tanggal_Awal, Tanggal_Akhir) => {
    const Tgl_awal = new Date(Tanggal_Awal);
    const Tgl_akhir = new Date(Tanggal_Akhir);

    // Menghitung Selisih Hari
    const selisih_hari = Math.floor((Tgl_akhir - Tgl_awal) / (1000 * 60 * 60 * 24));

    const ppm = (TDCG_Akhir - TDCG_Awal) / selisih_hari;
    return ppm;
}

    // Fungsi untuk menghitung ppm harian
    const calculatePpmDay = () => {
        // Panggil fungsi Ppm_day dengan parameter yang sesuai
        const ppmDay = Ppm_day(parseFloat(awalTdcgValue), parseFloat(akhirTdcgValue), startDate, endDate);
        return ppmDay;
    }

    // Fungsi untuk menghitung waktu purifikasi
    const calculatePurifikasiTime = () => {
        // Panggil fungsi Purifikasi_time dengan parameter ppmDay dan TDCG_Akhir
        const ppmDay = calculatePpmDay();
        const purifikasiTime = Purifikasi_time(ppmDay, parseFloat(akhirTdcgValue));
        return purifikasiTime;
    }

//


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


        // Perhitungan Umur Trafo 
        const Si_numerator = [0, 0, 0, 0, 0, 0, 0];
        const Wi_denominator = [0, 0, 0, 0, 0, 0, 0];
    
        const SiWiValues = [
            [gasData[0], Standart_Gas_H2],
            [gasData[1], Standart_Gas_CH4],
            [gasData[2], Standart_Gas_C2H2],
            [gasData[3], Standart_Gas_C2H4],
            [gasData[4], Standart_Gas_C2H6],
            [gasData[5], Standart_Gas_CO],
            [gasData[6], Standart_Gas_CO2],
        ];

        Si_numerator.forEach((_, index) => {
            const [Si, Wi] = Search_SiandWi(SiWiValues[index][0], SiWiValues[index][1]);
            Si_numerator[index] = Si;
            Wi_denominator[index] = Wi;
        });

         // Data DGA akan di olah
        const data_DGA = {
            'Si_Konsentrasi_gas': Si_numerator,
            'Wi_Konsentrasi_gas': Wi_denominator
        };

        const df_DGA = [
            { Si_Konsentrasi_gas: Si_numerator[0], Wi_Konsentrasi_gas: Wi_denominator[0] },
            { Si_Konsentrasi_gas: Si_numerator[1], Wi_Konsentrasi_gas: Wi_denominator[1] },
            { Si_Konsentrasi_gas: Si_numerator[2], Wi_Konsentrasi_gas: Wi_denominator[2] },
            { Si_Konsentrasi_gas: Si_numerator[3], Wi_Konsentrasi_gas: Wi_denominator[3] },
            { Si_Konsentrasi_gas: Si_numerator[4], Wi_Konsentrasi_gas: Wi_denominator[4] },
            { Si_Konsentrasi_gas: Si_numerator[5], Wi_Konsentrasi_gas: Wi_denominator[5] },
            { Si_Konsentrasi_gas: Si_numerator[6], Wi_Konsentrasi_gas: Wi_denominator[6] },
        ];

        console.log(Si_numerator);
        console.log(Wi_denominator);

        const hasil_perhitungan_DGA = hitung_nilai_kesehatan_DGA_Transformator(df_DGA); // Akhir sampai perhitungan data DGA 

            const Indeks_Tap_Changer = (Tap_Changer) => {
                console.log('Tap_Changer:', Tap_Changer); // Tambahkan log untuk memeriksa nilai
                let indeks = '';
                if (Tap_Changer == 0) {
                    indeks = 'A';
                } else if (1 <= Tap_Changer && Tap_Changer <= 2) {
                    indeks = 'B';
                } else if (Tap_Changer == 3) {
                    indeks = 'C';
                } else if (Tap_Changer == 4) {
                    indeks = 'D';
                } else {
                    indeks = 'E';
                }
                return indeks;
        };

        // Kualitas Minyak 
        const Si_numerator_minyak = Array.from({ length: 4 }, () => 0);
        const Wi_denominator_minyak = Array.from({ length: 4 }, () => 0);

        Si_numerator_minyak[0] = Search_SiWi_Minyak_2(DSValue, Dielectric_Strength_Std)[0];
        Si_numerator_minyak[1] = Search_SiWi_Minyak(AcidValue, Acidity_Std)[0];
        Si_numerator_minyak[2] = Search_SiWi_Minyak(MoisureValue, Moisure_Std)[0];
        Si_numerator_minyak[3] = Search_SiWi_Minyak_2(ITValue, Interfacial_Tension_Std)[0];

        Wi_denominator_minyak[0] = Search_SiWi_Minyak_2(DSValue, Dielectric_Strength_Std)[1];
        Wi_denominator_minyak[1] = Search_SiWi_Minyak(AcidValue, Acidity_Std)[1];
        Wi_denominator_minyak[2] = Search_SiWi_Minyak(MoisureValue, Moisure_Std)[1];
        Wi_denominator_minyak[3] = Search_SiWi_Minyak_2(ITValue, Interfacial_Tension_Std)[1];

        console.log(Si_numerator_minyak);
        console.log(Wi_denominator_minyak);

        const Si_Konsentrasi_Minyak = Si_numerator_minyak;
        const Wi_Konsentrasi_Minyak = Wi_denominator_minyak;
        const data_Minyak = { Si_Konsentrasi_Minyak, Wi_Konsentrasi_Minyak };

        const df_Minyak = data_Minyak;

        const hasil_perhitungan_kualitas_minyak = Kualitas_minyak(df_Minyak); // Akhir sampai perhitungan data kualitas minyak

        // Perhitungan indeks HiFj dan Kj 
        const indeks_Kualitas_Minyak = Index_Kualitas_Minyak_or_DGA(hasil_perhitungan_kualitas_minyak); // Ganti dengan hasil_perhitungan_kualitas_minyak
        const indeks_DGA = Index_Kualitas_Minyak_or_DGA(hasil_perhitungan_DGA); // Ganti dengan hasil_perhitungan_DGA
        const Indeks_furan = Indeks_Furan(FuranValue,furan_std); // Ganti dengan nilai Indeks Furan
        const Indeks_Tap_chg = Indeks_Tap_Changer(TCValue);

        const Data_Indeks_Kesehatan = [HiFj_parameter(indeks_Kualitas_Minyak),
                                    HiFj_parameter(indeks_DGA),
                                    HiFj_parameter(Indeks_furan)];
        console.log(Data_Indeks_Kesehatan);
        console.log("Indeks DGA",indeks_DGA);
        console.log("Nilai DGA", hasil_perhitungan_DGA);

        const data_contoh = { 'parameter_uji': Kj_gas, 'HIF': Data_Indeks_Kesehatan };
        //
        // Hitung waktu purifikasi
        // const purifikasiTime = tambah_hari(startDate, calculatePurifikasiTime());

        // Fungsi Di Luar
    
        const performaTrafo = hitung_nilai_akhir_indeks_kesehatan(data_contoh, HiFj_parameter(Indeks_Tap_Changer(TCValue)));
        const kondisiTrafo = penilaian_trafo(performaTrafo)[0];
        const tindakanTrafo = penilaian_trafo(performaTrafo)[1]; 
        const predUmur = penilaian_trafo(performaTrafo)[2];
        console.log("Nilai Tap ", TCValue);
        console.log("Indeks Tap ", Indeks_Tap_Changer(TCValue));
        // console.log("Indeks Tap ", Indeks_Tap_Changer(3));
        console.log("HiFj Tap", HiFj_parameter(Indeks_Tap_Changer(TCValue)));


        // Batas Perhitungan Umur Trafo
        // Hitung waktu purifikasi
        const purifikasiTime = tambah_hari(endDate, calculatePurifikasiTime());

        // Tetapkan hasil analisis ke variabel state
        setAnalysisResult({
            tdcg: tdcgResult,
            rogers: rogersResult,
            keyGas: keyGasResult,
            doernenburg: doernenburgResult,
            // duval: duvalResult,
            co2co: co2coResult,
            purifikasiTime: purifikasiTime,
            performaTrafo: performaTrafo,
            kondisiTrafo: kondisiTrafo,
            tindakanTrafo: tindakanTrafo,
            predUmur:predUmur,
        });
        navigation.navigate('Hasil', {userId: userId, source: 'Semua',
            analysisResult: {
                tdcg: tdcgResult,
                rogers: rogersResult,
                keyGas: keyGasResult,
                doernenburg: doernenburgResult,
                // duval: duvalResult,
                co2co: co2coResult,
                purifikasiTime: purifikasiTime,
                performaTrafo: performaTrafo,
                kondisiTrafo: kondisiTrafo,
                tindakanTrafo: tindakanTrafo,
                predUmur:predUmur,
            }
        });
    }
};


    //

    const handleTdcgAwalValue = (text) =>{
        setawalTdcgValue(text);
    }

    const handleTdcgAkhirValue = (text) =>{
        setakhirTdcgValue(text);
    }

    const handleDSValue = (text) =>{
        setDSValue(text);
    }

    const handleAcidValue = (text) =>{
        setAcidValue(text);
    }

    const handleMoisureValue = (text) =>{
        setMoisureValue(text);
    }

    const handleITValue = (text) =>{
        setITValue(text);
    }

    const handleTCValue = (text) =>{
        setTCValue(text);
    }

    const handleFuranValue = (text) =>{
        setFuranValue(text);
    }

    const handleH2Value = (text) =>{
        setH2Value(text);
    }

    const handleCH4Value = (text) =>{
        setCH4Value(text);
    }

    const handleC2H2Value = (text) =>{
        setC2H2Value(text);
    }

    const handleC2H4Value = (text) =>{
        setC2H4Value(text);
    }

    const handleC2H6Value = (text) =>{
        setC2H6Value(text);
    }

    const handleCOValue = (text) =>{
        setCOValue(text);
    }

    const handleCO2Value = (text) =>{
        setCO2Value(text);
    }

    const navigateToHome = () => {
        navigation.replace('Mainmenu', {userId: userId});
    }
    
    const handleDateChange = (event, selectedDate) => {
        setShowStartDatePicker(false);
        if (event.type === 'set') {
            if (selectedDate) {
                setStartDate(selectedDate);
            }
        }
    }

    const handleEndDateChange = (event, selectedDate) => {
        setShowEndDatePicker(false);
        if (event.type === 'set') {
            if (selectedDate) {
                setEndDate(selectedDate);
            }
        }
    }

    useEffect(() => {
        if (isDataComplete) {
            navigation.navigate('Hasil', {userId: userId,
                source: 'Semua',
                tdcg: analysisResult.tdcg,
                rogers: analysisResult.rogers,
                keyGas: analysisResult.keyGas,
                doernenburg: analysisResult.doernenburg,
                // duval: analysisResult.duval,
                co2co: analysisResult.co2co,
                purifikasiTime: analysisResult.purifikasiTime,
                performaTrafo: analysisResult.performaTrafo,
                kondisiTrafo: analysisResult.kondisiTrafo,
                tindakanTrafo: analysisResult.tindakanTrafo,
                predUmur:analysisResult.predUmur,
            });
        }
    }, [isDataComplete]);

    
    const navigateToHasil = () => {
        handleAnalysis();
    };
    

    
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
        COValue.trim() !== '' &&
        awalTdcgValue.trim() !== '' &&
        akhirTdcgValue.trim() !== '' &&
        DSValue.trim() !== '' &&
        AcidValue.trim() !== '' &&
        MoisureValue.trim() !== '' &&
        ITValue.trim() !== '' &&
        FuranValue.trim() !== '' &&
        TCValue.trim() !== '' &&
        !isNaN(startDate.getTime()) && 
        !isNaN(endDate.getTime())
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

    // Menghitung rentang tanggal
    const calculateDateRange = () => {
        const differenceInTime = endDate.getTime() - startDate.getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);
        return differenceInDays;
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
        <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: '#FFF6E9', maxWidth: 480 }}>
            <View style={{ flexDirection: 'column', paddingTop: 4, paddingRight: 2.5, paddingBottom: 40, paddingLeft: 5, width: '100%',height:'16%', backgroundColor:'#FFC107' }}>
                <View style={{ marginTop: '10%', marginLeft: '2%' }}>
                    <TouchableOpacity onPress={navigateToHome} style={{ position: 'absolute', top: 20, left: 5, borderRadius: 50, backgroundColor: '#FFFFFF', padding: 10 }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ position : 'relative',justifyContent: 'center',alignContent: 'center' }}>
                    <Text style={{ marginTop: '10%', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' }}>Analisis Trafomu</Text>
                </View>
            </View>
        
            <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 40 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 , color:'#004268' }}>Silahkan Masukkan Data Gas</Text>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>H2</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={H2Value} onChangeText={handleH2Value} />
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>C2H4</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={C2H4Value} onChangeText={handleC2H4Value}/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>CO2</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={CO2Value} onChangeText={handleCO2Value}/>
                    </View>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>CH4</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={CH4Value} onChangeText={handleCH4Value}/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>C2H6</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={C2H6Value} onChangeText={handleC2H6Value}/>
                    </View>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>C2H2</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={C2H2Value} onChangeText={handleC2H2Value}/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>CO</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={COValue} onChangeText={handleCOValue}/>
                    </View>
                </View>

                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 , color:'#004268'}}>Silahkan Masukkan Data TDCG</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, width: '100%' }}>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{color:'#004268',fontWeight: 600,marginBottom: '2%',}}>Awal</Text>
                        <TextInput style={{ height: 52, width: 150, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={awalTdcgValue} onChangeText={handleTdcgAwalValue}/>
                    </View>
                    <View style={{ alignItems: 'flex-start' }}>
                        <Text style={{color:'#004268',fontWeight: 600,marginBottom: '2%',}}>Akhir</Text>
                        <TextInput style={{ height: 52, width: 150, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={akhirTdcgValue} onChangeText={handleTdcgAkhirValue}/>
                    </View>
                </View>

                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 , color:'#004268'}}>Silahkan Masukkan Data tanggal</Text>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, width: '100%' }}>
                    {/* Tanggal Awal */}
                    <View style={{ alignItems: 'flex-start', position: 'relative' }}>
                        <Text style={{ color:'#004268', fontWeight: 600, marginBottom: '2%' }}>Awal</Text>
                        <TouchableOpacity style={{ position: 'absolute', zIndex: 1, right: 20, top: 32 }} onPress={() => setShowStartDatePicker(true)}>
                            <Image source={require('../../../assets/tanggal.png')} style={{ width: 23, height: 28 }} />
                        </TouchableOpacity>
                        <TextInput 
                            style={{ 
                                height: 52, 
                                width: 150, 
                                borderColor: '#FFAC33', 
                                borderRadius: 10, 
                                backgroundColor: '#C0BDBD', // Menambahkan padding untuk memisahkan teks dari gambar tanggal
                                // placeholder: 'Silahkan Masukkan Tanggal',
                                paddingLeft: 20, // Sesuaikan padding kiri untuk memberikan ruang yang cukup
                                paddingRight: 50,
                            }} 
                            value={startDate.toDateString()} 
                            editable={false} // Mencegah pengeditan langsung
                            // onChangeText={handle}
                        /> 
                        {showStartDatePicker && (
                            <DateTimePicker 
                                mode={'date'}
                                is24Hour={true}
                                value={startDate} 
                                onChange={handleDateChange} 
                            />
                        )}
                    </View>
                    
                    {/* Tanggal Akhir */}
                    <View style={{ alignItems: 'flex-start', position: 'relative' }}>
                        <Text style={{ color:'#004268', fontWeight: 600, marginBottom: '2%' }}>Akhir</Text>
                        <TouchableOpacity style={{ position: 'absolute', zIndex: 1, right: 20, top: 32 }} onPress={() => setShowEndDatePicker(true)}>
                            <Image source={require('../../../assets/tanggal.png')} style={{ width: 23, height: 28 }} />
                        </TouchableOpacity>
                        <TextInput 
                            style={{ 
                                height: 52, 
                                width: 150, 
                                borderColor: '#FFAC33', 
                                borderRadius: 10, 
                                backgroundColor: '#C0BDBD', // Menambahkan padding untuk memisahkan teks dari gambar tanggal
                                paddingLeft: 20, // Sesuaikan padding kiri untuk memberikan ruang yang cukup
                                paddingRight: 50,
                            }} 
                            value={endDate.toDateString()} 
                            editable={false} // Mencegah pengeditan langsung
                        /> 
                        {showEndDatePicker && (
                            <DateTimePicker 
                                mode={'date'}
                                is24Hour={true}
                                value={endDate} 
                                onChange={handleEndDateChange} 
                            />
                        )}
                    </View>

                </View>

                {/* Silahkan Masukkan Data */}
                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 , color:'#004268' }}>Silahkan Masukkan Data</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, width: '100%' }}>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>Dielectric Strength</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={DSValue} onChangeText={handleDSValue}/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>Acidity</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={AcidValue} onChangeText={handleAcidValue}/>
                    </View>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>Interfacial Tension</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={ITValue} onChangeText={handleITValue}/>
                        <Text style={{ marginTop: '10%',marginBottom: '2%', color:'#004268',fontWeight: 600}}>Furan</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={FuranValue} onChangeText={handleFuranValue}/>
                    </View>
                    <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                        <Text style={{ marginBottom: '2%', color:'#004268',fontWeight: 600}}>Moisure</Text>
                        <TextInput style={{ height: 52, width: 87, borderColor: '#FFAC33', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={MoisureValue} onChangeText={handleMoisureValue}/>
                    </View>
                </View>

                <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 20 , color:'#004268'}}>Silahkan Masukkan Data Banyak Masalah</Text>

                <View style={{ alignItems: 'flex-start', marginBottom: 20 }}>
                    <Text style={{ marginBottom: '2%', color:'#004268', fontWeight: 600}}>Tap Changer</Text>
                    <TextInput style={{ height: 52, width: 87, borderColor: '#C0BDBD', borderRadius: 10, backgroundColor: '#C0BDBD', paddingLeft: 15, paddingRight: 15,}} selectionColor = "#004268" value={TCValue} onChangeText={handleTCValue}/>
                </View>

                <TouchableOpacity 
                    style={{ justifyContent: 'center',
                                height: 54, width: 355,
                                alignItems: 'center',
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                                marginTop: '10%',
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
        </View>
        </KeyboardAvoidingView>
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

export default Semua;
