import React from 'react';
import ReactDOM from 'react-dom';
import './../styles/style.scss'

class Card extends React.Component {
  render() {
    return (<div className="card">{this.props.children}</div>)
  }
}

class SelectableCard extends React.Component {

  render() {
    var isSelected = this.props.selected ? "selected " : "";
    var type = this.props.type;
    var className = "selectable " + isSelected + type;
    return (
      <Card>
        <div className={className} onClick={this.props.onClick}>
          {this.props.children}
        </div>
      </Card>
    );
  }
}

class SelectableTitleCard extends React.Component {

  render() {
    var {
      title,
      value,
      price,
      options,
      array,
      type,
      selected
    } = this.props;
    return (
      <SelectableCard onClick={this.props.onClick}
        selected={selected} type={type}>
        {(() => {
          if (options && price == 0) {
            return (
              <div className="content">
                <div className="border-glow"></div>
                <div className="border-box"></div>
                <div className="border-overlay"></div>
                <p className="title">{title}</p>
                <p className="price placeholder">+{price}€</p>
                <ul className="list">
                  {options.map((option, i) => {   
                     return (<li>{option}</li>) 
                  })}
                </ul>
              </div>
            )
          } else if (options && price > 0) {
            return (
              <div className="content">
                <div className="border-glow"></div>
                <div className="border-box"></div>
                <div className="border-overlay"></div>
                <p className="title">{title}</p>
                <p className="price">+{price}€</p>
                <ul className="list">
                  {options.map((option, i) => {   
                     return (<li>{option}</li>) 
                  })}
                </ul>
              </div>
            )
          } else if (type == "color") {
            const divStyle = {
              background: value
            };
            return (
              <div className="content">
                <div className="border-glow"></div>
                <div className="border-box"></div>
                <div className="border-overlay"></div>
                <div className="colorBox" style={divStyle}></div>
                <p className="price">+{price}€</p>
                <p className="title">{title}</p>
              </div>
            )
          } else {
            return (
              <div className="content">
                <div className="border-glow"></div>
                <div className="border-box"></div>
                <div className="border-overlay"></div>
                <p className="title">{title}</p>
                <p className="price">+{price}€</p>
              </div>
            )
          }
        })()}
      </SelectableCard>
    );
  }
}

class SelectableCardList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
  }

  onItemSelected(index) {
    this.setState((prevState, props) => {
        props.onChange(index);
        return {
          selected: index
        }
    });
  }

  render() {
    var {
      contents
    } = this.props;

    var content = contents.map((cardContent, i) => {
      var {
        title,
        value,
        price,
        options,
        type,
        selected
      } = cardContent;
      var selected = this.state.selected == i;
      return (
        <SelectableTitleCard key={i} 
          title={title} value={value} price={price} options={options}
          selected={selected} type={type}
          onClick={(e) => this.onItemSelected(i)} />
      );
    });
    return (<div className="cardlist">{content}</div>);
  }
}

class Configurator extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {
      current_price: 0
    };
  }
  
  onListChanged(selected) {
    this.setState({
      selected: selected,
      current_price: this.props.cardContents[selected].price
    }, function () {
      this.props.handler(this.props.category, this.state.current_price);
    });
  }
  
  render() {
    var {
      category
    } = this.props;
    var className = "hidden " + this.props.category;
    return (
      <div className="column">
        <h2 className="title">{this.props.title}</h2>
        <SelectableCardList 
          contents={this.props.cardContents}
          onChange={this.onListChanged.bind(this)} />
        <span className={className}>{this.state.current_price}</span>
      </div>
    );
  }
  
}

class Final extends React.Component {
  
  constructor(props) {
    super(props)
    this.handler = this.handler.bind(this);
    this.state = {
      base_price: 1000,
      color_price: 0,
      power_price: 0,
      drive_price: 0,
      option_price: 0,
      total_price: 1000
    };
  }
  
  totalCalc() {
    this.setState({
      total_price: this.state.base_price + this.state.color_price + this.state.power_price + this.state.drive_price + this.state.option_price
    });
  }
  
