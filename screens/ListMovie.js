import React, {Component} from 'react';
import {Dimensions, FlatList, Button, View, Text, StyleSheet, Modal, TouchableHighlight} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
class ListMovie extends Component {
    constructor(props) {
        super(props);
        this.props.navigation.setOptions({
            headerRight: () => (
                <Button onPress={this.listFav} title="Favorite" />
            ),
        });
        this.onPress=this.onPress.bind(this)
        this.state={data: [], ready: false, visible: false};
    }
    getMoviesFromApi=async () => {

        return fetch('https://api.themoviedb.org/3/movie/popular?api_key=b9ab4e0cb6b138dbfb0fd004149bef14&language=en-US&page=1')
            .then((response) => response.json())
            .then((json) => {
                return json.results;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async componentDidMount() {
        let data1=await this.getMoviesFromApi();
        this.setState({data: data1, ready: true})
    }
    onPress=(movie) => {
        //this.props.navigation.navigate('Movies');
        this.props.navigation.navigate('Detail', {movie: movie})
    }
    Item(movie) {
        return (
            <TouchableOpacity onPress={this.onPress.bind(this, movie)}>
                <View style={styles.item}>
                    <Text style={styles.title}>{movie.title.substring(0, 30)}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    favItem(movie, index) {

        return (
            <View style={{flexDirection: 'row-reverse'}}>
                <View style={{paddingHorizontal: 5}}><Text >{index+1}</Text></View>
                <View><Text style={{textAlign: 'left'}} >{movie.item.title}</Text></View>

            </View>

        );
    }
    listFav=() => {
        this.setState({visible: true});
    }

    render() {

        return (
            <View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.visible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <FlatList data={this.props.Favorite}
                                renderItem={({item, index}) => this.favItem(item, index)}
                                keyExtractor={(item, index) => item.item.id.toString()}

                            >


                            </FlatList>

                            <TouchableHighlight
                                style={{...styles.openButton, backgroundColor: "#2196F3"}}
                                onPress={() => {
                                    this.setState({visible: !this.state.visible});
                                }}
                            >
                                <Text style={styles.textStyle}>Close</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                <FlatList data={this.state.data}
                    renderItem={({item}) => this.Item(item)}
                    numColumns={2}
                    keyExtractor={item => item.id}
                ></FlatList>
            </View>

        );
    }
}
const styles=StyleSheet.create({
    centeredView: {
        flex: 0.6,
        justifyContent: "center",
        alignItems: "center",

    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },

    title: {

    },
    item: {
        backgroundColor: '#F5FCFF',
        padding: 1,
        margin: 6,
        height: 40,
        borderWidth: 1,
        width: Dimensions.get('window').width/2-20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shareText: {
        fontSize: 20,
        margin: 10,
    },
});

function mapStateToProps(state) {


    return {
        Favorite: state.Favorite.Favorite
    };
}
function matchDispatchToProps(dispatch) {
    return {
        dispatchAddFavorite: (favorite) => dispatch(addFavorite(favorite)),
        dispatchDeleteFavorite: (favorite) => dispatch(deleteFavorite(favorite))
    }
}
export default connect(mapStateToProps, matchDispatchToProps)(ListMovie);