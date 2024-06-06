import React, { useEffect, useLayoutEffect, useState } from 'react'
import { firebaseAuth, firestore } from '../../config/firebase'
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { destroyKey, getKey } from '../../config/localStorage'
// import { Image } from 'expo-image'
import { doc, getDoc } from 'firebase/firestore';
import { useIsFocused } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';


const menuItems = [
    { id: '1', label: 'Umur', imageSource: require('../../../assets/HourglassTop.png') },
    { id: '2', label: 'Purifikasi', imageSource: require('../../../assets/Purifikasi.png') },
    { id: '3', label: 'Gangguan', imageSource: require('../../../assets/ExclamationCircleFill.png') },
    { id: '4', label: 'Semua', imageSource: require('../../../assets/GearWideConnected.png') },
];

const Mainmenu = ({navigation, route}) => {
    const { userId } = route.params;
    const [dataUsers, setDataUsers] = useState([])
    const isFocused = useIsFocused();
    const { selectedMenuId } = route.params || {};
    const [isLoading, setIsLoading] = useState(false);
    const [currentMenuId, setCurrentMenuId] = useState(selectedMenuId);

    useEffect(() => {
        setIsLoading(true)
        const docRef = doc(firestore, "users", userId)
        getDoc(docRef).then((doc) => {
        setDataUsers(doc.data())
        }).finally(() => {
        setIsLoading(false)
        })
    }, [userId]);

    console.log(dataUsers);

    useEffect(() => {
        setCurrentMenuId(selectedMenuId);
    }, [selectedMenuId]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: null
        })
    }, [isFocused, userId]);

    const navigateTo = (itemId) => {
        setCurrentMenuId(itemId); // Perbarui currentMenuId
        navigation.navigate('Filltrafodata', { selectedMenuId: itemId, userId : userId });
    };

    const renderMenuItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateTo(item.id)} style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: 137, width: 142, paddingHorizontal: 8, paddingVertical: 4, margin: '4%', backgroundColor: '#FFAC33', borderRadius: 10 }}>
        <Image source={item.imageSource} style={{ width: 62, height: 62 }} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white', marginTop: 10 }}>{item.label}</Text>
    </TouchableOpacity>
    );

    const navigateToProfile = () => {
        navigation.replace('Profil', { userId: userId });
    };

    return(
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#FEEBC8' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 4, paddingRight: 2.5, paddingBottom: 40, paddingLeft: 5, width: '100%', backgroundColor: '#FFC107' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: '15%', marginLeft: '5%' }}>
            <Image
            source={{ uri: dataUsers.imageUri ? dataUsers.imageUri : `https://ui-avatars.com/api/?name=${dataUsers.fullname}` }}
            style={{ position: 'relative', marginTop: 10, width: 60, height: 60, borderRadius: 50 }}
            />
            <View style={{ flexDirection: 'column', marginTop: 12, marginLeft: 16 }}>
            <Text style={{ fontSize: 18, color: 'white' }}>Welcome Back</Text>
            {dataUsers ? (<Text style={{ marginTop: 2, fontSize: 20, fontWeight: '600', color: 'white' }}>{dataUsers.fullname}</Text>): (<View style={{ marginRight: '2%', marginTop: '15%' }}>
        <Text style={{ color: '#FFAC33', fontSize: 25, fontWeight: '600' }}>Loading...</Text>
        </View>)}
            </View>
        </View>
        <TouchableOpacity onPress={navigateToProfile} style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40,paddingTop: 40}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-end' }}>
            <Image
            source={require('../../../assets/setting.png')}
            style={{ marginTop: '4%', marginRight: '10%', width: 19, height: 20, tintColor: 'white' }}
            />
        </View>
        </TouchableOpacity>
        </View>

        <View style={{ marginRight: '2%', marginTop: '15%' }}>
        <Text style={{ color: '#FFAC33', fontSize: 25, fontWeight: '600' }}>Analisis Kesehatan Trafomu</Text>
        <Text style={{ marginTop: 3.5, color: '#FFAC33', fontSize: 18, textTransform: 'capitalize' }}>Pilih analisis sesuai kebutuhanmu</Text>
        </View>

        <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ marginTop: '15%', alignItems: 'center' }}
        numColumns={2}
        />

        <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 4, backgroundColor: '#FFC107', borderTopRightRadius: 11, borderTopLeftRadius: 11 }}>
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 2.5 }}>
            <Image
                source={require('../../../assets/Home.png')}
                style={{ width: 24, height: 24 }}
            />
            <Text style={{ marginTop: 5, fontSize: 14, fontWeight: 'bold', color: 'white' }}>Home</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={navigateToProfile} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, backgroundColor: '#FFD54F', height: 70, borderTopLeftRadius: 11 , borderTopRightRadius: 11}}>
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 2.5 }}>
            <Image
                source={require('../../../assets/Profile.png')}
                style={{ width: 24, height: 24 }}
            />
            <Text style={{ marginTop: 5, fontSize: 14, fontWeight: 'bold', color: '#424242' }}>Profile</Text>
            </View>
        </TouchableOpacity>
        </View>
    </View>

    )

}; 
export default Mainmenu;