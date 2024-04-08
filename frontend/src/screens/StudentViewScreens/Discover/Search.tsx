import { StyleSheet, ActivityIndicator, FlatList, Text, View, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SearchBar } from '@rneui/themed';
import { useLogout } from '../../../hooks/useLogout';
import { URL, VERSION } from '@env';
import { useAppSelector } from '../../../hooks/hooks';
import SearchItem from '../../../components/SearchItem';
import { Ionicons } from '@expo/vector-icons';
import { SearchScreenProp } from '../../../types/types';

type ClubProp = {
  _id: string,
  avatar: string,
  members: string[],
  name: string
}

const Search = ({ navigation }: SearchScreenProp) => {
  const { logout } = useLogout();
  const user = useAppSelector((state) => state.user.value);
  const [users, setUsers] = useState<ClubProp[]>([]);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const searchUsers = async () => {
    if (text !== "" && !(text.trim().length === 0)) {
      setLoading(true);
      try {
        const response = await fetch(`${URL}/api/${VERSION}/user/search/${text.trim()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
        })
        const json = await response.json();
        if (!response.ok) {
          if (json.error === "Request is not authorized") {
            logout()
          }
        }
        if (response.ok) {
          setUsers(json);
        }

      } catch (error) {
        console.log((error as Error).message);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    searchUsers()
  }, [text])

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, width: '90%' }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={26}
            color="black"
            style={{}}
          />
        </TouchableOpacity>
        <SearchBar
          platform='ios'
          placeholder="Type Here..."
          onChangeText={setText}
          value={text}
          autoCorrect={false}
          clearTextOnFocus={false}
          onClear={() => { setText(''); setUsers([]) }}
          onCancel={() => { setText(''); setUsers([]) }}
        />
      </View>
      {loading ? <ActivityIndicator color={'black'} /> :
        users.length !== 0 && text !== '' ?
          <FlatList
            ListEmptyComponent={
              <View>
                <Text style={{ marginLeft: 'auto', marginRight: 'auto' }}>No results for "{text}"</Text>
              </View>
            }
            contentInsetAdjustmentBehavior="automatic"
            data={users}
            renderItem={({ item }) =>
              <>
                <SearchItem navigation={navigation} item={item} />
              </>

            }
            keyExtractor={item => item?._id} />
          :
          <Text style={{ marginLeft: 'auto', marginRight: 'auto', fontWeight: '500', fontSize: 20, marginTop: 20 }}>
            Search UCC Clubs and Societies
          </Text>
      }
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 50,
  },
  searchBar: {
    marginHorizontal: 20,
    marginVertical: 20,
  },
})