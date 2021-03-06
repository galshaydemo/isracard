import React, {Component} from 'react';
import {Alert, StyleSheet, Text, TouchableHighlight, View, Button, TouchableOpacity, Image} from 'react-native';
import {LoginButton, ShareDialog, AccessToken} from 'react-native-fbsdk';

import {
    GoogleSignin,
    statusCodes,
} from '@react-native-community/google-signin';
const SHARE_LINK_CONTENT={
    contentType: 'link',
    contentUrl: 'https://www.facebook.com/',
};

class Home extends Component {
    constructor(props) {
        GoogleSignin.configure({scopes: ['https://www.googleapis.com/auth/userinfo.profile']});

        super(props);
        this.state={isSigninInProgress: false, googleReady: false, facebookReady: false, connect: false, name: '', facebookLogin: false}
    }
    componentDidMount() {
        this.googleCheck();
        AccessToken.getCurrentAccessToken().then(
            (data) => {
                if(data!=null)
                    this.initUser(data.accessToken.toString())
            } //Refresh it every time
        );

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
        if(isSignedIn) {
            const currentUser=await GoogleSignin.getCurrentUser();
            console.log(currentUser)
            this.setState({googleUser: currentUser, googleReady: true, googleSign: isSignedIn, name: currentUser.user.givenName});
        }

    }
    signOut=async () => {
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
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo=await GoogleSignin.signIn();
            this.setState({userInfo, googleSign: true, name: userInfo.user.givenName});
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

            <View style={styles.welcomeView}><Text style={styles.welcomeText}>Welcome Stranger</Text></View>
            <View style={styles.imageViewUser}>
                <Image
                    source={require('./../images/nologin1.png')}
                    style={styles.imageUser}
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
                    <View style={styles.welcomeView}><Text style={styles.welcomeText}>Welcome {this.state.name}</Text></View>
                    <View style={styles.imageViewUser}>
                        <Image
                            source={this.state.googleUser&&this.state.googleUser.user&&this.state.googleUser.user.photo? {uri: this.state.googleUser.user.photo}:require('./../images/nologin1.png')}
                            style={styles.imageUser}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={this.gotoList}>
                    <View style={styles.buttonList}>
                        <Text style={styles.buttonListText} >רשימת סרטים</Text>
                    </View>
                </TouchableOpacity>

            </View>)

    }
    initUser(token) {
        fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token='+token)
            .then((response) => response.json())
            .then((json) => {
                this.setState({name: json.name, facebookLogin: true})
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
                console.log('ERROR GETTING DATA FROM FACEBOOK')
            })
    }
    render() {


        return (
            <View style={styles.container}>

                <Image source={require('./../images/Movie.jpg')} />
                {!this.state.googleSign&&!this.state.facebookLogin? this.notLogin():this.googleLogin()}


                <LoginButton
                    publishPermissions={['publish_actions']}
                    readPermissions={['public_profile']}
                    onLoginFinished={
                        (error, result) => {
                            if(error) {
                                console.log("login has error: "+result.error);
                            } else if(result.isCancelled) {
                                console.log("login is cancelled.");
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                    (data) => {
                                        this.initUser(data.accessToken.toString())
                                    }
                                )
                            }
                        }
                    }
                    onLogoutFinished={() => this.setState({name: '', facebookLogin: false})} />
                {!this.state.googleSign?
                    <TouchableOpacity onPress={this.signIn} style={styles.googleButton}>
                        <Text style={{color: '#ffffff'}}>
                            Or With Google</Text>
                    </TouchableOpacity>:
                    <TouchableOpacity onPress={this.signOut} style={styles.googleButton}>
                        <Text style={{color: '#ffffff'}}>Log out</Text>
                    </TouchableOpacity>
                }


            </View>
        );
    }
}
const styles=StyleSheet.create({
    container: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    googleButtonText:
    {
        color: '#ffffff',
        textAlign: 'center'
    },
    googleButton:
    {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff0000',
        height: 32,
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        borderTopEndRadius: 5,
        padding: 2,
        borderTopStartRadius: 5,
        width: 200,
        marginTop: 10,

    },
    welcomeView:
    {
        marginBottom: 10,
    },
    welcomeText:
    {
        fontSize: 20,
    },
    shareText: {
        fontSize: 20,
        margin: 10,
    },
    imageViewUser:
    {
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageUser:
    {
        width: 80,
        height: 80,
        borderRadius: 80/2
    },
    buttonListText:
    {
        fontWeight: 'bold',
        fontSize: 20,
    },
    buttonList:
    {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#20dd20',
        width: 200,
        height: 60,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 10,

    }
});

export default Home;
