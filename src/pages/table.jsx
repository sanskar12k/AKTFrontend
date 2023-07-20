import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridToolbarExport } from '@mui/x-data-grid';
import { useState, useEffect } from "react"
import api from './api'
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import Graph from './graph';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Skelton from '../skeleton/dashboard';
import './table.css'
import { Button, InputLabel, Modal, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Api from './api';
const columns: GridColDef[] = [
  {
    field: 'created',
    headerName: 'Date',
    width: 180
  },
  {
    field: 'store',
    headerName: 'Store',
    sortable: false,
    width: 180,
  },
  {
    field: 'sale',
    headerName: 'Sale',
    width: 180,
  },
  {
    field: 'customer',
    headerName: 'Customer',
    width: 150,
  },
  {
    field: 'paytm',
    headerName: 'Paytm',
    // type: 'number',
    width: 160,
  },
  {
    field: 'hdfc',
    headerName: 'HDFC',
    width: 170,
  },
  {
    field: 'addedName',
    headerName: 'Added by',
    width: 180
  }
];

function CustomToolbar() {
  return (
    <GridToolbarExport />
  );
}

const style = {
  position: 'absolute' ,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 440,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 3,
};
export default function DataGridDemo(props) {
  const [saleO, setSale] = useState([]);
  const [xDataO, setX] = useState([]);
  const [yDataO, setY] = useState([]);
  const [saleN, setSaleN] = useState([]);
  const [xDataN, setXN] = useState([]);
  const [yDataN, setYN] = useState([]);
  const [param, setParam] = useState('sale');
  const [days, setDays] = useState(30);
  const [tableLoad, setLoad] = useState(false);
  const [store, setStore] = useState('AKT Old');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [report, setReport] = useState();
  const [sale, setSales] = useState(0);
  const [customer, setCustomer] = useState(0);
  const [paytm, setPaytm] = useState(0);
  const [hdfc, setHdfc] = useState(0);
  const [value, setValue] = useState(
    dayjs(Date.now())
  );
  const [id, setId] = useState();
  const handleChangeStore = (e) => {
    setStore(e.target.value);
  };
  const handleEvent = (
    params,  // GridCellParams
    event,   // MuiEvent<React.MouseEvent<HTMLElement>>
    details, // GridCallbackDetails
  ) => {
    // console.log(params, event, details)
  }
  const fetchSale = async () => {
    try {
      setLoad(true)
      const res = await api.get(`/user/sale`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': document.cookie
          },
        }, { withCredentials: true });
      if (res.status === 200) {
        // console.log('sdk')
        const data = await res.data;
        // console.log(data.report)
        let y = [];
        let x = [];
        if (data.reportOld?.length > 0 || data.reportNew?.length > 0) {
          data.reportOld = data.reportOld.slice(0, Math.min(days, data.reportOld.length))
          setSale(
            data.reportOld.map(e => {
              if (e.created) { e.created = new Date(e.created).toLocaleDateString('en-GB'); }
              if (e.added) e.username = `${e.added.fname} ${e.added.lname}`

              x.push(e.created);
              y.push(e.sale);
              return { ...e }
            })
          )
          let xn = [];
          let yn = [];
          data.reportNew = data.reportNew.slice(0, Math.min(days, data.reportNew.length))
          setSaleN(
            data.reportNew.map(e => {
              if (e.created) { e.created = new Date(e.created).toLocaleDateString('en-GB'); }
              if (e.added) e.username = `${e.added.fname} ${e.added.lname}`

              xn.push(e.created);
              yn.push(e.sale);
              return { ...e }
            })
          )
          // console.log(saleO)
          setX([...x]);
          setY([...y]);
          setXN([...xn]);
          setYN([...yn]);
          // console.log(sale)
        }
      }
      setLoad(false)
    }
    catch (e) { console.log(e) }
  }

  const updateSale = async(id) => {
    try {
      setLoad(true);
      const res = await Api.patch(`/sale/${id}/edit`,{
      sale: sale,
      customer:customer,
      store:store,
      paytm:paytm,
      hdfc:hdfc,
      created: value
    },
      {
        headers: {
          "Content-Type": "application/json",
          // "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          'Authorization': document.cookie
        }
      },
      )
      console.log(res)
      setLoad(false);
    } catch (error) {
      
    }
  }

  const makeGraphAxes = (param) => {
    let y = [];
    if (store === 'AKT Old') {
      saleO.map(e => {
        if (param === 'paytm') {
          y.push(e.paytm);
        }
        else if (param === 'customer') {
          y.push(e.customer)
        }
        else if (param === 'hdfc') {
          y.push(e.hdfc)
        }
        else {
          y.push(e.sale);
        }
      }

      )
      setY([...y]);
    }
    else {
      saleN.map(e => {
        if (param === 'paytm') {
          y.push(e.paytm);
        }
        else if (param === 'customer') {
          y.push(e.customer)
        }
        else if (param === 'hdfc') {
          y.push(e.hdfc)
        }
        else {
          y.push(e.sale);
        }
      }

      )
      setYN([...y]);
    }
  }
  useEffect(() => {
    fetchSale();
  }, [days])
  useEffect(() => {
    makeGraphAxes(param);
  }, [param, days, store])
  // console.log(row)
  return (
    <>
      {tableLoad ? <Skelton /> : <div className="container table-cont ps-md-1" style={{
        paddingLeft: "0"
      }}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h4" align='center' component="p">
            Report
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
              fullWidth
                label="Date"
                margin="normal"
                inputFormat="MM/DD/YYYY"
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <FormControl fullWidth margin="normal">
              <InputLabel id="demo-simple-select-helper-label">Store</InputLabel>
              <Select
                align="left"
                margin="normal"
                labelId="role"
                id="role-select"
                value={store}
                required
                label="Store"
                onChange={handleChangeStore}
              >
                <MenuItem value="AKT Old">AKT Old</MenuItem>
                <MenuItem value="AKT New">AKT New</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              id="outlined-required"
              label="Sale"
              fullWidth
              margin="normal"
              InputProps={{ inputProps: { min: 0 } }}
              value={sale}
              type="number"
              onChange={e => setSale(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="Customers"
              value={customer}
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              onChange={e => setCustomer(e.target.value)}
            />

            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="Paytm"
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              value={paytm}
              onChange={e => setPaytm(e.target.value)}
            />
            <TextField
              required
              fullWidth
              margin="normal"
              id="outlined-required"
              label="HDFC"
              InputProps={{ inputProps: { min: 0 } }}
              type="number"
              value={hdfc}
              onChange={e => setHdfc(e.target.value)}
            />
            <Typography id="modal-modal-description" sx={{ mt: 2 }} align='center' >
              <Button align='center' variant='contained' color='success' onClick={() => {updateSale(id); console.log("updated") }}>Save</Button>
            </Typography>
          </Box>
        </Modal>
        <div className="col-12">
          <div className="row">
            <div className=" order-md-1 order-2 col-md-7 col-12">
              {store === 'AKT Old' && <> <Graph xdata={xDataO} ydata={yDataO} param={param} /> </>}
              {store === 'AKT New' && <> <Graph xdata={xDataN} ydata={yDataN} param={param} />   </>}
            </div>
            <div className=" order-md-2 order-1 col-md-5 col-12 mt-md-3">
              <Select
                align="left"
                fullWidth
                className='table-select'
                labelId="role"
                id="role-select"
                value={store}
                onChange={(e) => { setStore(e.target.value) }}
              >
                <MenuItem value="AKT Old">AKT Old</MenuItem>
                <MenuItem value="AKT New">AKT New</MenuItem>
              </Select>
              <Select
                className='table-select'
                align="left"
                fullWidth
                margin="dense"
                labelId="role"
                id="role-select"
                value={days}
                // label="Days"
                onChange={(e) => { setDays(e.target.value) }}
              >
                <MenuItem value="30"> Last 30 Days</MenuItem>
                <MenuItem value="60">Last 2 Month</MenuItem>
                <MenuItem value="180">Last 6 Month</MenuItem>
                {/* <MenuItem value="Hdfc">HDFC</MenuItem> */}
              </Select>
              {/* </FormControl>
              <FormControl> */}
              <Select
                className='table-select'
                align="left"
                fullWidth
                margin="dense"
                labelId="role"
                id="role-select"
                value={param}
                // label="Param"
                onChange={(e) => { setParam(e.target.value) }}
              >
                <MenuItem value="sale">Sale</MenuItem>
                <MenuItem value="paytm">Paytm</MenuItem>
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="Hdfc">HDFC</MenuItem>
              </Select>
            </div>
          </div>

        </div>
        {store === 'AKT Old' && <>
          <Box>
            <DataGrid
              autoHeight
              onCellDoubleClick={handleEvent}
              getRowId={(row) => row._id}
              rows={saleO}
              columns={columns}
              // onCellClick={(params, event) => {
              //   console.log(params.row)
              //   setReport(params.row)
              //   setSales(params.row.sale);
              //   setHdfc(params.row.hdfc);
              //   setPaytm(params.row.paytm);
              //   setValue(params.row.created);
              //   setId(params.row._id);
              //   setCustomer(params.row.customer)
              //   setStore(params.row.store);
              //   handleOpen();
              // }}
              pageSize={10}
              rowsPerPageOptions={[10]}
              loading={tableLoad}
              experimentalFeatures={{ newEditingApi: true }}
              components={{ Toolbar: GridToolbarExport }}
            />
          </Box>
        </>
        }
        {store === 'AKT New' && <>
          <Box >
            <DataGrid
              autoHeight
              getRowId={(row) => row._id}
              rows={saleN}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              loading={tableLoad}
              experimentalFeatures={{ newEditingApi: true }}
              components={{ Toolbar: GridToolbarExport }}
            />
          </Box>
        </>}
      </div>}
    </>
  );
}


