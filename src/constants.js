import { styled } from '@mui/system';
import {DataGrid} from '@mui/x-data-grid';

export const StyledDataGrid = styled(DataGrid)({
  width: '100%',
  height: '100%',
  '@media (max-width: 1180px)': {
    width: '120vh',
  },
  '@media (max-width: 1024px)': {
    width: '65vh',
    height: '65vh',
  },
  '@media (max-width: 960px)': {
    width: '185vh',
  },
  '@media (max-width: 820px)': {
    width: '60vh',
  },
  '@media (max-width: 600px)': {
    width: '35vh',
    height: '75vh',
  },
  '@media (height: 768px)': {
    width: '120vh',
  },
});
export const SERVER_URL='http://localhost:8080';