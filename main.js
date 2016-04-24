var wikipediaSearchString = function (amountToLoad) {
    return 'https://en.wikipedia.org/w/api.php?action=opensearch&search=dance&limit=' + amountToLoad + '&namespace=0&prop=extracts&exintro&format=json&callback=?';
}

function sortSearchArray (data) {
    var searchTerm = data[0]
    var details = data[1].map(function (resolvedSearch, i) {

        return {
            searchTerm: searchTerm, resolvedSearch: resolvedSearch, excerpt: data[2][i], link: data[3][i]
        }

    })
    return details;
}

function setHide(data) {
    // tell the last 5 that they should show
    return data.splice(data.length -5, 5)
        .map((danceItem) => {
            return {
                ...danceItem,
                shouldShow: true
            }
    }).concat(data)
}

var Main = React.createClass({

    getInitialState: function () {
        return {data: []};
    },

    componentWillMount: function () {
        this.loadDetails(5);
    },

    loadDetails: function (amountToLoad) {
        $.getJSON(wikipediaSearchString(amountToLoad))
            .then(sortSearchArray)
            .then(setHide)
            .then((sortedData) => {
                this.setState({data: sortedData})
            })
    }, render: function () {

        return (<div className="main">
            {this.state.data
                // filter out the ones that should not be shown
                .filter(item => item.shouldShow)
                .map(function (item) {
                return (
                    <ul className="wikipedia-info">
                        <li className="resolved-search-term">{item.resolvedSearch}</li>
                        <li className="excerpt">{item.excerpt}</li>
                        <li className="link"><a href={item.link}>{item.link}</a></li>
                    </ul>
                )
            })}

            { /* Hide button when there is no more data */
                this.state.data.length !== 50 ?
                <button className="load-more"
                        onClick={() => {this.loadDetails(this.state.data.length + 5)}}> load more
                </button> : null
            }

        </div>)

    }
})

ReactDOM.render(<Main></Main>, document.getElementById('example'));
