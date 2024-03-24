import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button, Divider, Layout, Text } from '@ui-kitten/components'
import CustomImage from '../../../components/CustomImage'
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks'
import { ProfileSocial } from '../../../components/profile-social.component'
import { ArrowHeadUpIcon } from '../../../components/icons'
import { ProfileParameterCard } from '../../../components/profile-parameter-card.component'
import { StudentProfileScreenProps } from '../../../types/types'
import { useLogout } from '../../../hooks/useLogout'
import { URL, VERSION } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { logIn } from '../../../redux/userSlice'
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const Profile = ({ navigation }: StudentProfileScreenProps) => {
  const user = useAppSelector((state) => state.user.value);
  const [refreshing, setRefreshing] = useState(false);
  const { logout } = useLogout();
  const dispatch = useAppDispatch();

  const refreshUser = async () => {
    try {
      const response = await fetch(`${URL}/api/${VERSION}/user/refreshUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        }
      })
      const json = await response.json();
      const refreshedUser = { ...json, token: user?.token }

      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(refreshedUser));
        dispatch(logIn(refreshedUser));
      }
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    refreshUser();
    setRefreshing(false);
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh} />
      }
    >
      <Layout style={styles.container} level='2' >
        <Layout style={styles.header} level='1'>
          <View style={styles.profileContainer}>
            {!user?.avatar ? <Image
              style={styles.profileAvatar}
              source={require('../../../assets/default_avatar.png')}
            /> : 
              <CustomImage style={styles.profileAvatar} uri={`${user?.avatar}`} />}
            <View style={styles.profileDetailsContainer}>
              <Text category='h4'>{user?.name}</Text>
            </View>
          </View>
          <Button
            style={styles.followButton}
            onPress={() => navigation.navigate('EditStudentProfile')}
          >
            EDIT PROFILE
          </Button>
          <Text
            style={styles.descriptionText}
            appearance='hint'>
            {user?.bio}
          </Text>
          {user?.website ?
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Feather name="link" size={15} color="black" style={{paddingRight: 5}} />
              {/* <TouchableOpacity onPress={() => WebBrowser.openBrowserAsync(user.website)} > */}
                <Text style={{ color: '#2155CD' }}>{user?.website}</Text>
              {/* </TouchableOpacity> */}
            </View>
            : null}
        </Layout>
        <View style={styles.profileParametersContainer}>
          <View style={styles.profileSocialsSection}>
            
          </View>
          <Divider style={styles.profileSectionsDivider} />
          <View style={styles.profileParametersSection}>
            
          </View>
        </View>
      </Layout>
    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
  },
  profileAvatar: {
    marginHorizontal: 8,
    width: 65,
    height: 65,
    borderRadius: 50
  },
  profileDetailsContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  rateBar: {
    marginTop: 24,
  },
  followButton: {
    marginTop: 24,
  },
  descriptionText: {
    marginTop: 24,
    marginBottom: 8,
  },
  profileParametersContainer: {
    flexDirection: 'row',
    marginVertical: 24,
    marginHorizontal: 8,
  },
  profileSectionsDivider: {
    width: 1,
    height: '100%',
    marginHorizontal: 8,
  },
  profileSocialsSection: {
    marginHorizontal: 16,
  },
  profileSocialContainer: {
    flex: 1,
  },
  profileParametersSection: {
    flex: 1,
    marginHorizontal: 16,
  },
  profileParameter: {
    marginBottom: 16,
  }
})