import React from 'react';

import ReactTable from 'react-table';
import 'react-table/react-table.css';

const ReactTableCustom = ({ columns, data, defaultPageSize }) => {
	return (
		<ReactTable data={data} columns={columns} defaultPageSize={defaultPageSize || 5} className="-striped -highlight" />
	);
};

export default ReactTableCustom;
