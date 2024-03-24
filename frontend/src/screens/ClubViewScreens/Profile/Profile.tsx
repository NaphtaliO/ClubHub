import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { ClubProfileScreenProps, } from '../../../types/types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logIn } from '../../../redux/userSlice';
import { Avatar, Button, Divider, Layout, Text } from '@ui-kitten/components';
import { ProfileSocial } from '../../../components/profile-social.component';
import { ProfileParameterCard } from '../../../components/profile-parameter-card.component';
import { ArrowHeadDownIcon, ArrowHeadUpIcon } from '../../../components/icons';
import CustomImage from '../../../components/CustomImage';

const Profile = ({ navigation }: ClubProfileScreenProps): React.ReactElement => {
  const user = useAppSelector((state) => state.user.value);
  const dispatch = useAppDispatch();
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
  //TODO Add website to profile
  //TODO Fix logout button
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
            <CustomImage style={styles.profileAvatar} uri={`${user?.avatar}`} />
            <View style={styles.profileDetailsContainer}>
              <Text category='h4'>{user?.name}</Text>
              <Text appearance='hint' category='s1'>{user?.location}</Text>
              {/* TODO: fix this */}
              {/* <RateBar
              style={styles.rateBar}
              hint='Experience'
              value={rating}
              onValueChange={setRating}
            /> */}
            </View>
          </View>
          <Button
            style={styles.followButton}
            onPress={() => navigation.navigate('EditClubProfile')}>
            EDIT PROFILE
          </Button>
          <Text
            style={styles.descriptionText}
            appearance='hint'>
            {user?.bio}
          </Text>
        </Layout>
        <View style={styles.profileParametersContainer}>
          <View style={styles.profileSocialsSection}>
            <ProfileSocial
              style={styles.profileSocialContainer}
              hint='Members'
              value={`${user?.members?.length}`}
            />
            {/* <ProfileSocial
            style={styles.profileSocialContainer}
            hint='Following'
            value={`${profile.following}`}
          />
          <ProfileSocial
            style={styles.profileSocialContainer}
            hint='Posts'
            value={`${profile.posts}`}
          /> */}
          </View>
          <Divider style={styles.profileSectionsDivider} />
          <View style={styles.profileParametersSection}>
            <ProfileParameterCard
              style={styles.profileParameter}
              hint='Rank'
              value={`${1}`}
              icon={ArrowHeadUpIcon}
            />
            {/* <ProfileParameterCard
            style={styles.profileParameter}
            hint='Weight'
            value={`${profile.weight} kg`}
            icon={ArrowHeadDownIcon}
          /> */}
          </View>
        </View>
      </Layout>
    </ScrollView>
  );
}

export default Profile;

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
  },
});