import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TouchableHighlight, View, Button, TouchableOpacity, Image} from 'react-native';
import {LoginButton, ShareDialog, AccessToken} from 'react-native-fbsdk';
import {increment, decrement} from '../actions/index.js';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-community/google-signin';
const SHARE_LINK_CONTENT={
    contentType: 'link',
    contentUrl: 'https://www.facebook.com/',
};

class Home extends Component {
    constructor(props) {
        GoogleSignin.configure();

        super(props);
        this.state={isSigninInProgress: false, googleReady: false, facebookReady: false, connect: false}
    }
    componentDidMount() {
        this.googleCheck();

    }

    _shareLinkWithShareDialog=async () => {
        const canShow=await ShareDialog.canShow(SHARE_LINK_CONTENT);
        if(canShow) {
            try {
                const {isCancelled, postId}=await ShareDialog.show(
                    SHARE_LINK_CONTENT,
                );
                if(isCancelled) {
                    Alert.alert('Share cancelled');
                } else {
                    Alert.alert('Share success with postId: '+postId);
                }
            } catch(error) {
                Alert.alert('Share fail with error: '+error);
            }
        }
    };
    getCurrentUserInfo=async () => {
        try {
            const userInfo=await GoogleSignin.signInSilently();
            this.setState({userInfo});
        } catch(error) {
            if(error.code===statusCodes.SIGN_IN_REQUIRED) {
                // user has not signed in yet
            } else {
                // some other error
            }
        }
    };
    isSignedIn=async () => {
        const isSignedIn=await GoogleSignin.isSignedIn();

        this.setState({isLoginScreenPresented: !isSignedIn, googleLogin: isSignedIn, googleReady});
    };
    getCurrentUser=async () => {
        const currentUser=await GoogleSignin.getCurrentUser();

        this.setState({currentUser});
    };
    googleCheck=async () => {
        const isSignedIn=await GoogleSignin.isSignedIn();
        const currentUser=await GoogleSignin.getCurrentUser();
        console.log('isSignedIn'+isSignedIn);
        console.log(currentUser);
        let c=false;
        if(isSignedIn) c=true
        this.setState({googleUser: currentUser, googleReady: true, googleSign: isSignedIn, connect: true});

    }
    signOut=async () => {
        console.log('sign out')
        try {
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
            this.setState({user: null, googleSign: false}); // Remember to remove the user from your app's state as well
        } catch(error) {
            console.error(error);
        }
    };
    revokeAccess=async () => {
        try {
            await GoogleSignin.revokeAccess();
            console.log('deleted');
        } catch(error) {
            console.error(error);
        }
    };

    signIn=async () => {
        console.log('sign in')
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo=await GoogleSignin.signIn();
            this.setState({userInfo, googleSign: true});
        } catch(error) {

            if(error.code===statusCodes.SIGN_IN_CANCELLED) {
                alert('Canceled');
            } else if(error.code===statusCodes.IN_PROGRESS) {
                alert('IN_PROGRESS');
            } else if(error.code===statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                alert('Not Available');
            } else {
                alert(JSON.stringify(error));
            }
        }
    };
    hasPlayServices=async () => {
        try {
            await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
            // google services are available
        } catch(err) {
            console.error('play services are not available');
        }
    }
    notLogin=() => {
        return (<View>

            <View><Text style={{fontSize: 20}}>Welcome Stranger</Text></View>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Image
                    source={require('./../images/nologin1.png')}
                    style={{width: 80, height: 80, borderRadius: 80/2}}
                />

            </View>

            <View style={{marginVertical: 10}}><Text style={{textAlign: 'center'}}>Please Login to continue</Text></View>
            <View style={{marginVertical: 10}}><Text style={{textAlign: 'center'}}>to the awsomeness</Text></View>
        </View>)
    }
    gotoList=() => {
        this.props.navigation.navigate('Movies');
    }
    googleLogin=() => {
        return (
            <View>
                <View>
                    <Text>Welcome {this.state.googleUser? this.state.googleUser.user.givenName:''}</Text>
                    <Image
                        source={this.state.googleUser? {uri: this.state.googleUser.user.photo}:require('./../images/nologin1.png')}
                        style={{width: 80, height: 80, borderRadius: 80/2}}
                    />
                </View>
                <TouchableOpacity onPress={this.gotoList}>
                    <View style={{backgroundColor: '#dddddd', width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center'}}>
                        <Text >רשימת סרטים</Text>
                    </View>
                </TouchableOpacity>

            </View>)

    }
    initUser(token) {
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token='+token)
            .then((response) => response.json())
            .then((json) => {
                alert(JSON.stringify(json))
                // Some user object has been set up somewhere, build that user here
                user.name=json.name
                user.id=json.id
                user.user_friends=json.friends
                user.email=json.email
                user.username=json.name
                user.loading=false
                user.loggedIn=true
                user.avatar=setAvatar(json.id)
            })
            .catch(() => {
                reject('ERROR GETTING DATA FROM FACEBOOK')
            })
    }
    render() {

        console.log(this.state.googleSign)
        return (
            <View style={styles.container}>


                {!this.state.googleSign? this.notLogin():this.googleLogin()}

                <View style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    bottom: 40,
                    left: 20,

                }}>
                    <LoginButton
                        publishPermissions={['publish_actions']}
                        readPermissions={['public_profile']}
                        onLoginFinished={
                            (error, result) => {
                                console.log('result')
                                console.log(result)
                                if(error) {
                                    alert('fff')
                                    console.log("login has error: "+result.error);
                                } else if(result.isCancelled) {
                                    console.log("login is cancelled.");
                                } else {
                                    AccessToken.getCurrentAccessToken().then(
                                        (data) => {
                                            alert('token');
                                            console.log(data.accessToken.toString())
                                            this.initUser(data.accessToken.toString())
                                        }
                                    )
                                }
                            }
                        }
                        onLogoutFinished={() => console.log("logout.")} />
                    {!this.state.googleSign?
                        <TouchableOpacity onPress={this.signIn} style={{
                            backgroundColor: '#ff0000', height: 32,
                            borderBottomEndRadius: 5,
                            borderBottomStartRadius: 5,
                            borderTopEndRadius: 5,
                            padding: 4,
                            borderTopStartRadius: 5,
                            marginLeft: 10,
                        }}>
                            <Text style={{color: '#ffffff'}}>
                                Or With Google</Text>
                        </TouchableOpacity>:
                        <TouchableOpacity onPress={this.signOut} style={{
                            backgroundColor: '#ff0000', height: 32,
                            borderBottomEndRadius: 5,
                            borderBottomStartRadius: 5,
                            borderTopEndRadius: 5,
                            padding: 4,
                            borderTopStartRadius: 5,
                            marginLeft: 10,
                        }}>
                            <Text style={{color: '#ffffff'}}>Log out from google</Text>
                        </TouchableOpacity>
                    }

                </View>
            </View>
        );
    }
}
const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    shareText: {
        fontSize: 20,
        margin: 10,
    },
});

export default Home;