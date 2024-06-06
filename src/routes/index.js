import { StyleSheet } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Signin from '../screens/auth/Signin'
import Signup from '../screens/auth/Signup'
import { NavigationContainer } from '@react-navigation/native'
import UpdateProfile from '../screens/users/UpdateProfile'
import Mainmenu from '../screens/users/Mainmenu'
import Filltrafodata from '../screens/users/Filltrafodata'
import Profil from '../screens/users/Profil'
import Gangguan from '../screens/users/Gangguan'
import Purifikasi from '../screens/users/Purifikasi'
import Umur from '../screens/users/Umur'
import Semua from '../screens/users/Semua'
import Hasil from '../screens/users/Hasil'

// Stack  adalah tumpukan navigator yang digunakan untuk mengelola navigasi di dalam aplikasi ini. 
// Ini adalah konfigurasi awal untuk stack navigator. dengan mengimpor Modul createStackNavigator kita akan membuat 
// tumpukan navigasi (stack navigator) yang mengelola navigasi antara berbagai tampilan.
const Stack = createStackNavigator()

// Dalam komponen Routes, ada NavigationContainer yang digunakan untuk membungkus seluruh tumpukan navigator. 
// Ini diperlukan untuk menyediakan navigasi di aplikasi.

// Di dalam Stack.Navigator, kita mendefinisikan rute-rute yang akan tersedia dalam aplikasi nantinya. 
// Setiap rute memiliki beberapa properti, seperti:
// name: Nama rute yang akan digunakan untuk merujuk rute dalam aplikasi.
// component: Komponen yang akan ditampilkan ketika rute dipilih.
// options: Opsi yang dapat digunakan untuk mengatur perilaku tampilan rute, dalam hal ini, 
// headerShown diatur sebagai false untuk menghilangkan header pada rute yang menampilkan screen login dan register.
const Routes = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name='Signin' component={Signin} options={{ headerShown: false }} />
                <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
                <Stack.Screen name="Profil" component={Profil} options={{ headerShown: false }}/>
                <Stack.Screen name='update-profile' component={UpdateProfile} options={{ headerShown: false }}/>
                <Stack.Screen name="Filltrafodata" component={Filltrafodata} options={{ headerShown: false }}/>
                <Stack.Screen name="Gangguan" component={Gangguan} options={{ headerShown: false }}/>
                <Stack.Screen name="Hasil" component={Hasil} options={{ headerShown: false }}/>
                <Stack.Screen name="Purifikasi" component={Purifikasi} options={{ headerShown: false }}/>
                <Stack.Screen name="Umur" component={Umur} options={{ headerShown: false }}/>
                <Stack.Screen name="Semua" component={Semua} options={{ headerShown: false }}/>
                <Stack.Screen name="Mainmenu" component={Mainmenu} options={{ headerShown: false }}/> 
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routes;
