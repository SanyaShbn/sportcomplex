
/* eslint-disable */
import React, {useEffect} from 'react';
//Report Viewer source
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
import '@boldreports/javascript-reporting-controls/Content/material/bold.reports.all.min.css';
//Data-Visualization
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';
//Reports react base
import '@boldreports/react-reporting-components/Scripts/bold.reports.react.min';
import '@boldreports/global/l10n/ej.localetexts.ru-RU.min.js'
import '@boldreports/global/i18n/ej.culture.ru-RU.min.js'
import { useTheme } from '@mui/material/styles';

var viewerStyle = {'height': '700px', 'width': '100%'}
var locale = 'ru-RU'
  
const ReportViewer = ({ setSelectedLink, link }) => {

  useEffect(() => {
	setSelectedLink(link);
  }, []);

  const theme = useTheme();
  let color = theme.palette.mode;

  return (
    <>
     {color === 'dark' && (
        <link href="https://cdn.boldreports.com/6.1.34/content/high-contrast-01/bold.reports.all.min.css" rel="stylesheet" />
    )}
    <div style={viewerStyle}>
     <BoldReportViewerComponent
     id="reportviewer-container"
     reportServiceUrl = {'https://demos.boldreports.com/services/api/ReportViewer'}
     reportPath = {'~/Resources/docs/sales-order-detail.rdl'}
     locale={locale} >
     </BoldReportViewerComponent>
    </div>
    </>
  );
}
  
export default ReportViewer;