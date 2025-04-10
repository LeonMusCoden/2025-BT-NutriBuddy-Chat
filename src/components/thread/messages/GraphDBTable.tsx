import { Table } from '../../ui/table';

interface GraphDBTableProps {
  data: any;
}

export function GraphDBTable({ data }: GraphDBTableProps) {
  // Handle different data formats
  let tableData: Record<string, any> = {};
  let columns: string[] = [];
  const rows: Record<string, any>[] = [];
  
  try {
    // Parse data if it's a string
    if (typeof data === 'string') {
      try {
        tableData = JSON.parse(data);
      } catch (error) {
        console.error('Error parsing GraphDB data:', error);
        return <div>Error parsing data</div>;
      }
    } else if (data && typeof data === 'object') {
      tableData = data;
    }
    
    // If we have artifact structure, use that
    if (tableData.artifact && typeof tableData.artifact === 'object') {
      tableData = tableData.artifact;
    }
    
    // Get columns from the data object keys
    columns = Object.keys(tableData);
    
    // Convert column-based data to row-based data
    if (columns.length > 0) {
      const rowCount = Object.keys(tableData[columns[0]]).length;
      
      for (let i = 0; i < rowCount; i++) {
        const rowObj: Record<string, any> = {};
        
        columns.forEach(column => {
          rowObj[column] = tableData[column][i.toString()];
        });
        
        rows.push(rowObj);
      }
    }
  } catch (error) {
    console.error('Error processing GraphDB data:', error);
    return <div>Error processing data</div>;
  }
  
  if (columns.length === 0 || rows.length === 0) {
    return <div>No data available</div>;
  }
  
  return (
    <Table.Root variant="surface" className="rounded-md">
      <Table.Header>
        <Table.Row>
          {columns.map((column, index) => (
            <Table.ColumnHeaderCell key={index}>
              {column}
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      
      <Table.Body>
        {rows.map((row, rowIndex) => (
          <Table.Row key={rowIndex}>
            {columns.map((column, colIndex) => (
              colIndex === 0 ? (
                <Table.RowHeaderCell key={colIndex}>
                  {row[column]}
                </Table.RowHeaderCell>
              ) : (
                <Table.Cell key={colIndex}>
                  {row[column]}
                </Table.Cell>
              )
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}
