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
            .then((sortedData) => {
                this.setState({data: sortedData})
            })
    }, render: function () {

        return (<div className="main">
            {this.state.data.map(function (item) {
                return (
                    <ul className="wikipedia-info">
                        <li className="resolved-search-term">{item.resolvedSearch}</li>
                        <li className="excerpt">{item.excerpt}</li>
                        <li className="link"><a href={item.link}>{item.link}</a></li>
                    </ul>
                )
            })}
            <button className="load-more"
                    onClick={() => {this.loadDetails(this.state.data.length + 5)}}> load more
            </button>
        </div>)

    }
})

ReactDOM.render(<Main></Main>, document.getElementById('example'));
