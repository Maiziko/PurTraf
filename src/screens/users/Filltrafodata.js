import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, Modal, TouchableHighlight, StyleSheet } from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { firebaseAuth, firestore } from '../../config/firebase'
import { destroyKey, getKey } from '../../config/localStorage'
import { doc, getDoc } from 'firebase/firestore';

const Filltrafodata = ({ navigation, route }) => {
    const [namaPerusahaan, setNamaPerusahaan] = useState('');
    const [namaTrafo, setNamaTrafo] = useState('');
    const [lokasiTrafo, setLokasiTrafo] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
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

    const handleNamaPerusahaanChange = (text) => {
        setNamaPerusahaan(text);
    };

    const handleNamaTrafoChange = (text) => {
        setNamaTrafo(text);
    };

    const handleLokasiTrafoChange = (text) => {
        setLokasiTrafo(text);
    };
    
    const navigateToSignIn = () => {
        navigation.replace('Mainmenu', {userId: userId});
    };

    const saveTransformatorData = () => {
        if (!namaPerusahaan || !namaTrafo || !lokasiTrafo) {
            // Jika ada data yang belum terisi, tampilkan pesan kesalahan
            setAlertVisible(true);
            return;
        }
        const { selectedMenuId } = route.params || {};

        // Simpan data trafo ke database atau penyimpanan lokal
        // Implementasi penyimpanan data trafo

        // Navigasi ke layar tujuan dengan mengirimkan selectedMenuId sebagai parameter
        const screenMap = {
            1: 'Umur',
            2: 'Purifikasi',
            3: 'Gangguan',
            4: 'Semua',
        };

        const targetScreenName = screenMap[selectedMenuId] || 'Umur';

        navigation.navigate(targetScreenName, { selectedMenuId , userId: userId});
    };

    const handleClose = () => {
        setAlertVisible(false);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 20, paddingLeft: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: '#FFF6E9', maxWidth: 480 }}>
                <View style={{ marginTop: '10%' }}>
                    <TouchableOpacity onPress={navigateToSignIn} style={{ position: 'absolute', top: 20, left: 5, borderRadius: 50, backgroundColor: '#FFFFFF', padding: 10 }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: '25%', alignItems: 'center' }}>
                    <Image
                        source={require('../../../assets/Splash1.png')}
                        style={{ width: 50, height: 70, maxWidth: '100%', borderColor: '#FF9800', aspectRatio: 0.69, width: 106, height: 'auto', justifyContent: 'center' }}
                    />
                    <Text className="self-center mt-4 text-3xl font-semibold leading-9 text-center text-sky-900 capitalize" style={{ fontSize: 20, fontWeight: '500', color: '#004268' }}>
                        Data Trafomu
                    </Text>
                    <Text className="self-center mt-2 text-base leading-6 text-center text-gray-500" style={{ fontSize: 10, fontWeight: '500', color: '#004268' }}>
                        Silahkan Masukkan Data Trafomu
                    </Text>
                </View>
                <View style={{ height: '70%', marginTop: '5%' }}>
                    <Text className="mt-5 text-base text-sky-900">Nama Perusahaan</Text>
                    <TextInput style={{ height: 48, width: 355, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 5, marginTop: 12, paddingHorizontal: 10, backgroundColor: 'white' }} placeholder="nama perusahaan" value={namaPerusahaan}
                        onChangeText={handleNamaPerusahaanChange} />
                    <Text className="mt-5 text-base text-sky-900">Nama Trafo</Text>
                    <TextInput style={{ height: 48, width: 355, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 5, marginTop: 12, paddingHorizontal: 10, backgroundColor: 'white' }} placeholder="nama trafo" value={namaTrafo}
                        onChangeText={handleNamaTrafoChange} />
                    <Text className="mt-2 text-base text-sky-900">Lokasi Trafo</Text>
                    <TextInput style={{ height: 48, width: 355, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 5, marginTop: 12, paddingHorizontal: 10, backgroundColor: 'white' }} placeholder="Lokasi Trafo" value={lokasiTrafo}
                        onChangeText={handleLokasiTrafoChange} />

                    <TouchableOpacity style={{ justifyContent: 'center',
                        height: 54, width: 355,
                        alignItems: 'center',
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        marginTop: 50,
                        backgroundColor: '#FFAC33',
                        borderRadius: 10,
                    }} onPress={saveTransformatorData}>

                        <Text style={{ fontSize: 20, fontWeight: '600', color: '#FFFFFF'}}>Simpan</Text>
                    </TouchableOpacity>
                </View>
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

export default Filltrafodata;
