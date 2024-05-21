import React from 'react';
/* eslint-disable */
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-designer.min';
import '@boldreports/javascript-reporting-controls/Scripts/bold.report-viewer.min';
import '@boldreports/javascript-reporting-controls/Content/material/bold.reports.all.min.css';
import '@boldreports/javascript-reporting-controls/Content/material/bold.reportdesigner.min.css';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.bulletgraph.min';
import '@boldreports/javascript-reporting-controls/Scripts/data-visualization/ej.chart.min';

var designerStyle = {
  'height': '700px',
  'width': '100%'
};

function ReportDesigner() {
  return (
    <div style={designerStyle} className="App">
      <BoldReportDesignerComponent
        id="reportdesigner_container"
        serviceUrl={'https://demos.boldreports.com/services/api/ReportingAPI'}
      />
    </div>
  );
}

export default ReportDesigner;
