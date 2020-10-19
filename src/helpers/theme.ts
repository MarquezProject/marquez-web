
import {createMuiTheme} from '@material-ui/core/styles'

export const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          color: '#fff'
        }
      },
    },
  },
  typography: {
    h3: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 2,
    },
    fontSize: 14
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#3587e8'
    },
    background: {
      default: '#191f26'
    },
    secondary: {
      main: '#454f5b'
    }
  }
})

// 1px for bottom border
export const HEADER_HEIGHT = 96 + 1
