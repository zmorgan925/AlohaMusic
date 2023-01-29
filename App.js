import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

const playlist = [
  {
    title: 'Ukulele',
    uri: 'C:/Users/zmorg/AlohaMusic/assets/music/ukulele.mp3'
  }
];

const ukuleleImage = require('./assets/images/ukulele.png');

export default class App extends Component {
  state = {
    isPlaying: false,
    playbackInstance: null,
    volume: 1.0,
    currentTrackIndex: 0,
    isBuffering: false,
  }

	async componentDidMount() {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    this.loadAudio();
  }

  handlePlayPause = async () => {
    const { isPlaying, playbackInstance } = this.state;
    isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync();
    this.setState({
      isPlaying: !isPlaying
    });
  }

  async loadAudio() {
    const playbackInstance = new Audio.Sound();
    const source = {
      uri: playlist[0].uri
    }
		const status = {
			shouldPlay: this.state.isPlaying,
			volume: this.state.volume,
    };
    playbackInstance
      .setOnPlaybackStatusUpdate(
        this.onPlaybackStatusUpdate
      );
    await playbackInstance.loadAsync(source, status, false);
    this.setState({
      playbackInstance
    });
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.heading}>
        <Text style={styles.headerText}>Aloha Music</Text>
        </View>
        <View>
        <Image source={ukuleleImage} style={styles.images} />
        </View>
        <TouchableOpacity
            style={styles.control}
            onPress={this.handlePlayPause}
          >
            {this.state.isPlaying ?
              <Feather name="pause" size={32} color="#000000"/> :
              <Feather name="play" size={32} color="#000000"/>
            }
          </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4e3cf',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading: {
    width: 300,
    backgroundColor: '#da9547',
  },
  images: {
    height: 500,
    width: 300,
    marginTop: 40,
    marginBottom: 30,
  }
});
