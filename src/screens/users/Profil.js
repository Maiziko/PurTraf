import React,{ useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth'
import { firebaseAuth, firestore } from '../../config/firebase'
import { destroyKey, getKey } from '../../config/localStorage'
import { doc, getDoc } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native'

const Profil = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [dataUsers, setDataUsers] = useState([]);
    const isFocused = useIsFocused();

    const handleLogout = () => {
        signOut(firebaseAuth).then(() => {
            destroyKey()
            navigation.replace('Signin')
        })
    }

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

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null
        })
    }, [isFocused, userId])



    // Pecobaan filltrafo data navigate (Jangan lupa dihapus)
    const navigateToHome = () => {
        navigation.replace('Mainmenu',{ userId: userId });
    }

    // Render Semua Komponen 
    return (
        <View style={{ flex: 1, flexDirection: 'column', paddingBottom: 20, marginHorizontal: 'auto', width: '100%', backgroundColor: '#FFF6E9', maxWidth: 480 }}>
      <Image
        source={require('../../../assets/vectoratProfile.png')}
        style={{ position: 'absolute', width: 395, height: 199 }}
      />
      <View style={{ marginTop: '10%', marginLeft: '4%' }}>
        <TouchableOpacity onPress={navigateToHome} style={{ position: 'absolute', top: 20, left: 5, borderRadius: 50, backgroundColor: '#FFFFFF', padding: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={{ marginTop: '10%', fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' }}>Profile</Text>
      <View style={{ flexDirection: 'column', alignItems: 'center', marginTop:'2%'}}>
                <Image
                    source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
                    style={{ position: 'relative', marginTop: 4, width: 80, height: 80, borderRadius: 50 }}
                />
                <View style={{ flexDirection: 'column', marginTop: 9 }}>
                    {dataUsers ? (<Text style={{textAlign: 'center', fontSize: 18, color: '#004268' }}>{dataUsers.fullname}</Text>) :(<Text style={{ color: '#FFAC33', fontSize: 25, fontWeight: '600' }}>Loading...</Text>)}
                    {dataUsers ? (<Text style={{ marginTop: 2, fontSize: 20, fontWeight: '500', color: '#004268' }}>{dataUsers.email}</Text>) : (<Text style={{ color: '#FFAC33', fontSize: 25, fontWeight: '600' }}>Loading...</Text>)}
                </View>
                <TouchableOpacity style={{ justifyContent: 'center',
                                    height: 40, width: 109,
                                    alignItems: 'center',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    marginTop: 20,
                                    backgroundColor: '#FFAC33',
                                    borderRadius: 50,}}
                                    onPress={() => navigation.navigate('update-profile', {
                                    userId: userId,
                                    fullname: dataUsers.fullname,
                                    imageUri: dataUsers.imageUri,
                                    alamat: dataUsers.alamat,
                                    gender: dataUsers.gender
                })}>

                                    <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#004268' }}>Edit Profil</Text>
                            </TouchableOpacity>
        </View>

        <Text style={{ marginLeft: '10%', marginTop: '10%', fontSize: 20, fontWeight: 'bold', color: '#004268', textAlign: 'justify' }}>Profile</Text>

        <View style={{ marginLeft: '10%' }}>
                
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 52, width: 310, paddingHorizontal: 8, paddingVertical: 4, marginTop: 15, backgroundColor: '#FFC97A', borderRadius: 10 }}>
                        <Text style={{ paddingLeft: 20, fontSize: 15, fontWeight: 'bold', color: '#004268' }}>{dataUsers.fullname}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 52, width: 310, paddingHorizontal: 8, paddingVertical: 4, marginTop: 15, backgroundColor: '#FFC97A', borderRadius: 10 }}>
                        <Text style={{ paddingLeft: 20, fontSize: 15, fontWeight: 'bold', color: '#004268' }}>{dataUsers.gender === true ? 'Laki-laki' : 'Perempuan'}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', height: 52, width: 310, paddingHorizontal: 8, paddingVertical: 4, marginTop: 15, backgroundColor: '#FFC97A', borderRadius: 10 }}>
                        <Text style={{ paddingLeft: 20, fontSize: 15, fontWeight: 'bold', color: '#004268' }}>{dataUsers.alamat}</Text>
                </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginBottom:'30%'}}>
                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', height: 52, width: 100, paddingHorizontal: 8, paddingVertical: 4, marginTop: 15, backgroundColor: '#DD310C', borderRadius: 10, }} onPress={handleLogout}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#ffffff' }}>Log Out</Text>
                    </TouchableOpacity>
                </View>

      <View style={{ flexDirection: 'row', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <TouchableOpacity onPress={navigateToHome} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 4, backgroundColor: '#FFC107', borderTopRightRadius: 10 }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 2.5 }}>
            <Image
              source={require('../../../assets/Home.png')}
              style={{ width: 24, height: 24 }}
            />
            <Text style={{ marginTop: 10, fontSize: 14, fontWeight: 'bold', color: 'white' }}>Home</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, backgroundColor: '#FFD54F', height: 90, borderTopLeftRadius: 10 }}>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 2.5 }}>
            <Image
              source={require('../../../assets/Profile.png')}
              style={{ width: 24, height: 24 }}
            />
            <Text style={{ marginTop: 10, fontSize: 14, fontWeight: 'bold', color: '#424242' }}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
    )
}

export default Profil;