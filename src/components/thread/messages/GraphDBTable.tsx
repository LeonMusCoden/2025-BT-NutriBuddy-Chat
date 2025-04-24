import { Table } from '../../ui/table';
import { format } from 'date-fns';

interface GraphDBTableProps {
  data: any;
}

export function GraphDBTable({ data }: GraphDBTableProps) {
  // Process and format a cell value based on its content
  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return '';
    
    // Check if value is or can be parsed as a date
    if (value instanceof Date || typeof value === 'string' && isISODateString(value)) {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return format(date, 'MMM d, yyyy');
        }
      } catch (error) {
        // If date parsing fails, continue to other checks
      }
    }
    
    // Check if value is or can be parsed as a number
    if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
      try {
        const num = typeof value === 'number' ? value : parseFloat(value);
        // Only format if it's actually a number and has decimal places
        if (!isNaN(num)) {
          // If it's a whole number, don't show decimal places
          return Number.isInteger(num) ? num.toString() : num.toFixed(2);
        }
      } catch (error) {
        // If number parsing fails, continue to other checks
      }
    }
    
    // Handle string values - clean any URLs
    if (typeof value === 'string') {
      return cleanString(value);
    }
    
    // Default fallback - convert to string
    return String(value);
  };

  // Helper function to check if a string is an ISO date format
  const isISODateString = (value: string): boolean => {
    // Basic ISO date pattern check - will catch most date formats from APIs
    const isoPattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(.\d{3})?Z?)?$/;
    return isoPattern.test(value);
  };

  // Remove URL prefixes for cleaner display
  const cleanString = (value: string): string => {
    return value
      .replace('https://interactions.ics.unisg.ch/foodcoach#', '')
      .replace('http://qudt.org/vocab/unit#', '');
  };

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
          const rawValue = tableData[column][i.toString()];
          rowObj[column] = formatCellValue(rawValue);
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
  
  // Format the column headers for display
  const formatColumnName = (name: string): string => {
    // Capitalize first letter and convert camelCase to spaces
    return name
      // Insert a space before all capital letters
      .replace(/([A-Z])/g, ' $1')
      // Capitalize the first character
      .replace(/^./, str => str.toUpperCase());
  };
  
  return (
    <Table.Root variant="surface" className="rounded-md w-full">
      <Table.Header>
        <Table.Row>
          {columns.map((column, index) => (
            <Table.ColumnHeaderCell key={index}>
              {formatColumnName(column)}
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
