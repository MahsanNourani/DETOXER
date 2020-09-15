import { createMuiTheme } from '@material-ui/core/styles';

const palette = {
  primary: { main: '#536dfe' }, //82B1FF
  secondary: { main: '#cddc39', transparent: "#cddc391f"},  //#e44f9e //#D81B60
};
const themeName = 'Malibu Amaranth Goats';

// const typography = {
//   body1: {
//     fontSize: '1.2rem',
//     '@media (min-width:600px)': {
//       fontSize: '1.5rem',
//     },
//     [theme.breakpoints.up('md')]: {
//       fontSize: '2.4rem',
//     },
//   }
// };

export default createMuiTheme({ palette, themeName });