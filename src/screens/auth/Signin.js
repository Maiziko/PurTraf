import { ActivityIndicator, StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Pressable, KeyboardAvoidingView, Platform,Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { getKey, storeKey } from '../../config/localStorage'
import { Toast } from 'react-native-toast-notifications'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../../config/firebase'
import { Ionicons } from '@expo/vector-icons';

const Signin = () => {

    const [inputs, setInputs] = useState({
        email: {value: '', isValid:true},
        password: {value:'', isValid: true}
    })

    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    const inputChangeHandler = (inputIdentifier, enteredValue) => {
        setInputs((currentInputs) => {
            return {
                ...currentInputs,
                [inputIdentifier] : {value: enteredValue, isValid: true}
            }
        })
    };

    useEffect(() => {
        getKey('LOGGED_IN').then(res => {
            const data = res
            console.log("data : ",data);
            if(data){
                navigation.replace('Mainmenu', {userId: data})
            }
        })
    },[]);

    const handleSignUp = () => {
        navigation.replace('Signup');
    };

    const handleLogin = async () => {

        const dataLogin = {
            email: inputs.email.value,
            password: inputs.password.value,
        }

        const emailIsValid = inputs.email.value.trim() !== '';
        const passwordIsValid = inputs.password.value.trim() !== '';

        if (!emailIsValid || !passwordIsValid){
            setInputs((currentInputs) => ({
                email: {value: currentInputs.email.value, isValid: emailIsValid},
                password: {value: currentInputs.password.value, isValid: passwordIsValid},
            }));
            Toast.show('Please, check your input', {
                duration: 2000,
                placement: 'bottom',
                type: 'danger',
            });
            return;
        }

        setIsLoading(true);

        try{
            const userCredential = await signInWithEmailAndPassword(firebaseAuth, dataLogin.email, dataLogin.password);
            const userId = userCredential.user.uid;
            const emailVerified = userCredential.user.emailVerified

            // Jika email pengguna belum terverifikasi, pesan toast "Email belum terverifikasi" ditampilkan, 
            // dan proses login dihentikan.
            if (!emailVerified) {
                Toast.show('Email belum terverifikasi', {
                duration: 3000,
                placement: 'bottom',
                type: 'danger',
                });
                return
            } else {

                // Jika email pengguna sudah terverifikasi, data login berupa userId disimpan di penyimpanan lokal 
                // dengan menggunakan storeKey, dan pengguna diarahkan ke halaman 'home' dengan membawa userId 
                // sebagai parameter.
                storeKey('LOGGED_IN', userId);
                navigation.replace('Mainmenu', { userId: userId });
            }
        } catch (error) {
            // Jika ada kesalahan dalam proses login (misalnya, kata sandi salah), 
            // kesalahan ditangani dalam blok catch, dan pesan kesalahan ditampilkan sebagai pesan toast.
            const errorMessage = error.message;
            Toast.show(errorMessage, {
                duration: 3000,
                placement: 'bottom',
                type: 'danger',
            });
        } finally {
            setIsLoading(false);
        }

    }
    
    const [hidePassword, setHidePassword] = useState(true);
    const togglePasswordVisibility = () => {
            setHidePassword(!hidePassword);
    };


    // Render semua komponen yang akan digunakan
    return(
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 20, paddingLeft: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: '#FFF6E9', maxWidth: 480 }}>
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                    <Image source={require('../../../assets/abstrak.png')} style={{ width: '80%', height: '100%', resizeMode: 'stretch' }}/>
                </View>

                <View style={{ height: '70%' }}>
                    <Text style={{ fontSize: 36, color: '#004268', textTransform: 'capitalize' }}>Welcome To</Text>
                    <Text style={{ fontSize: 36, fontWeight: 'bold', color: "#F69912" }}>PurTraf</Text>
                    <Text style={{ fontSize: 24, color: '#004268', textTransform: 'capitalize' }}>Let’s Sign in</Text>
                    <Text style={{ fontSize: 16, color: '#004268', marginTop: 5 }}>Email Address</Text>
                    <TextInput style={{ height: 48, width: 355, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 5, marginTop: 12, paddingHorizontal: 15, backgroundColor: 'white' }} placeholder="email@gmail.com" label={"Email"} keyboardType="email-address"

          // Properti invalid ini digunakan untuk menentukan apakah input email yang dimasukkan oleh pengguna valid atau tidak. 
          // Status validitas diambil dari state inputs.email.isValid. Jika isValid true, maka input dianggap valid. Jika isValid 
          // false, maka input dianggap tidak valid.
            invalid={!inputs.email.isValid}

          // textInputConfig properti yang digunakan untuk mengkonfigurasi input teks (TextInput) yang digunakan untuk email.
          // Di dalam properti textInputConfig,kita mendefinisikan properti onChangeText, yang akan dipanggil saat pengguna 
          // memasukkan teks ke dalam input. 
          // onChangeText adalah fungsi yang akan memanggil inputChangeHandler saat pengguna memasukkan atau mengubah email. 
          // Fungsi ini akan mengubah state inputs dengan memperbarui nilai email yang dimasukkan oleh pengguna.
            onChangeText= {inputChangeHandler.bind(this, 'email')}
            />
                    <Text style={{ fontSize: 16, color: '#004268', marginTop: 2 }}>Password</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput style={{ flex: 1, height: 48, width: 320, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 10, marginTop: 10, paddingHorizontal: 15,paddingRight: 60, backgroundColor: 'white' }} label={"Password"}
            secureTextEntry={hidePassword}
            placeholder={"Enter password"}
            invalid={!inputs.password.isValid}
            onChangeText= {inputChangeHandler.bind(this, 'password')}
                />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={{ position: 'relative', right: 50 }}>
                            <Ionicons name={hidePassword ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={{ justifyContent: 'center', height: 54, width: 355, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, marginTop: 50, backgroundColor: '#FFAC33', borderRadius: 10 }} onPress={handleLogin}>
                        <Text style={{ fontSize: 20, fontWeight: '600', color: '#FFFFFF' }}>Sign In</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 14, color: '#004268' }}>Don't Have An Account?</Text>
                        <TouchableOpacity onPress={handleSignUp}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#004268', marginLeft: 5 }}>Sign up</Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </View>
        </KeyboardAvoidingView>
    )

}

export default Signin;