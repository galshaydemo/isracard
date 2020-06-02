import React, {Component} from 'react';
import {Dimensions, FlatList, View, Text, StyleSheet} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler';

class ListMovie extends Component {
    constructor(props) {
        super(props);
        this.onPress=this.onPress.bind(this)
        this.state={data: [], ready: false};
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

    render() {
        return (
            <FlatList data={this.state.data} keyExtractor={"id"}
                renderItem={({item}) => this.Item(item)}
                numColumns={2}
                keyExtractor={item => item.id}
            ></FlatList>

        );
    }
}
const styles=StyleSheet.create({
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


export default ListMovie;