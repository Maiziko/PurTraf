import { ActivityIndicator, StyleSheet, Text, View, KeyboardAvoidingView, Platform, Alert, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Toast } from 'react-native-toast-notifications'
import { firebaseAuth, firestore } from '../../config/firebase'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc } from 'firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import * as localization from 'expo-localization';
import i18n from '../../../i18n';
import { useLanguage } from '../../utils/LanguageContext'

const Signup = () => {
    const { language } = useLanguage();
    const [inputs, setInputs] = useState({
        fullname: { value: '', isValid: true },
        email: { value: '', isValid: true },
        password: { value: '', isValid: true },
        alamat: {value: '', isValid: true},
        gender: {value: null, isValid: true
    }
    })
    const [isLoading, setIsLoading] = useState(false)
    const navigation = useNavigation()

    const inputChangeHandler = (inputIdentifier, enteredValue) => {
        setInputs((currentInputs) => {
            return {
                ...currentInputs,
                [inputIdentifier]: { value: enteredValue, isValid: true }
            }
        })
    }

    // handleLogin mengarahkan pengguna ke halaman/screen login
    const handleLogin = () => {
        navigation.replace('Signin')
    }

    const handleRegister = async () => {

    // Object dataRegister yang datanya didapatkan dari state inputs
        const dataRegister = {
            fullname: inputs.fullname.value,
            email: inputs.email.value,
            password: inputs.password.value,
            alamat: inputs.alamat.value,
            gender: inputs.gender.value
        };

    // Memeriksa apakah emailIsValid, fullnameIsValid, dan passwordIsValid adalah true. 
    // Ini dilakukan dengan memeriksa apakah input email, nama lengkap, dan kata sandi tidak kosong
        const emailIsValid = inputs.email.value.trim() !== "";
        const fullnameIsValid = inputs.fullname.value.trim() !== "";
        const passwordIsValid = inputs.password.value.trim() !== "";
        const alamatIsValid = inputs.alamat.value.trim() !== "";
        const genderIsValid = inputs.gender.value !== null;

    // Jika ada input yang tidak valid (kosong), 
    // maka status validitasnya diubah dalam state inputs. 
    // Ini dilakukan dengan mengganti nilai isValid untuk setiap input yang tidak valid menjadi false.
    // Setelah validasi input, jika ada input yang tidak valid, kita tampilkan pesan toast "Check your input" 
    // kepada pengguna. Pesan toast ini memperingatkan pengguna untuk mengisi semua input yang diperlukan.
        if (!emailIsValid || !passwordIsValid || !fullnameIsValid || !alamatIsValid ) {
        setInputs((currentInputs) => ({
            email: { value: currentInputs.email.value, isValid: emailIsValid },
            fullname: { value: currentInputs.fullname.value, isValid: fullnameIsValid },
            password: { value: currentInputs.password.value, isValid: passwordIsValid },
            alamat: { value: currentInputs.alamat.value, isValid: alamatIsValid },
            gender: {value: currentInputs.gender.value, isValid: genderIsValid}
        }));

        console.log(inputs);
        console.log(fullnameIsValid);
        console.log(emailIsValid);
        console.log(passwordIsValid);

        Toast.show("Check your input", {
            duration: 3000,
            placement: 'bottom',
            type: 'danger',
        });
        return;
    }

    // Jika semua input valid ubah state isLoading menjadi true
    setIsLoading(true)
    try {
      // Pada object success kita menggunakan createUserWithEmailAndPassword dari Firebase Authentication. 
      // Jika registrasi berhasil, ambil nilau userId dari object tersebut (uid).
        const success = await createUserWithEmailAndPassword(firebaseAuth, dataRegister.email, dataRegister.password);
        const userId = success.user.uid;

      // Setelah registrasi berhasil, kita akan mengirim email verifikasi ke alamat email yang digunakan untuk registrasi 
      // dengan menggunakan sendEmailVerification(firebaseAuth.currentUser). 
      // Hal ini memastikan bahwa pengguna harus memverifikasi alamat email mereka sebelum dapat menggunakan akun mereka 
      // Jika email verifikasi berhasil terkirim, kita tampilkan pesan toast "Email verifikasi terkirim" kepada pengguna.
        await sendEmailVerification(firebaseAuth.currentUser)
        Toast.show("Email verifikasi terkirim", {
            duration: 3000,
            placement: 'bottom',
            type: 'success',
        });

      // Selanjutnya, kita membuat objek docRef yang berisi informasi pengguna, seperti userId, email, dan fullname.
      // Dengan menggunakan Firebase Firestore, kita menyimpan data pengguna ke koleksi "users" dengan menggunakan setDoc 
      // dan doc. Data ini akan disimpan dengan ID pengguna (userId) sebagai unique Id.
        const docRef = {
            userId: userId,
            email: dataRegister.email,
            fullname: dataRegister.fullname,
            alamat: dataRegister.alamat,
            gender: dataRegister.gender
        };

        console.log(docRef);

        await setDoc(doc(firestore, "users", userId), docRef);
        //const getId = auth.currentUser;
        // const userId = getId.uid;

        console.log("Register Success");

        // Jika registrasi berhasil tampilkan pesan toast berikut
        // lalu arahkan user ke halaman/screen login
        Toast.show("Register success please login", {
            duration: 3000,
            placement: 'bottom',
            type: 'success',
        });
        navigation.replace('Signin')
        } catch (error) {
        const errorMessage = error.message;
        Toast.show(errorMessage, {
        duration: 3000,
        placement: 'bottom',
        type: 'danger',
        });
    }
    };

    const [hidePassword, setHidePassword] = useState(true);
    const togglePasswordVisibility = () => {
        setHidePassword(!hidePassword);
    };

    return(
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 20, paddingLeft: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: '#FFF6E9', maxWidth: 480 }}>
                <View style={{ marginTop: '25%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: '600', color: '#004268' }}>
                        {i18n.t('create')}
                    </Text>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: '#6B7280', marginTop: 10 }}>
                        {i18n.t('come')}
                    </Text>
                </View>
                <View style={{ height: '70%', marginTop: '15%' }}>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#004268' }}>{i18n.t('yourn')}</Text>
                    <TextInput style={{ height: 48, width: 355, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 5, marginTop: 12, paddingHorizontal: 15, backgroundColor: 'white' }}
                        label={"Fullname"}
                        placeholder={"Enter FullName"}
                        invalid={!inputs.fullname.isValid}
                        onChangeText = {inputChangeHandler.bind(this, 'fullname')}
                    
                        />
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#004268' }}>{i18n.t('addres')}</Text>
                    <TextInput style={{ height: 48, width: 355, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 5, marginTop: 12, paddingHorizontal: 15, backgroundColor: 'white' }}
                        label={"Alamat"}
                        placeholder={"Enter Address"}
                        invalid={!inputs.alamat.isValid}
                        onChangeText = {inputChangeHandler.bind(this, 'alamat')}
                    
                        />
                        <Text style={{ marginTop: 5, fontSize: 16, color: '#004268' }}>{i18n.t('selectG')}</Text>
                        <View style={{ height: 48, width: 355, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 5, marginTop: 12, paddingHorizontal: 15, backgroundColor: 'white' }}>
                            <Picker
                            style={{ marginBottom: 5, fontSize: 16, color: '#004268' }}
                            selectedValue={inputs.gender.value}
                            onValueChange={(itemValue, itemIndex) =>
                            setInputs((prevState) => ({
                                ...prevState,
                                gender: { value: itemValue, isValid: true }
                            }))
                            }>
                            <Picker.Item label={i18n.t('selectG')} value={null} />
                            <Picker.Item label="Laki-laki" value={true} />
                            <Picker.Item label="Perempuan" value={false} />
                            </Picker>
                        </View>
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#004268' }}>{i18n.t('addEm')}</Text>
                    <TextInput style={{ height: 48, width: 355, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 5, marginTop: 12, paddingHorizontal: 15, backgroundColor: 'white' }}
                        label={"Email"}
                        placeholder={"Enter Email"}
                        keyboardType="email-address"
                        invalid={!inputs.email.isValid}
                        onChangeText= {inputChangeHandler.bind(this, 'email')}
                        
                    />
                    <Text style={{ marginTop: 5, fontSize: 16, color: '#004268' }}>Password</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TextInput style={{ flex: 1, height: 48, width: 320, borderColor: '#FFAC33', borderRadius: 10, borderWidth: 1, marginBottom: 10, marginTop: 10, paddingHorizontal: 15, paddingRight: 60, backgroundColor: 'white' }}
                            label={"Password"}
                            secureTextEntry = {hidePassword}
                            placeholder={"Enter password"}
                            invalid={!inputs.password.isValid}
                            onChangeText = {inputChangeHandler.bind(this, 'password')}
                        
                        />
                        <Pressable onPress={togglePasswordVisibility} style={{ position: 'relative', right: 50 }}>
                            <Ionicons name={hidePassword ? 'eye-outline' : 'eye-off-outline'} size={24} color="gray" />
                        </Pressable>
                    </View>

                    <Pressable style={{ justifyContent: 'center', height: 54, width: 355, alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, marginTop: 50, backgroundColor: '#FFAC33', borderRadius: 10 }} onPress={handleRegister}>
                        <Text style={{ fontSize: 20, fontWeight: '600', color: '#FFFFFF' }}>{i18n.t('regis')}</Text>
                    </Pressable>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 14, color: '#004268' }}>{i18n.t('already')} ?</Text>
                        <Pressable onPress={handleLogin}>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#004268', marginLeft: 5 }}>{i18n.t('signin')}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Signup;