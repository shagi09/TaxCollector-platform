"use client"
import { useState, useEffect, useRef } from 'react';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { BrowserMultiFormatReader } from '@zxing/library';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Paginator } from 'primereact/paginator';
import { Tooltip } from 'primereact/tooltip';

interface Invoice {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  amount: string;
  status?: 'paid' | 'pending' | 'overdue';
}

const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = useRef(new BrowserMultiFormatReader());

  // Sample data with more variety
  useEffect(() => {
    const statuses: ('paid' | 'pending' | 'overdue')[] = ['paid', 'pending', 'overdue'];
    const sampleData: Invoice[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', date: '2023-05-01', amount: '$100.00', status: 'paid' },
      { id: 2, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', date: '2023-05-02', amount: '$150.00', status: 'pending' },
      { id: 3, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', date: '2023-05-03', amount: '$200.00', status: 'overdue' },
      { id: 4, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', date: '2023-05-04', amount: '$250.00', status: 'paid' },
      { id: 5, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210', date: '2023-05-05', amount: '$300.00', status: 'pending' },
      { id: 6, name: 'Robert Johnson', email: 'robert@example.com', phone: '555-123-4567', date: '2023-05-06', amount: '$350.00', status: 'paid' },
      { id: 7, name: 'Emily Davis', email: 'emily@example.com', phone: '444-789-1234', date: '2023-05-07', amount: '$400.00', status: 'overdue' },
      { id: 8, name: 'Michael Wilson', email: 'michael@example.com', phone: '333-456-7890', date: '2023-05-08', amount: '$450.00', status: 'paid' },
      { id: 9, name: 'Sarah Brown', email: 'sarah@example.com', phone: '222-987-6543', date: '2023-05-09', amount: '$500.00', status: 'pending' },
      { id: 10, name: 'David Taylor', email: 'david@example.com', phone: '111-654-3210', date: '2023-05-10', amount: '$550.00', status: 'paid' },
    ];
    setInvoices(sampleData);
  }, []);

  const downloadAsCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'Date', 'Amount', 'Status'];
    const csvContent = [
      headers.join(','),
      ...invoices.map(invoice => 
        `${invoice.id},"${invoice.name}","${invoice.email}","${invoice.phone}","${invoice.date}","${invoice.amount}","${invoice.status}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'invoices.csv');
  };

  const downloadAsPDF = () => {
    const input = document.getElementById('invoice-table');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoices.pdf');
      });
    }
  };

  const startScanner = async () => {
    try {
      setScanning(true);
      setScannedData(null);
      
      if (!videoRef.current) return;
      
      const result = await codeReader.current.decodeFromVideoDevice(
        undefined, 
        videoRef.current,
        (result, error) => {
          if (result) {
            setScannedData(result.getText());
            stopScanner();
          }
          if (error && !(error instanceof DOMException)) {
            console.error('Scanning error:', error);
          }
        }
      );
      
    } catch (error) {
      console.error('Scanner initialization error:', error);
      setScanning(false);
    }
  };

  const stopScanner = () => {
    codeReader.current.reset();
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      codeReader.current.reset();
    };
  }, []);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'paid':
        return <Badge value="Paid" severity="success" className="ml-2" />;
      case 'pending':
        return <Badge value="Pending" severity="warning" className="ml-2" />;
      case 'overdue':
        return <Badge value="Overdue" severity="danger" className="ml-2" />;
      default:
        return null;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = Object.values(invoice).some(
      value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesDate = date 
      ? new Date(invoice.date).toDateString() === date.toDateString()
      : true;
    
    return matchesSearch && matchesDate;
  });

  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const paginatedInvoices = filteredInvoices.slice(first, first + rows);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card title="Payment History" className="shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2">
              <Button 
                label="Download CSV" 
                icon="pi pi-file-excel" 
                onClick={downloadAsCSV}
                className="p-button-success"
                tooltip="Export all invoices as CSV"
                tooltipOptions={{ position: 'bottom' }}
              />
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search invoices..."
                  tooltip="Search by any field"
                  tooltipOptions={{ position: 'bottom' }}
                />
              </span>
              <div className="border rounded-md">
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Filter by date"
                  className="p-2 rounded-md"
                  isClearable
                />
              </div>
              <Button 
                label="Today" 
                icon="pi pi-calendar" 
                className="p-button-text"
                onClick={() => setDate(new Date())}
                tooltip="Show today's invoices"
                tooltipOptions={{ position: 'bottom' }}
              />
              <Button 
                label="Clear" 
                icon="pi pi-filter-slash" 
                className="p-button-text"
                onClick={() => {
                  setDate(null);
                  setSearchTerm('');
                }}
                tooltip="Clear all filters"
                tooltipOptions={{ position: 'bottom' }}
              />
            </div>
          </div>

          {scannedData && (
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-2">
                <i className="pi pi-check-circle text-green-500"></i>
                <span className="font-bold">Scanned Data:</span>
                <span>{scannedData}</span>
              </div>
            </Card>
          )}

          {scanning && (
            <Card>
              <div className="flex flex-col items-center gap-4">
                <video 
                  ref={videoRef} 
                  width="100%"
                  height="auto"
                  className="border rounded-lg max-w-md"
                />
                <p className="text-gray-600">Point your camera at a barcode to scan</p>
              </div>
            </Card>
          )}

          <div className="overflow-x-auto">
            <table id="invoice-table" className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left font-semibold">ID</th>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Email</th>
                  <th className="py-3 px-4 text-left font-semibold">Phone</th>
                  <th className="py-3 px-4 text-left font-semibold">Date</th>
                  <th className="py-3 px-4 text-right font-semibold">Amount</th>
                  <th className="py-3 px-4 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.length > 0 ? (
                  paginatedInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{invoice.id}</td>
                      <td className="py-3 px-4 font-medium">{invoice.name}</td>
                      <td className="py-3 px-4 text-blue-600 hover:underline cursor-pointer" 
                          onClick={() => window.location.href = `mailto:${invoice.email}`}>
                        {invoice.email}
                      </td>
                      <td className="py-3 px-4">{invoice.phone}</td>
                      <td className="py-3 px-4">
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        {invoice.amount}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {getStatusBadge(invoice.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No invoices found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredInvoices.length > 0 && (
            <Paginator
              first={first}
              rows={rows}
              totalRecords={filteredInvoices.length}
              onPageChange={onPageChange}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} invoices"
              className="border-0"
              rowsPerPageOptions={[5, 10, 25]}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default InvoiceListPage;