import React, {Component} from 'react';
import {Image, Dimensions, Button, View, Text, StyleSheet, TouchableNativeFeedback} from "react-native";
import {connect} from 'react-redux';
import {addFavorite, deleteFavorite} from '../actions/index';
import {TouchableOpacity} from 'react-native-gesture-handler';
class Detail extends Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {

    }
    decrementCount(movie) {
        this.props.dispatchDeleteFavorite(movie)
    }
    incrementCount(movie) {
        this.props.dispatchAddFavorite({
            item: movie,
        });

    }
    add=() => {
        alert('add');
    }
    render() {
        //const f=this.props.find(this.props.route.params.movie)
        const f=this.props.Favorite.findIndex(k => k.item.id==this.props.route.params.movie.id);
        const x="https://image.tmdb.org/t/p/w220_and_h330_face"+this.props.route.params.movie.poster_path
        return (
            <View>

                <View><Text style={styles.title}>{this.props.route.params.movie.title}</Text></View>
                <View style={styles.image}><Image style={{height: 330, width: 220}} source={{uri: x}}></Image></View>
                <View style={styles.overview}><Text style={styles.overviewText}>{this.props.route.params.movie.overview}</Text></View>
                <View style={styles.rankView}><View style={styles.rankTextView}><Text style={styles.rankText}>Rank:</Text></View><Text>{this.props.route.params.movie.vote_average}</Text></View>
                <TouchableNativeFeedback onPress={this.add}>
                    <Text>{this.props.count}</Text>
                </TouchableNativeFeedback>
                {f>-1?
                    <TouchableOpacity onPress={() => this.decrementCount(this.props.route.params.movie)}>
                        <Text style={styles.addFavorite}>Remove from favorite
                    </Text>


                    </TouchableOpacity>:
                    <TouchableOpacity onPress={() => this.incrementCount(this.props.route.params.movie)}>
                        <Text style={styles.addFavorite}>
                            Add to Favorite
            </Text>


                    </TouchableOpacity>
                }

            </View>
        );
    }
}
const styles=StyleSheet.create({
    rankTextView:
    {

        paddingEnd: 10,

    },
    rankText:
    {
        fontWeight: 'bold',
        paddingEnd: 10,
        color: '#ff0000'
    },
    rankView:
    {
        marginTop: 10,
        flexDirection: 'row'
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        padding: 4,
        margin: 4

    },
    overviewText:
    {

    },
    image: {
        justifyContent: 'center',
        alignItems: 'center'
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
    addFavorite:
    {
        width: 190, backgroundColor: '#000080', color: '#ffffff', padding: 20, borderRadius: 70
    }
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
export default connect(mapStateToProps, matchDispatchToProps)(Detail);