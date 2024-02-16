import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import ContentView from './layout';
import { ClubViewProfileScreenProps, User } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logIn } from '../../../redux/userSlice';

const Profile = ({ navigation }: ClubViewProfileScreenProps): React.ReactElement => {
  const user = useAppSelector((state) => state.user.value);
  const dispatch = useAppDispatch()
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { logout } = useLogout();

  const refreshUser = async () => {
    try {
      const response = await fetch(`${URL}/api/${VERSION}/user/refreshUser`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        }
      })
      const json = await response.json()
      const refreshedUser = { ...json, token: user?.token }
      if (!response.ok) {
        if (json.error === "Request is not authorized") {
          logout()
        }
      }
      if (response.ok) {
        await AsyncStorage.setItem('user', JSON.stringify(refreshedUser))
        dispatch(logIn(refreshedUser))
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
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh} />
      }
    >
      <ContentView navigation={navigation} user={user} />
    </ScrollView>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
  },
});