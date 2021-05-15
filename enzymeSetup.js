// eslint-disable-next-line @typescript-eslint/no-var-requires
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { configure } = require('enzyme');

configure({ adapter: new Adapter() });
