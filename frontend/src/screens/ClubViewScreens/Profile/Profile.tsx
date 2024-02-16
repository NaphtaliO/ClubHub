import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ContentView from './layout';
import { ClubViewProfileScreenProps, User } from '../../../types/types';
import { useAppSelector } from '../../../hooks/hooks';

const Profile = ({ navigation }: ClubViewProfileScreenProps): React.ReactElement => {
  const user = useAppSelector((state) => state.user.value);

  

  return (
      <ContentView navigation={navigation} user={user} />
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'white'
  },
});