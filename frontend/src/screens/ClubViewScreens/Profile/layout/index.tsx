import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Divider, Layout, Text } from '@ui-kitten/components';
import { RateBar } from '../../../../components/rate-bar.component';;
import { ProfileSocial } from '../../../../components/profile-social.component';;
import { ProfileParameterCard } from '../../../../components/profile-parameter-card.component';;
import { ArrowHeadDownIcon, ArrowHeadUpIcon } from '../../../../components/icons';
// import { Profile } from './extra/data';
import { Club } from '../../../../types/types';

type Prop = {
  user: Club
 }

export default ({ user }: Prop): React.ReactElement => {

  // const [rating, setRating] = React.useState<number>(profile.experience);

  return (
    <Layout style={styles.container} level='2' >
      <Layout style={styles.header} level='1'>
        <View style={styles.profileContainer}>
          <Avatar
            style={styles.profileAvatar}
            size='giant'
            source={{ uri: user.avatar }}
          />
          <View style={styles.profileDetailsContainer}>
            <Text category='h4'>{user.name}</Text>
            <Text appearance='hint' category='s1'>{user.location}</Text>
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
          onPress={() => {}}>
          EDIT PROFILE
        </Button>
        <Text
          style={styles.descriptionText}
          appearance='hint'>
          {user.bio}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  profileContainer: {
    flexDirection: 'row',
  },
  profileAvatar: {
    marginHorizontal: 8,
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
