import React from "react";
import AutoComplete from "./AutoComplete";

class Country extends React.Component {
    constructor(props) {
        super(props)
        this.InputRef = React.createRef(null);
        this.searchContainer = React.createRef(null);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.showSuggestion = this.showSuggestion.bind(this);
        this.hideSuggestion = this.hideSuggestion.bind(this);

        this.state = {
            Suggestion: [],
            Search: "",
            Result: "",
            isVisbile: false,
            isResultVisbile: false,
        }
    }
    componentWillMount = () => {
        window.addEventListener("mousedown", this.handleClickOutside);
    }
    componentWillUnmount = () => {
        window.removeEventListener("mousedown", this.handleClickOutside);
    }
    handleClickOutside(event) {
        if (
            this.searchContainer.current &&
            !this.searchContainer.current.contains(event.target)
        ) {
            this.hideSuggestion();
        }
    }
    showSuggestion() {
        this.setState({ isVisbile: true });
    }

    hideSuggestion() {
        this.setState({ isVisbile: false });
    }
    componentDidUpdate() {
        fetch("https://restcountries.eu/rest/v2/all")
            .then((res) => res.json())
            .then((data) => {
                this.setState({
                    Suggestion:
                        data.filter((i) =>
                            i.name.toLocaleLowerCase().includes(this.state.Search.toLocaleLowerCase())
                        )
                });
            });
        this.InputRef.current.focus();
    }
    render() {
        return (
            <div id="Full">
                <div id="Container">
                    <div>
                        <input
                            type="text"
                            placeholder="Enter the Country name"
                            onChange={(e) => {
                                this.setState({ Search: e.target.value });
                            }}
                            onClick={() => {
                                this.showSuggestion();
                                this.setState({ isResultVisbile: false });
                            }}
                            value={this.state.Search}
                            ref={this.InputRef}
                        />
                    </div>
                    <div
                        id="Box"
                        ref={this.searchContainer}
                        style={{ display: `${this.state.isVisbile ? "block" : "none"}` }}
                    >
                        <ul>
                            {this.state.Suggestion.map((i, ind) => {
                                return (
                                    <li
                                        key={ind}
                                        onClick={() => {
                                            this.setState({ Search: i.name });
                                            this.hideSuggestion();
                                            this.setState({ Result: i });
                                            this.setState({ isResultVisbile: true });
                                        }}
                                    >
                                        <div className="Card">
                                            <p>
                                                <img src={i.flag} width={20} height={20} alt={i.name} />{" "}
                                                {i.name}
                                            </p>
                                            <p>Capital: {i.capital}</p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
                <div
                    id="Result"
                    style={{ display: `${this.state.isResultVisbile ? "block" : "none"}` }}
                >
                    <AutoComplete {...this.state.Result} />
                </div>
            </div>
        );
    }
}

export default Country;