
//Importing modules

const { Provider, connect } = ReactRedux;
const { applyMiddleware, createStore, combineReducers, bindActionCreators } = Redux;
const CHANGE_INPUT = "change_input";
const MAXIMIZE_EDITOR = "maximize_editor";
const MAXIMIZE_PREVIEWER = "maximize_previewer";



const initialInput = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg) `;

let initialFullScreenEditor = false;
let initialFullScreenPreviewer = false;
marked.setOptions({
  breaks: true });


//Redux intialisation
let changeInput = function (input) {
  return {
    type: CHANGE_INPUT,
    payload: input };

};

//action creator for maximizing editor

let maximizeEditor = max => {
  let newMax = false;
  if (max) {
    newMax = true;
  }
  return {
    type: MAXIMIZE_EDITOR,
    payload: newMax };

};

//action creator for maximizing previewer

let maximizePreviewer = max => {
  let newMax = false;
  if (max) {
    newMax = true;
  }
  return {
    type: MAXIMIZE_PREVIEWER,
    payload: newMax };

};

let inputReducer = function (state = { input: initialInput }, action) {
  switch (action.type) {
    case CHANGE_INPUT:
      return {
        input: action.payload };

    default:
      return state;}

};

let maxEditorReducer = function (state = { fullScreenEditor: initialFullScreenEditor }, action) {
  switch (action.type) {
    case MAXIMIZE_EDITOR:
      return {
        fullScreenEditor: action.payload };

    default:
      return state;}

};

//reducer for maximizing previewer
let maxPreviewerReducer = function (state = { fullScreenPreviewer: initialFullScreenPreviewer }, action) {
  switch (action.type) {
    case MAXIMIZE_PREVIEWER:
      return {
        fullScreenPreviewer: action.payload };

    default:
      return state;}

};


const rootReducer = combineReducers({
  stateInput: inputReducer,
  stateMaxEditor: maxEditorReducer,
  stateMaxPreviewer: maxPreviewerReducer });



let store = createStore(rootReducer);



// React Components
class Editor extends React.Component {
  handleChange(e) {
    this.props.submitInput(e.target.value);
  }

  handleMaxEditor() {
    let opposite = !this.props.maxEditor.fullScreenEditor;
    this.props.submitMaxEditor(opposite);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { id: "editor-container", className: "editor-container-size" }, /*#__PURE__*/
      React.createElement("h1", { id: "editor-header", className: "header" }, /*#__PURE__*/React.createElement("i", { className: "icons fab fa-free-code-camp" }), " ", /*#__PURE__*/React.createElement("span", null, "Editor"), /*#__PURE__*/
      React.createElement("button", { id: "maxmin-editor", className: "max-buttons", onClick: this.handleMaxEditor.bind(this) }, /*#__PURE__*/
      React.createElement("i", { className: this.props.icon }))), /*#__PURE__*/



      React.createElement("textarea", { id: "editor", className: this.props.addClass, onChange: this.handleChange.bind(this), value: this.props.editorInput.input })));



  }}


class Previewer extends React.Component {
  handleMaxPreviewer() {
    this.props.submitMaxPreviewer(!this.props.maxPreviewer.fullScreenPreviewer);
  }

  render() {
    let mdText = marked.parse(this.props.editorInput.input);

    return /*#__PURE__*/(
      React.createElement("div", { id: "previewer-container", className: "previewer-container-size" }, /*#__PURE__*/
      React.createElement("h1", { id: "previewer-header", className: "header" }, /*#__PURE__*/React.createElement("i", { className: "icons fab fa-free-code-camp" }), " ", /*#__PURE__*/React.createElement("span", null, "Previewer"), " ", /*#__PURE__*/React.createElement("button", { id: "maxmin-previewer", className: "max-buttons", onClick: this.handleMaxPreviewer.bind(this) }, /*#__PURE__*/React.createElement("i", { className: this.props.icon }))), /*#__PURE__*/
      React.createElement("p", { id: "preview", className: "main-body", dangerouslySetInnerHTML: { __html: mdText } })));



  }}


class AppBackground extends React.Component {


  render() {
    let fullScreen = function (maxEditor, maxPreviewer) {
      let showElement = "Editor";
      if (maxEditor && !maxPreviewer) {
        showElement = "Editor";
      } else
      if (!maxEditor && maxPreviewer) {
        showElement = "Previewer";
      } else
      {
        showElement = "Both";
      }
      return showElement;
    };

    let showElement = "Both";
    showElement = fullScreen(this.props.maxEditor.fullScreenEditor, this.props.maxPreviewer.fullScreenPreviewer);


    return /*#__PURE__*/(
      React.createElement("div", { id: "app-background" },
      showElement == "Editor" ? /*#__PURE__*/React.createElement(EditorContainer, { icon: "fa fa-minimize", addClass: "max-editor" }) : /*#__PURE__*/React.createElement("div", null),
      showElement == "Previewer" ? /*#__PURE__*/React.createElement(PreviewerContainer, { icon: "fa fa-minimize" }) : /*#__PURE__*/React.createElement("div", null),
      showElement == "Both" ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(EditorContainer, { icon: "fa fa-maximize", addClass: "min-editor" }), " ", /*#__PURE__*/React.createElement(PreviewerContainer, { icon: "fa fa-maximize" })) : /*#__PURE__*/React.createElement("div", null)));


  }}




//map state to props
let mapStateToProps = function (state) {
  return {
    editorInput: state.stateInput,
    maxEditor: state.stateMaxEditor,
    maxPreviewer: state.stateMaxPreviewer };

};


// map dispatch to props
let mapDispatchToProps = function (dispatch) {
  //return bindActionCreators({changeInput},dispatch);
  return {
    submitInput: input => {
      return dispatch(changeInput(input));
    },
    submitMaxEditor: max => {
      return dispatch(maximizeEditor(max));
    },
    submitMaxPreviewer: max => {
      return dispatch(maximizePreviewer(max));
    } };

};

const EditorContainer = connect(mapStateToProps, mapDispatchToProps)(Editor);
const PreviewerContainer = connect(mapStateToProps, mapDispatchToProps)(Previewer);
const AppBackgroundContainer = connect(mapStateToProps, null)(AppBackground);



class App extends React.Component {

  render() {
    return /*#__PURE__*/React.createElement(Provider, { store: store }, /*#__PURE__*/
    React.createElement(AppBackgroundContainer, null));



  }}


//Render to DOM
ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById('root'));