  handler(cat, price) {
    if (cat == "color") {
      this.setState({
        color_price: price
      }, function () {
        this.totalCalc();
      });
    } else if (cat == "power") {
      this.setState({
        power_price: price
      }, function () {
        this.totalCalc();
      });
    } else if (cat == "drive") {
      this.setState({
        drive_price: price
      }, function () {
        this.totalCalc();
      });
    } else if (cat == "option_package") {
      this.setState({
        option_price: price
      }, function () {
        this.totalCalc();
      });
    };
  }
  
  render () {    
    return (
      <div className="container">
        <h1 className="main-title">Spaceship configurator</h1>  
        <div className="column-container">
          <div className="config-container">
            <Configurator title="Select color:" category="color" cardContents={color} handler={this.handler} />
            <Configurator title="Select power:" category="power" cardContents={power} handler={this.handler} />
            <Configurator title="Warp drive:" category="drive" cardContents={warp_drive} handler={this.handler} />
            <Configurator title="Select option package:" category="option_package" cardContents={option_package} handler={this.handler} />
          </div>
          <div className="total-container">
            <div className="column total">
              <div className="content">
                <div className="border-glow"></div>
                <div className="border-box"></div>
                <div className="border-overlay"></div>  
                  <table>
                    <tr className="base-price">
                      <td className="item" colspan="2">Base price:</td>
                      <td className="price-tab"><span>{this.state.base_price}</span>€</td>
                    </tr>
                    <tr id="color" className="color-price">
                      <td className="item" colspan="2">Color:</td>
                      <td className="price-tab">+<span>{this.state.color_price}</span>€</td>
                    </tr>
                    <tr id="power" className="power-price">
                      <td className="item" colspan="2">Power</td>
                      <td className="price-tab">+<span>{this.state.power_price}</span>€</td>
                    </tr>
                    <tr id="drive" className="warp-price">
                      <td className="item" colspan="2">Warp drive:</td>
                      <td className="price-tab">+<span>{this.state.drive_price}</span>€</td>
                    </tr>
                    <tr id="option_package" className="option-price">
                      <td className="item" colspan="2">Option package:</td>
                      <td className="price-tab">+<span>{this.state.option_price}</span>€</td>
                    </tr>
                    <tr className="total-price">
                      <td className="total-text" colspan="2">Total:</td>
                      <td className="total-number"><span>{this.state.total_price}</span>€</td>
                    </tr>
                  </table>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

var color = [{
  title: "Snow",
  price: 0,
  value: "#FFFFFF",
  type: "color"
}, {
  title: "Volcano",
  price: 100,
  value: "#FF7A00",
  type: "color"
}, {
  title: "Sky",
  price: 100,
  value: "#6BE4FF",
  type: "color"
}];

var power = [{
  title: "100 MW",
  price: 0,
  value: 100,
  type: ""
}, {
  title: "150 MW",
  price: 200,
  value: 150,
  type: ""
}, {
  title: "200 MW",
  price: 500,
  value: 200,
  type: ""
}];

var warp_drive = [{
  title: "NO",
  price: 0,
  value: "no",
  type: ""
}, {
  title: "YES",
  price: 1000,
  value: "yes",
  type: ""
}];

var option_package = [{
  title: "Basic",
  price: 0,
  value: "basic",
  options: ["Air conditioning", "Cloth seats", "Fm radio"],
  type: "package"
}, {
  title: "Sport",
  price: 100,
  value: "sport",
  options: ["Air conditioning", "Cloth seats", "Fm radio", "Personal tech support"],
  type: "package"
}, {
  title: "Lux",
  price: 500,
  value: "lux",
  options: ["Air conditioning", "Cloth seats", "Fm radio", "Chrome wheels", "Window tint", "Subwoofer"],
  type: "package"
}];

class App extends React.Component {
  render() {
    return (
      <Final />
    );
  }
}

ReactDOM.render(<App/>, document.getElementById("app"));