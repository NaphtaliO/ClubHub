import _ from 'lodash';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { Button as RNPButton } from 'react-native-paper';
import { Avatar, Button, Divider, Layout, Text } from '@ui-kitten/components';
import { RateBar } from '../../../components/rate-bar.component';
import { ProfileSocial } from '../../../components/profile-social.component';
import { ProfileParameterCard } from '../../../components/profile-parameter-card.component';
import { ArrowHeadDownIcon, ArrowHeadUpIcon } from '../../../components/icons';
import { URL, VERSION } from '@env';
import { useLogout } from '../../../hooks/useLogout';
import { ClubProfileScreen, Club } from '../../../types/types';
import { Assets, Colors, TabController, TabControllerImperativeMethods, TabControllerItemProps, View } from 'react-native-ui-lib';
import { logIn } from '../../../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomImage from '../../../components/CustomImage';

const ClubProfile = ({ route }: ClubProfileScreen) => {
    const { id } = route.params;
    const [loading, setLoading] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const user = useAppSelector((state) => state.user.value);
    const [club, setClub] = useState<Club>();
    const { logout } = useLogout();
    const dispatch = useAppDispatch();

    const [asCarousel, setAsCarousel] = useState(true);
    const [centerSelected, setCenterSelected] = useState<boolean>(false);
    const [fewItems, setFewItems] = useState<boolean>(false);
    const [initialIndex, setInitialIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [key, setKey] = useState(Date.now());
    const tabController = React.createRef<TabControllerImperativeMethods>();

    const TABS = ['Home', 'Posts'];

    const generateTabItems = (fewItems: any): TabControllerItemProps[] => {
        // @ts-expect-error
        const items: TabControllerItemProps[] = _.flow(tabs => _.take(tabs, fewItems ? 2 : TABS.length),
            (tabs: TabControllerItemProps[]) =>
                _.map<TabControllerItemProps>(tabs, (tab: TabControllerItemProps, index: number) => ({
                    label: tab,
                    key: tab,
                    icon: index === 2 ? <Text>hi</Text> : undefined,
                    badge: index === 5 ? { label: '2' } : undefined,
                    leadingAccessory: index === 3 ? <Text marginR-4>{Assets.emojis.movie_camera}</Text> : undefined,
                    trailingAccessory: index === 4 ? <Text marginL-4>{Assets.emojis.camera}</Text> : undefined
                })))(TABS);

        return fewItems ? items : [...items];
    };

    const [items, setItems] = useState(generateTabItems(false));

    const getClubProfile = async () => {
        try {
            const response = await fetch(`${URL}/api/${VERSION}/user/getClubProfile/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
                // Alert.alert(`${json.message}`, '', [
                //     { text: 'OK', onPress: () => navigation.goBack() },
                // ]);
            }
            if (response.ok) {
                setClub(json.profile);
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    const joinClub = async () => {
        try {
            const response = await fetch(`${URL}/api/${VERSION}/user/joinClub/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user?.token}`
                }
            });
            const json = await response.json();
            if (!response.ok) {
                if (json.error === "Request is not authorized") {
                    logout()
                }
            }
            if (response.ok) {
                setClub(json.club);
                const updatedUser = { ...json.student, token: user?.token };
                dispatch(logIn(updatedUser));
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    useEffect(() => {
        setLoading(true);
        getClubProfile();
        setLoading(false);
    }, [])

    const onRefresh = () => {
        setRefreshing(true);
        getClubProfile();
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
            <Layout style={styles.container} level='2' >
                <Layout style={styles.header} level='1'>
                    <View style={styles.profileContainer}>
                        <CustomImage style={styles.profileAvatar} uri={`${club?.avatar}`} />
                        <View style={styles.profileDetailsContainer}>
                            <Text category='h4'>{club?.name}</Text>
                            <Text appearance='hint' category='s1'>{club?.location}</Text>
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
                        onPress={joinClub}>
                        JOIN
                    </Button>
                    {/* <RNPButton mode="contained"
                        style={styles.followButton}
                        onPress={() => { }}
                        loading={loading}>
                        {club?.members.includes(user._id)}
                    </RNPButton> */}
                    <Text
                        style={styles.descriptionText}
                        appearance='hint'>
                        {club?.bio}
                    </Text>
                </Layout>
                <View style={styles.profileParametersContainer}>
                    <View style={styles.profileSocialsSection}>
                        <ProfileSocial
                            style={styles.profileSocialContainer}
                            hint='Members'
                            value={`${club?.members.length}`}
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
        // <View flex bg-$backgroundDefault>
        //     <TabController
        //         key={key}
        //         ref={tabController}
        //         asCarousel={asCarousel}
        //         initialIndex={initialIndex}
        //         onChangeIndex={(selectedIndex: number) => setSelectedIndex(selectedIndex)}
        //         items={items}
        //     >
        //         <TabController.TabBar
        //             // items={items}
        //             key={key}
        //             // uppercase
        //             // indicatorStyle={{backgroundColor: 'green', height: 3}}
        //             // indicatorInsets={0}
        //             spreadItems={!fewItems}
        //             backgroundColor={fewItems ? 'transparent' : undefined}
        //             // labelColor={'green'}
        //             // selectedLabelColor={'red'}
        //             labelStyle={styles.labelStyle}
        //             selectedLabelStyle={styles.selectedLabelStyle}
        //             // iconColor={'green'}
        //             // selectedIconColor={'blue'}
        //             enableShadow
        //             activeBackgroundColor={Colors.$backgroundPrimaryMedium}
        //             centerSelected={centerSelected}
        //         />
        //         <TabController.PageCarousel>
        //             <TabController.TabPage index={0}>
        //                 <View flex>
        //                     <Text>
        //                         Home
        //                     </Text>
        //                 </View>
        //             </TabController.TabPage>
        //             <TabController.TabPage index={1}>
        //                 <View style={{ flex: 1 }}>
        //                     <Text>
        //                         Posts
        //                     </Text>
        //                 </View>
        //             </TabController.TabPage>
        //         </TabController.PageCarousel>
        //     </TabController>
        // </View>
    )
}

export default ClubProfile;

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
    labelStyle: {
        fontSize: 16
    },
    selectedLabelStyle: {
        fontSize: 16
    }
});