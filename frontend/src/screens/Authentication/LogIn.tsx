import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import BackButton from '../../components/BackButton';
import { LogInScreenProps } from '../../types/types';
import { theme } from '../../Constants';
import { URL, VERSION } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { logIn } from '../../redux/userSlice';


export default function LogIn({ navigation }: LogInScreenProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const onLoginPressed = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await fetch(`${URL}/api/${VERSION}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const json = await response.json()

      if (!response.ok) {
        setError(json.error)
      }
      if (response.ok) {
        //save user to react native local storage
        await AsyncStorage.setItem('user', JSON.stringify(json))
        //update redux state
        dispatch(logIn(json));
      }
    } catch (e) {
      console.log((e as Error).message);
      // setError(e.message)
    }
    setLoading(false);
  }

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      {/* <Header>Welcome back.</Header> */}
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email}
        onChangeText={(text: string) => setEmail(text)}
        error={!!error}
        // errorText={error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password}
        onChangeText={(text: string) => setPassword(text)}
        error={!!error}
        // errorText={error}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.forgotPassword}>
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity> */}
      </View>
      <Button type="auth" mode="contained" onPress={onLoginPressed} loading={loading}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('CreateAccount')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
    alignSelf: 'flex-start'
  },
})